// Pure HTML builders for RegionalIntelligenceBoard. Kept dependency-free
// (only escapeHtml from sanitize) so it can be imported by node:test runners
// without pulling in Vite-only services like @/services/i18n.
//
// The Panel class in RegionalIntelligenceBoard.ts is a thin wrapper that
// calls these builders and inserts the result via Panel.setContent().

import { escapeHtml } from '@/utils/sanitize';
import { BRAZIL_2025_SAFETY_OVERVIEW } from '@/data/brazil-public-safety-2025';
import type {
  RegionalSnapshot,
  BalanceVector,
  ActorState,
  ScenarioSet,
  TransmissionPath,
  Trigger,
  NarrativeSection,
  RegionalNarrative,
  RegimeTransition,
  RegionalBrief,
} from '@/generated/client/megabrain-market/intelligence/v1/service_client';

/** Non-global regions available in the dropdown. Matches shared/geography.js REGIONS. */
export const BOARD_REGIONS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'brazil', label: 'Brazil & Green Energy Corridors (Ceará Hub)' },
  { id: 'mena', label: 'Middle East & North Africa' },
  { id: 'east-asia', label: 'East Asia & Pacific' },
  { id: 'europe', label: 'Europe & Central Asia' },
  { id: 'north-america', label: 'North America' },
  { id: 'south-asia', label: 'South Asia' },
  { id: 'latam', label: 'Latin America & Caribbean' },
  { id: 'sub-saharan-africa', label: 'Sub-Saharan Africa' },
];

export const DEFAULT_REGION_ID = 'brazil';

// ────────────────────────────────────────────────────────────────────────────
// Request-sequence arbitrator (race condition fix for PR #2963 review)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Request-sequence arbitrator. The panel's loadCurrent() claims a monotonic
 * sequence before awaiting its RPC; when the response comes back it passes
 * (mySequence, latestSequence) to this helper and only renders when it wins.
 *
 * A rapid dropdown switch therefore goes: seq=1 claims → seq=2 claims →
 * seq=1 returns, stale (1 !== 2), discarded → seq=2 returns, fresh, renders.
 * Without this check the earlier in-flight response could overwrite the
 * newer region's render.
 *
 * Pure — exported only so it can be unit tested in isolation from the
 * Panel class (which can't be imported by node:test due to import.meta.glob
 * in @/services/i18n).
 */
export function isLatestSequence(mySequence: number, latestSequence: number): boolean {
  return mySequence === latestSequence;
}

// ────────────────────────────────────────────────────────────────────────────
// Top-level
// ────────────────────────────────────────────────────────────────────────────

/** Build the complete board HTML from a hydrated snapshot. Pure. */
export function buildBoardHtml(snapshot: RegionalSnapshot): string {
  return [
    buildNarrativeHtml(snapshot.narrative),
    buildRegimeBlock(snapshot),
    buildBalanceBlock(snapshot.balance),
    buildActorsBlock(snapshot.actors),
    buildScenariosBlock(snapshot.scenarioSets),
    buildTransmissionBlock(snapshot.transmissionPaths),
    buildWatchlistBlock(snapshot.triggers?.active ?? [], snapshot.narrative?.watchItems ?? []),
    buildMetaFooter(snapshot),
  ].join('');
}

// ────────────────────────────────────────────────────────────────────────────
// Section wrappers
// ────────────────────────────────────────────────────────────────────────────

function section(title: string, bodyHtml: string, extraStyle = ''): string {
  return `
    <div class="rib-section" style="margin-bottom:12px;padding:10px 12px;border:1px solid var(--border);border-radius:4px;background:rgba(255,255,255,0.02);${extraStyle}">
      <div class="rib-section-title" style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:8px">${escapeHtml(title)}</div>
      ${bodyHtml}
    </div>
  `;
}

// ────────────────────────────────────────────────────────────────────────────
// Narrative
// ────────────────────────────────────────────────────────────────────────────

function narrativeSectionHtml(label: string, sec: NarrativeSection | undefined): string {
  const text = (sec?.text ?? '').trim();
  if (!text) return '';
  const evidence = (sec?.evidenceIds ?? []).filter((id) => id.length > 0);
  const evidencePill = evidence.length > 0
    ? `<span style="font-size:10px;color:var(--text-dim);margin-left:6px">[${escapeHtml(evidence.slice(0, 4).join(', '))}]</span>`
    : '';
  return `
    <div class="rib-narrative-row" style="margin-bottom:8px">
      <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:2px">${escapeHtml(label)}${evidencePill}</div>
      <div style="font-size:12px;line-height:1.5">${escapeHtml(text)}</div>
    </div>
  `;
}

