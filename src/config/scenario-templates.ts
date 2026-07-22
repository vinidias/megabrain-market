/**
 * Re-exports scenario template types for use within src/.
 * The authoritative source is server/megabrain-market/supply-chain/v1/scenario-templates.ts
 * (kept there so API edge functions can import it without crossing the src/ boundary).
 */

export type {
  ScenarioType,
  ScenarioTemplate,
  ScenarioVisualState,
  ScenarioResult,
} from '../../server/megabrain-market/supply-chain/v1/scenario-templates';

export { SCENARIO_TEMPLATES } from '../../server/megabrain-market/supply-chain/v1/scenario-templates';
