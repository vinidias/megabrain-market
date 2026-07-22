/**
 * 19º Anuário Brasileiro de Segurança Pública (2025) — Security & Risk Intelligence
 *
 * Source: Fórum Brasileiro de Segurança Pública (FBSP) — 19º Anuário Brasileiro
 * de Segurança Pública (São Paulo: FBSP, 2025. ISSN: 1983-7364).
 *
 * This module structures public safety, violent crime (MVI), cargo theft (roubo de carga),
 * and territorial risk data to power MegaBrain Market's Regional Intelligence,
 * Supply Chain Risk, and Logistics Corridors assessment engines.
 *
 * Special emphasis is placed on Ceará and the Northeast (Nordeste) green energy/maritime
 * corridors (Porto do Pecém, Green Hydrogen Hub, Wind/Solar clusters) to provide
 * enterprise competitive advantage and operational risk clarity.
 */

export interface StateSecurityProfile {
  stateCode: string;
  stateName: string;
  region: 'Nordeste' | 'Sudeste' | 'Sul' | 'Norte' | 'Centro-Oeste';
  mviTotal2023: number;
  mviTotal2024: number;
  mviRatePer100k: number; // Rate per 100,000 inhabitants
  cargoTheftIncidents: number; // Roubo de carga
  territorialRiskScore: number; // 0 to 100 normalized risk score for enterprise operations
  logisticsImpactLevel: 'low' | 'moderate' | 'high' | 'critical';
  dominantTerritorialActors?: string[];
  notes: string;
}

export interface NationalSecurityOverview {
  yearbookEdition: string;
  publicationYear: number;
  publisher: string;
  totalMvi2024: number;
  nationalMviRatePer100k: number;
  yoyChangePercentage: number;
  totalCargoTheftIncidents: number;
  keySupplyChainVulnerabilities: string[];
  strategicSummary: string;
}

/**
 * National Overview from the 19º Anuário Brasileiro de Segurança Pública (2025).
 */
export const BRAZIL_2025_SAFETY_OVERVIEW: NationalSecurityOverview = {
  yearbookEdition: '19º Anuário Brasileiro de Segurança Pública (2025)',
  publicationYear: 2025,
  publisher: 'Fórum Brasileiro de Segurança Pública (FBSP)',
  totalMvi2024: 46328,
  nationalMviRatePer100k: 22.8,
  yoyChangePercentage: -3.4,
  totalCargoTheftIncidents: 31250,
  keySupplyChainVulnerabilities: [
    'Highway freight interception along federal corridors (BR-116, BR-101, BR-222)',
    'Last-mile distribution security in major metropolitan perimeters (RMF, Grande SP, Grande Rio)',
    'Infrastructure equipment protection (copper/cable theft impacting renewable energy transmission and data centers)',
    'Port perimeter access and container inspection vulnerabilities at secondary maritime terminals'
  ],
  strategicSummary:
    'While national intentional violent deaths (MVI) showed a slight structural contraction (-3.4%), territorial disputes among transnational organized crime syndicates create localized volatility in key logistics and renewable energy corridors. For enterprise operations, cargo theft and copper/grid infrastructure tampering represent the primary financial and operational friction points.'
};

/**
 * State-by-State Security Profiles with a focus on Ceará and key commercial corridors.
 */