export function buildNarrativeHtml(narrative: RegionalNarrative | undefined): string {
  if (!narrative) return '';
  const rows = [
    narrativeSectionHtml('Situation', narrative.situation),
    narrativeSectionHtml('Balance Assessment', narrative.balanceAssessment),
    narrativeSectionHtml('Outlook — 24h', narrative.outlook24h),
    narrativeSectionHtml('Outlook — 7d', narrative.outlook7d),
    narrativeSectionHtml('Outlook — 30d', narrative.outlook30d),
  ].join('');
  if (!rows) return '';
  return section('Narrative', rows);
}

// ────────────────────────────────────────────────────────────────────────────
// Regime
// ────────────────────────────────────────────────────────────────────────────

export function buildRegimeBlock(snapshot: RegionalSnapshot): string {
  const regime = snapshot.regime;
  const label = regime?.label ?? 'unknown';
  const previous = regime?.previousLabel ?? '';
  const driver = regime?.transitionDriver ?? '';
  const changed = previous && previous !== label;
  const previousLine = changed
    ? `<div style="font-size:11px;color:var(--text-dim);margin-top:2px">Was: ${escapeHtml(previous)}${driver ? ` · ${escapeHtml(driver)}` : ''}</div>`
    : '';
  const body = `
    <div class="rib-regime-label" style="font-size:15px;font-weight:600;text-transform:capitalize">${escapeHtml(label.replace(/_/g, ' '))}</div>
    ${previousLine}
  `;
  return section('Regime', body);
}

// ────────────────────────────────────────────────────────────────────────────
// Balance
// ────────────────────────────────────────────────────────────────────────────

/**
 * Render a single axis row with label, value text, and horizontal bar.
 * Values are already in [0, 1] for axes; net_balance is in [-1, 1] and
 * is rendered separately with a centered zero point.
 */
function axisRow(label: string, value: number, colorClass: string): string {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return `
    <div style="display:grid;grid-template-columns:110px 40px 1fr;gap:8px;align-items:center;margin-bottom:4px">
      <div style="font-size:11px;color:var(--text-dim)">${escapeHtml(label)}</div>
      <div style="font-size:11px;font-variant-numeric:tabular-nums">${value.toFixed(2)}</div>
      <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct.toFixed(1)}%;background:var(${colorClass})"></div>
      </div>
    </div>
  `;
}

export function buildBalanceBlock(balance: BalanceVector | undefined): string {
  if (!balance) {
    return section('Balance Vector', '<div style="font-size:11px;color:var(--text-dim)">Unavailable</div>');
  }
  const pressures = [
    axisRow('Coercive', balance.coercivePressure, '--danger'),
    axisRow('Fragility', balance.domesticFragility, '--danger'),
    axisRow('Capital', balance.capitalStress, '--danger'),
    axisRow('Energy Vuln', balance.energyVulnerability, '--danger'),
  ].join('');
  const buffers = [
    axisRow('Alliance', balance.allianceCohesion, '--accent'),
    axisRow('Maritime', balance.maritimeAccess, '--accent'),
    axisRow('Energy Lev', balance.energyLeverage, '--accent'),
  ].join('');

  const net = balance.netBalance;
  const netPct = Math.max(-1, Math.min(1, net));
  const netFill = Math.abs(netPct) * 50;
  const netSide = netPct >= 0 ? 'right' : 'left';
  const netColor = netPct >= 0 ? 'var(--accent)' : 'var(--danger)';
  const netBar = `
    <div style="display:grid;grid-template-columns:110px 40px 1fr;gap:8px;align-items:center;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,0.1)">
      <div style="font-size:11px;color:var(--text-dim);font-weight:600">Net Balance</div>
      <div style="font-size:11px;font-variant-numeric:tabular-nums;font-weight:600">${net.toFixed(2)}</div>
      <div style="position:relative;height:6px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.3)"></div>
        <div style="position:absolute;${netSide}:50%;top:0;bottom:0;width:${netFill.toFixed(1)}%;background:${netColor}"></div>
      </div>
    </div>
  `;

  const body = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:4px">Pressures</div>
        ${pressures}
      </div>
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:4px">Buffers</div>
        ${buffers}
      </div>
    </div>
    ${netBar}
  `;
  return section('Balance Vector', body);
}

// ────────────────────────────────────────────────────────────────────────────
// Actors
// ────────────────────────────────────────────────────────────────────────────

export function buildActorsBlock(actors: ActorState[]): string {
  if (!actors || actors.length === 0) {
    return section('Actors', '<div style="font-size:11px;color:var(--text-dim)">No actor data</div>');
  }
  const sorted = [...actors].sort((a, b) => (b.leverageScore ?? 0) - (a.leverageScore ?? 0)).slice(0, 5);
  const rows = sorted.map((a) => {
    const deltaText = a.delta > 0 ? `+${a.delta.toFixed(2)}` : a.delta.toFixed(2);
    const deltaColor = a.delta > 0 ? 'var(--danger)' : a.delta < 0 ? 'var(--accent)' : 'var(--text-dim)';
    const domains = (a.leverageDomains ?? []).slice(0, 3).join(', ');
    return `
      <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px dashed rgba(255,255,255,0.06)">
        <div>
          <div style="font-size:12px;font-weight:500">${escapeHtml(a.name || a.actorId)}</div>
          <div style="font-size:10px;color:var(--text-dim);text-transform:capitalize">${escapeHtml(a.role || 'actor')}${domains ? ` · ${escapeHtml(domains)}` : ''}</div>
        </div>
        <div style="font-size:11px;font-variant-numeric:tabular-nums">${(a.leverageScore ?? 0).toFixed(2)}</div>
        <div style="font-size:10px;color:${deltaColor};font-variant-numeric:tabular-nums;min-width:38px;text-align:right">${escapeHtml(deltaText)}</div>
      </div>
    `;
  }).join('');
  return section('Actors', rows);
}

// ────────────────────────────────────────────────────────────────────────────
// Scenarios
// ────────────────────────────────────────────────────────────────────────────

export function buildScenariosBlock(scenarioSets: ScenarioSet[]): string {
  if (!scenarioSets || scenarioSets.length === 0) {
    return section('Scenarios', '<div style="font-size:11px;color:var(--text-dim)">No scenario data</div>');
  }
  // Sort by canonical horizon order.
  const order: Record<string, number> = { '24h': 0, '7d': 1, '30d': 2 };
  const sorted = [...scenarioSets].sort((a, b) => (order[a.horizon] ?? 99) - (order[b.horizon] ?? 99));
  const laneColor: Record<string, string> = {
    base: 'var(--text-dim)',
    escalation: 'var(--danger)',
    containment: 'var(--accent)',
    fragmentation: 'var(--warning, #e0a020)',
  };
  const cols = sorted.map((set) => {
    const lanes = [...(set.lanes ?? [])].sort((a, b) => b.probability - a.probability);
    const lanesHtml = lanes.map((l) => {
      const pct = Math.round((l.probability ?? 0) * 100);
      const color = laneColor[l.name] ?? 'var(--text-dim)';
      return `
        <div style="margin-bottom:3px">
          <div style="display:flex;justify-content:space-between;font-size:11px;text-transform:capitalize">
            <span>${escapeHtml(l.name)}</span>
            <span style="font-variant-numeric:tabular-nums">${pct}%</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${color}"></div>
          </div>
        </div>
      `;
    }).join('');
    return `
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:6px">${escapeHtml(set.horizon)}</div>
        ${lanesHtml}
      </div>
    `;
  }).join('');
  const body = `<div style="display:grid;grid-template-columns:repeat(${sorted.length},1fr);gap:12px">${cols}</div>`;
  return section('Scenarios', body);
}

// ────────────────────────────────────────────────────────────────────────────
// Transmission paths
// ────────────────────────────────────────────────────────────────────────────

function severityColor(severity: string): string {
  switch ((severity ?? '').toLowerCase()) {
    case 'critical': return 'var(--danger)';
    case 'high': return 'var(--danger)';
    case 'medium': return 'var(--warning, #e0a020)';
    case 'low': return 'var(--text-dim)';
    default: return 'var(--text-dim)';
  }
}

export function buildTransmissionBlock(paths: TransmissionPath[]): string {
  if (!paths || paths.length === 0) {
    return section('Transmission Paths', '<div style="font-size:11px;color:var(--text-dim)">No active transmissions</div>');
  }
  const sorted = [...paths]
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    .slice(0, 5);
  const rows = sorted.map((p) => {
    const color = severityColor(p.severity);
    const corridor = p.corridorId ? ` via ${escapeHtml(p.corridorId)}` : '';
    const conf = Math.round((p.confidence ?? 0) * 100);
    const latency = p.latencyHours > 0 ? ` · ${p.latencyHours}h` : '';
    return `
      <div style="padding:4px 0;border-bottom:1px dashed rgba(255,255,255,0.06);display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center">
        <div>
          <div style="font-size:11px;font-weight:500">${escapeHtml(p.mechanism || 'mechanism')}${corridor}</div>
          <div style="font-size:10px;color:var(--text-dim)">${escapeHtml(p.start || '')} → ${escapeHtml(p.end || '')}${latency}</div>
        </div>
        <div style="font-size:10px;font-variant-numeric:tabular-nums;color:${color};text-transform:uppercase">${escapeHtml(p.severity || 'unspec')} · ${conf}%</div>
      </div>
    `;
  }).join('');
  return section('Transmission Paths', rows);
}

// ────────────────────────────────────────────────────────────────────────────
// Watchlist
// ────────────────────────────────────────────────────────────────────────────

export function buildWatchlistBlock(activeTriggers: Trigger[], watchItems: NarrativeSection[]): string {
  const triggerRows = (activeTriggers ?? []).map((t) => `
    <div style="padding:3px 0;font-size:11px">
      <span style="color:var(--danger);font-weight:600">●</span>
      ${escapeHtml(t.id)}${t.description ? ` — <span style="color:var(--text-dim)">${escapeHtml(t.description)}</span>` : ''}
    </div>
  `).join('');

  const watchRows = (watchItems ?? []).filter((w) => (w.text ?? '').trim().length > 0).map((w) => `
    <div style="padding:3px 0;font-size:11px">
      <span style="color:var(--text-dim)">▸</span>
      ${escapeHtml(w.text)}
    </div>
  `).join('');

  if (!triggerRows && !watchRows) {
    return section('Watchlist', '<div style="font-size:11px;color:var(--text-dim)">No active triggers or watch items</div>');
  }

  const parts: string[] = [];
  if (triggerRows) {
    parts.push(`<div style="margin-bottom:6px"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Active Triggers</div>${triggerRows}</div>`);
  }
  if (watchRows) {
    parts.push(`<div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Watch Items</div>${watchRows}</div>`);
  }
  return section('Watchlist', parts.join(''));
}

// ────────────────────────────────────────────────────────────────────────────
// Meta footer
// ────────────────────────────────────────────────────────────────────────────

export function buildMetaFooter(snapshot: RegionalSnapshot): string {
  const meta = snapshot.meta;
  if (!meta) return '';
  const confidence = Math.round((meta.snapshotConfidence ?? 0) * 100);
  const generated = snapshot.generatedAt
    ? `${new Date(snapshot.generatedAt).toISOString().replace('T', ' ').slice(0, 16)}Z`
    : '—';
  const narrativeSrc = meta.narrativeProvider
    ? `${escapeHtml(meta.narrativeProvider)}/${escapeHtml(meta.narrativeModel || 'unknown')}`
    : 'no narrative';
  return `
    <div style="display:flex;flex-wrap:wrap;gap:12px;padding:6px 2px 0;font-size:10px;color:var(--text-dim)">
      <span>generated ${escapeHtml(generated)}</span>
      <span>confidence ${confidence}%</span>
      <span>scoring v${escapeHtml(meta.scoringVersion || '')}</span>
      <span>geo v${escapeHtml(meta.geographyVersion || '')}</span>
      <span>narrative: ${narrativeSrc}</span>
    </div>
  `;
}

// ────────────────────────────────────────────────────────────────────────────
// Regime drift timeline (Phase 3 PR3)
// ────────────────────────────────────────────────────────────────────────────

function formatDate(ms: number): string {
  if (!ms) return '—';
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 16) + 'Z';
}

export function buildRegimeHistoryBlock(transitions: RegimeTransition[]): string {
  if (!transitions || transitions.length === 0) {
    return section('Regime History', '<div style="font-size:11px;color:var(--text-dim)">No regime transitions recorded yet</div>');
  }
  const rows = transitions.slice(0, 20).map((t) => {
    const from = t.previousLabel ? escapeHtml(t.previousLabel.replace(/_/g, ' ')) : 'none';
    const to = escapeHtml((t.label ?? '').replace(/_/g, ' '));
    const driver = t.transitionDriver ? ` · ${escapeHtml(t.transitionDriver)}` : '';
    const date = formatDate(t.transitionedAt);
    return `
      <div style="display:grid;grid-template-columns:130px 1fr;gap:8px;padding:3px 0;border-bottom:1px dashed rgba(255,255,255,0.06)">
        <div style="font-size:10px;color:var(--text-dim);font-variant-numeric:tabular-nums">${escapeHtml(date)}</div>
        <div style="font-size:11px"><span style="color:var(--text-dim)">${from}</span> → <span style="font-weight:500;text-transform:capitalize">${to}</span>${driver}</div>
      </div>
    `;
  }).join('');
  return section('Regime History', rows);
}

// ────────────────────────────────────────────────────────────────────────────
// Weekly brief (Phase 3 PR3)
// ────────────────────────────────────────────────────────────────────────────

export function buildWeeklyBriefBlock(brief: RegionalBrief | undefined): string {
  if (!brief || !brief.situationRecap) {
    return section('Weekly Brief', '<div style="font-size:11px;color:var(--text-dim)">No weekly brief available yet</div>');
  }

  const periodStart = brief.periodStart ? (new Date(brief.periodStart).toISOString().split('T')[0] ?? '?') : '?';
  const periodEnd = brief.periodEnd ? (new Date(brief.periodEnd).toISOString().split('T')[0] ?? '?') : '?';
  const provider = brief.provider ? `${escapeHtml(brief.provider)}/${escapeHtml(brief.model || '?')}` : '';

  const developmentItems = (brief.keyDevelopments ?? [])
    .filter((d) => d.length > 0)
    .slice(0, 5)
    .map((d) => `<div style="padding:2px 0;font-size:11px"><span style="color:var(--text-dim)">▸</span> ${escapeHtml(d)}</div>`)
    .join('');

  const body = `
    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px">${escapeHtml(periodStart)} — ${escapeHtml(periodEnd)}${provider ? ` · ${provider}` : ''}</div>
    ${brief.situationRecap ? `<div style="font-size:12px;line-height:1.5;margin-bottom:8px">${escapeHtml(brief.situationRecap)}</div>` : ''}
    ${brief.regimeTrajectory ? `
      <div style="margin-bottom:6px">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Regime Trajectory</div>
        <div style="font-size:11px;line-height:1.4">${escapeHtml(brief.regimeTrajectory)}</div>
      </div>
    ` : ''}
    ${developmentItems ? `
      <div style="margin-bottom:6px">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Key Developments</div>
        ${developmentItems}
      </div>
    ` : ''}
    ${brief.riskOutlook ? `
      <div>
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:2px">Risk Outlook</div>
        <div style="font-size:11px;line-height:1.4">${escapeHtml(brief.riskOutlook)}</div>
      </div>
    ` : ''}
  `;
  return section('Weekly Brief', body);
}

// ────────────────────────────────────────────────────────────────────────────
// Brazil & Ceará Regional Intelligence Synthetic Snapshot Generators
// ────────────────────────────────────────────────────────────────────────────

export function getBrazilRegionalSnapshot(): RegionalSnapshot {
  return {
    regionId: 'brazil',
    timestamp: Date.now(),
    regime: {
      label: 'green_energy_corridor_expansion',
      previousLabel: 'traditional_commodity_export',
      transitionDriver: 'US$ 6B+ Fortescue H2V Hub & Ceará Green Corridor consolidation',
      confidence: 0.94,
    },
    narrative: {
      situation: {
        text: `Ceará and Northeast Brazil have emerged as South America's premier clean energy corridor, powered by over 2.5 GW of wind capacity, 1.5+ GW of utility solar, and the landmark US$ 6B Fortescue Green Hydrogen Hub at Complexo Industrial e Portuário do Pecém (CIPP). Concurrently, data from the authoritative 19º Anuário Brasileiro de Segurança Pública (2025) indicates a 3.4% national reduction in intentional violent deaths (MVI rate 22.8/100k), with localized factional competition (CV, GDE, PCC) remaining insulated outside dedicated industrial and port perimeters.`,
        evidenceIds: ['FBSP-Anuário-2025', 'ONS-Wind-2025', 'CIPP-H2V-MoU'],
      },
      balanceAssessment: {
        text: `The regional balance strongly favors long-term capital formation and infrastructure export dominance. While urban periphery territorial disputes yield a domestic fragility index of 0.42 and cargo theft risk requires active transit mitigation along BR-222/CE-155, energy leverage (+0.92) and maritime access (+0.95) drive a robust net positive balance (+0.65).`,
        evidenceIds: ['CargoTheft-31k-National', 'Pecém-Deepwater-Hub'],
      },
      outlook24h: {
        text: `Grid operations across ONS 500kV Northeast transmission backbone remain stable at 98.4% capacity. Port turnaround at Pecém and Mucuripe operating without security friction.`,
        evidenceIds: ['ONS-Realtime-Grid', 'ANTAQ-Port-Ops'],
      },
      outlook7d: {
        text: `Scheduled delivery of high-value wind turbine components via CE-155 will utilize recommended IoT cargo locking and drone/PRE highway escort protocols as outlined in the 2025 Logistics Security Assessment.`,
        evidenceIds: ['Corridor-Pecém-H2V-Mitigation'],
      },
      outlook30d: {
        text: `Continued foreign direct investment inflows into Ceará's green hydrogen and offshore wind pipelines, supported by enhanced state perimeter defense rings around strategic substations.`,
        evidenceIds: ['CE-State-H2V-Taskforce'],
      },
      watchItems: [
        `Interstate cargo interception risk along federal highway BR-116/BR-222 connecting Ceará to Bahia and Southeast markets (${BRAZIL_2025_SAFETY_OVERVIEW.totalCargoTheftIncidents.toLocaleString()} national incidents in 2024).`,
        `High-voltage transmission line and copper cable security between interior solar/wind clusters (Jaguaribe/Icaraí) and coastal interconnects.`,
        `Secondary maritime terminal perimeter security and container inspection protocols at non-CIPP feeder hubs.`
      ]
    },
    balance: {
      coercivePressure: 0.38,
      domesticFragility: 0.42,
      capitalStress: 0.25,
      energyVulnerability: 0.12,
      allianceCohesion: 0.85,
      maritimeAccess: 0.95,
      energyLeverage: 0.92,
      netBalance: 0.65,
    },
    actors: [
      { actorId: 'cipp_pecem', name: 'Porto do Pecém (CIPP) & H2V Hub', role: 'Strategic Port & Clean Energy Complex', leverageScore: 0.95, delta: 0.12, leverageDomains: ['Maritime Logistics', 'Green Hydrogen', 'Industrial Hub'] },
      { actorId: 'fortescue_h2v', name: 'Fortescue Future Industries', role: 'Lead Green Hydrogen Investor', leverageScore: 0.90, delta: 0.08, leverageDomains: ['Green Ammonia', '$6B CapEx', 'Export Corridors'] },
      { actorId: 'ons_aneel', name: 'ONS / ANEEL Grid Command', role: 'Grid Stability & Transmission Authority', leverageScore: 0.88, delta: 0.05, leverageDomains: ['500kV Backbone', 'Renewable Dispatch', 'Interconnection'] },
      { actorId: 'fbsp_pre', name: 'FBSP Security & Highway Police (PRE)', role: 'Logistics Corridor Security & Intelligence', leverageScore: 0.82, delta: -0.02, leverageDomains: ['BR-222 Escorts', 'Perimeter Rings', 'Cargo Protection'] },
      { actorId: 'neoenergia_enel', name: 'Neoenergia / Enel Green Power', role: 'Utility Wind & Solar Operators', leverageScore: 0.85, delta: 0.06, leverageDomains: ['Galinhos Wind', 'Jaguaribe Solar', '2.5 GW Capacity'] }
    ],
    scenarioSets: [
      {
        horizon: '24h',
        baseProbability: 0.88,
        escalationProbability: 0.08,
        deescalationProbability: 0.04,
        blackSwanProbability: 0.0,
        summary: 'Nominal grid generation and port export flows across Ceará and Northeast corridors.'
      },
      {
        horizon: '7d',
        baseProbability: 0.82,
        escalationProbability: 0.12,
        deescalationProbability: 0.05,
        blackSwanProbability: 0.01,
        summary: 'Active logistics escorts maintain zero cargo loss during heavy component transit on CE-155.'
      },
      {
        horizon: '30d',
        baseProbability: 0.78,
        escalationProbability: 0.15,
        deescalationProbability: 0.06,
        blackSwanProbability: 0.01,
        summary: 'Further consolidation of Pecém H2V agreements amidst regional factional containment.'
      }
    ],
    transmissionPaths: [
      { sourceId: 'pecem_ce', targetId: 'rotterdam_eu', pathType: 'Green Ammonia Export Corridor', intensity: 0.95, description: 'Direct maritime clean energy corridor connecting Ceará (CIPP) to European industrial markets.' },
      { sourceId: 'wind_clusters_ce', targetId: 'ons_national_grid', pathType: 'Renewable Power Feed', intensity: 0.92, description: '2.5 GW+ continuous wind and solar dispatch feeding the Brazilian National Interconnected System.' },
      { sourceId: 'br222_highway', targetId: 'cipp_industrial_ring', pathType: 'Freight & Component Transit', intensity: 0.84, description: 'Heavy transport logistics corridor requiring active security monitoring against cargo interception.' },
      { sourceId: 'suape_pe', targetId: 'pecem_ce', pathType: 'Northeast Maritime Feeder', intensity: 0.78, description: 'Coastal container and shipping exchange linking Northeast industrial hubs.' }
    ],
    triggers: {
      active: [
        { triggerId: 'fbsp_cargo_risk', name: 'Highway Cargo Theft Alert (BR-116/BR-222)', threshold: 'Interception risk in metropolitan perimeters', status: 'active', activatedAt: Date.now() - 86400000 },
        { triggerId: 'h2v_offtake_mou', name: 'Pecém H2V Offtake Milestone', threshold: 'Finalization of European ammonia supply contracts', status: 'active', activatedAt: Date.now() - 172800000 }
      ]
    }
  };
}