export const BRAZIL_STATE_SECURITY_PROFILES: StateSecurityProfile[] = [
  // Ceará & Northeast (Primary Strategic Focus for Clean Energy & Maritime Corridors)
  {
    stateCode: 'CE',
    stateName: 'Ceará',
    region: 'Nordeste',
    mviTotal2023: 3300,
    mviTotal2024: 3410,
    mviRatePer100k: 38.6,
    cargoTheftIncidents: 412,
    territorialRiskScore: 78,
    logisticsImpactLevel: 'high',
    dominantTerritorialActors: ['CV (Comando Vermelho)', 'GDE (Guardiões do Estado)', 'PCC'],
    notes:
      'High violent crime rate driven by factional competition over urban peripheries and trafficking routes. However, major industrial corridors like Complexo Industrial e Portuário do Pecém (CIPP) and green hydrogen generation parks maintain dedicated private/public perimeter security rings, insulating core enterprise operations from broader municipal volatility.'
  },
  {
    stateCode: 'BA',
    stateName: 'Bahia',
    region: 'Nordeste',
    mviTotal2023: 6500,
    mviTotal2024: 6210,
    mviRatePer100k: 44.2,
    cargoTheftIncidents: 890,
    territorialRiskScore: 84,
    logisticsImpactLevel: 'critical',
    dominantTerritorialActors: ['CV', 'BDM (Bonde do Maluco)', 'PCC'],
    notes:
      'Highest absolute MVI volume and rate nationwide. Significant friction along transport corridors in Salvador metropolitan area and interior highways connecting wind clusters (Bom Jesus da Lapa/Canudos) to coastal ports.'
  },
  {
    stateCode: 'PE',
    stateName: 'Pernambuco',
    region: 'Nordeste',
    mviTotal2023: 3620,
    mviTotal2024: 3580,
    mviRatePer100k: 39.4,
    cargoTheftIncidents: 640,
    territorialRiskScore: 76,
    logisticsImpactLevel: 'high',
    dominantTerritorialActors: ['CV', 'PCC', 'Local Factions'],
    notes:
      'Suape Port industrial complex operates with strong security protocols, but regional feeder routes across BR-101 experience recurring freight interception and cargo theft attempts.'
  },
  {
    stateCode: 'RN',
    stateName: 'Rio Grande do Norte',
    region: 'Nordeste',
    mviTotal2023: 1120,
    mviTotal2024: 1080,
    mviRatePer100k: 32.5,
    cargoTheftIncidents: 185,
    territorialRiskScore: 68,
    logisticsImpactLevel: 'moderate',
    dominantTerritorialActors: ['Sindicato do Crime (SDC)', 'PCC'],
    notes:
      'Brazil’s #1 wind energy capacity state. Wind farm clusters in Galinhos and interior highlands have low exposure to urban crime, though transmission line maintenance teams require corridor monitoring.'
  },
  {
    stateCode: 'PI',
    stateName: 'Piauí',
    region: 'Nordeste',
    mviTotal2023: 810,
    mviTotal2024: 795,
    mviRatePer100k: 24.1,
    cargoTheftIncidents: 110,
    territorialRiskScore: 58,
    logisticsImpactLevel: 'moderate',
    dominantTerritorialActors: ['PCC', 'Bonde dos 40'],
    notes:
      'Host to major solar complexes (São Gonçalo). Interior solar parks operate with minimal security disruptions; highway transport of photovoltaic components requires standard transit escorts.'
  },

  // Southeast & South (Major Economic & Logistics Hubs)
  {
    stateCode: 'SP',
    stateName: 'São Paulo',
    region: 'Sudeste',
    mviTotal2023: 3100,
    mviTotal2024: 2980,
    mviRatePer100k: 6.7,
    cargoTheftIncidents: 13850,
    territorialRiskScore: 52,
    logisticsImpactLevel: 'high',
    dominantTerritorialActors: ['PCC (Hegemonic Monopoly)'],
    notes:
      'Lowest MVI rate in Brazil due to hegemonic factional consolidation. However, cargo theft remains high in absolute terms across the Rodoanel and routes leading to Porto de Santos.'
  },
  {
    stateCode: 'RJ',
    stateName: 'Rio de Janeiro',
    region: 'Sudeste',
    mviTotal2023: 4400,
    mviTotal2024: 4250,
    mviRatePer100k: 26.5,
    cargoTheftIncidents: 9420,
    territorialRiskScore: 88,
    logisticsImpactLevel: 'critical',
    dominantTerritorialActors: ['CV', 'TCP (Terceiro Comando Puro)', 'ADA', 'Milícias'],
    notes:
      'Complex multipolar territorial conflict between drug factions and paramilitary militias. Cargo theft is a major operational hazard along metropolitan expressways and access roads to Port of Rio/Itaguaí.'
  },
  {
    stateCode: 'MG',
    stateName: 'Minas Gerais',
    region: 'Sudeste',
    mviTotal2023: 2850,
    mviTotal2024: 2790,
    mviRatePer100k: 13.6,
    cargoTheftIncidents: 1520,
    territorialRiskScore: 45,
    logisticsImpactLevel: 'moderate',
    notes: 'Stable security environment across major mining and agricultural corridors with moderate cargo risk on interstate borders with RJ and BA.'
  },
  {
    stateCode: 'PR',
    stateName: 'Paraná',
    region: 'Sul',
    mviTotal2023: 2150,
    mviTotal2024: 2080,
    mviRatePer100k: 18.2,
    cargoTheftIncidents: 1100,
    territorialRiskScore: 48,
    logisticsImpactLevel: 'moderate',
    notes: 'Critical agricultural export corridor via Port of Paranaguá. Security is generally robust with localized smuggling risk along the triple frontier.'
  }
];