export function getBrazilRegimeTransitions(): RegimeTransition[] {
  return [
    {
      fromLabel: 'traditional_commodity_export',
      toLabel: 'green_energy_corridor_expansion',
      transitionedAt: Date.now() - 30 * 86400000,
      driver: 'Execution of US$ 6B+ Fortescue H2V Hub MoU & 5.4 GW Green Ammonia export ring at Porto do Pecém (CIPP)',
      confidence: 0.94,
    },
    {
      fromLabel: 'coastal_wind_emergence',
      toLabel: 'traditional_commodity_export',
      transitionedAt: Date.now() - 180 * 86400000,
      driver: 'Expansion of ONS 500kV Northeast grid backbone linking 2.5 GW Ceará wind assets (Trairi/Aracati) to national dispatch',
      confidence: 0.89,
    }
  ];
}

export function getBrazilRegionalBrief(): RegionalBrief {
  return {
    regionId: 'brazil',
    generatedAt: Date.now(),
    headline: 'Ceará Consolidated as South America Green Hydrogen & Renewable Power Gateway Amidst Improved 2025 Safety Metrics',
    summary: 'The intersection of Ceará\'s massive clean energy endowment (2.5 GW+ wind, 1.5 GW+ solar) and the US$ 6B Fortescue Green Hydrogen Hub at Complexo Industrial e Portuário do Pecém (CIPP) provides unmatched enterprise competitive advantage. Furthermore, data from the 19º Anuário Brasileiro de Segurança Pública (2025) confirms a structural 3.4% contraction in national intentional violent deaths (MVI rate 22.8/100k). While urban periphery territorial competition persists, private and state-level perimeter defense rings around strategic substations, ports, and transit corridors insulate industrial and export operations from disruption.',
    keyDevelopments: [
      'Fortescue H2V Hub & CIPP Export Corridor: Engineering and feasibility works advancing for 600k tonnes/year green ammonia production targeted for European export via Rotterdam.',
      'Public Safety Yearbook (Anuário 2025) Integration: National MVI rate down to 22.8/100k (-3.4% YoY). State highway police (PRE) protocols reinforced along BR-222 and CE-155 freight corridors.',
      'Northeast Solar & Wind Grid Parity: ONS high-voltage interconnects reporting 98.4% uptime across Ceará, Bahia, and Rio Grande do Norte renewable clusters.'
    ],
    strategicImplications: [
      'Enterprises establishing green hydrogen or clean manufacturing operations in Ceará gain direct access to lowest-LCOE renewable energy alongside insulated industrial logistics at Porto do Pecém.',
      'Supply chain planners must maintain active cargo escort protocols along federal highways (BR-116, BR-222) to mitigate baseline cargo interception risks documented in the 2025 FBSP Yearbook.'
    ]
  };
}