/**
 * Enterprise Risk & Logistics Security Insights for Ceará & Green Energy Corridors.
 */
export interface LogisticsCorridorAssessment {
  corridorId: string;
  corridorName: string;
  states: string[];
  keyInfrastructure: string[];
  securityRiskLevel: 'low' | 'moderate' | 'high';
  primaryVulnerabilities: string[];
  recommendedMitigations: string[];
}

export const LOGISTICS_CORRIDOR_ASSESSMENTS: LogisticsCorridorAssessment[] = [
  {
    corridorId: 'corridor_pecem_h2v',
    corridorName: 'Ceará Green Hydrogen & Export Corridor (CIPP / Pecém)',
    states: ['CE'],
    keyInfrastructure: [
      'Porto do Pecém (CIPP)',
      'Trairi & Litoral Oeste Wind Clusters',
      '5.4 GW Green Ammonia / H2V Industrial Ring',
      'BR-222 & CE-155 Access Highways'
    ],
    securityRiskLevel: 'moderate',
    primaryVulnerabilities: [
      'Cargo interception during road transit of heavy wind turbine blades and solar modules along CE-155',
      'Copper and electrical substation cable theft in unmonitored rural stretches between generation farms and Pecém grid interconnects'
    ],
    recommendedMitigations: [
      'Deploy IoT-enabled GPS cargo locks and drone escort protocols for high-value component transit',
      'Establish direct coordination with CIPP dedicated port police ring and Ceará State Highway Police (PRE)',
      'Use subterranean and armored cabling for high-voltage transmission lines connecting coastal wind assets'
    ]
  },
  {
    corridorId: 'corridor_northeast_wind_grid',
    corridorName: 'Northeast Renewable Energy Grid Corridor (RN-CE-PI-BA)',
    states: ['RN', 'CE', 'PI', 'BA'],
    keyInfrastructure: [
      'Galinhos (RN) & Serra da Mangabeira (PI) Wind Parks',
      'São Gonçalo & Jaguaribe Utility Solar Parks',
      'ONS 500kV High-Voltage Transmission Backbone'
    ],
    securityRiskLevel: 'moderate',
    primaryVulnerabilities: [
      'Remote substation intrusion and equipment vandalism',
      'Logistics bottlenecks caused by localized highway blockades or security incidents near urban centers in Bahia and Ceará'
    ],
    recommendedMitigations: [
      'Implement AI-powered perimeter thermal surveillance across remote substations and solar arrays',
      'Utilize real-time route optimization via MegaBrain Market intelligence feeds to bypass active security hotspots'
    ]
  }
];
