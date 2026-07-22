/**
 * Ceará & Northeast Brazil Regional Intelligence Data
 *
 * Wind generation, solar energy, port activity, and regional
 * economic indicators for the Brazilian Northeast corridor.
 *
 * Data sources:
 * - ONS (Operador Nacional do Sistema Elétrico) — grid generation data
 * - ANEEL (Agência Nacional de Energia Elétrica) — regulatory data
 * - ABEEólica (Associação Brasileira de Energia Eólica) — wind industry
 * - ABSOLAR (Associação Brasileira de Energia Solar) — solar industry
 * - ANTAQ (Agência Nacional de Transportes Aquaviários) — port/maritime data
 * - CIPP (Complexo Industrial e Portuário do Pecém) — port operations
 */

// ---- Wind Energy Data (Ceará / Northeast) ----

export interface WindFarmCluster {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  capacityMW: number;
  turbines: number;
  operator: string;
  status: 'operational' | 'construction' | 'planned';
  note?: string;
}

/**
 * Major wind farm clusters in Ceará and Northeast Brazil.
 * Ceará is Brazil's 2nd largest wind energy state (~2.5 GW installed).
 * The Northeast region accounts for ~90% of Brazil's wind generation.
 */
export const CEARA_WIND_CLUSTERS: WindFarmCluster[] = [
  // Ceará
  { id: 'ce_aracati', name: 'Complexo Eólico de Aracati', state: 'CE', lat: -4.56, lon: -37.77, capacityMW: 156, turbines: 52, operator: 'Engie', status: 'operational', note: 'Litoral leste. Ventos constantes 8-10 m/s.' },
  { id: 'ce_icarai', name: 'Parque Eólico de Icaraí', state: 'CE', lat: -3.47, lon: -39.37, capacityMW: 207, turbines: 69, operator: 'CPFL Renováveis', status: 'operational', note: 'Costa oeste cearense. Fator de capacidade ~45%.' },
  { id: 'ce_trairi', name: 'Complexo Eólico de Trairi', state: 'CE', lat: -3.28, lon: -39.27, capacityMW: 115.2, turbines: 48, operator: 'EDP Renováveis', status: 'operational', note: 'Litoral norte. Próximo ao Porto do Pecém.' },
  { id: 'ce_serra_baturite', name: 'Serra de Baturité Wind Complex', state: 'CE', lat: -4.33, lon: -38.88, capacityMW: 94, turbines: 47, operator: 'Enel Green Power', status: 'operational', note: 'Interior cearense. Altitude 800m+.' },
  { id: 'ce_pedra_cheirosa', name: 'Complexo Eólico Pedra Cheirosa', state: 'CE', lat: -3.11, lon: -39.41, capacityMW: 48.6, turbines: 27, operator: 'Voltalia', status: 'operational' },
  { id: 'ce_volta_mar', name: 'Complexo Volta do Mar', state: 'CE', lat: -2.92, lon: -40.35, capacityMW: 163.2, turbines: 48, operator: 'AES Brasil', status: 'construction', note: 'Camocim/Barroquinha. Expansão do corredor eólico oeste.' },

  // Other NE States (for regional context)
  { id: 'rn_galinhos', name: 'Complexo Eólico de Galinhos', state: 'RN', lat: -5.09, lon: -36.27, capacityMW: 434, turbines: 124, operator: 'Neoenergia', status: 'operational', note: 'RN é o #1 em capacidade eólica no Brasil.' },
  { id: 'ba_canudos', name: 'Complexo Eólico de Canudos', state: 'BA', lat: -9.97, lon: -39.01, capacityMW: 540, turbines: 108, operator: 'Omega Energia', status: 'operational', note: 'Bahia interior. Maior complexo eólico da BA.' },
  { id: 'pi_serra_mangabeira', name: 'Serra da Mangabeira', state: 'PI', lat: -8.39, lon: -41.33, capacityMW: 735, turbines: 210, operator: 'Casa dos Ventos', status: 'operational', note: 'Piauí/BA border. Um dos maiores do Brasil.' },
];

// ---- Solar Energy Data (Ceará / Northeast) ----

export interface SolarParkData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  capacityMW: number;
  type: 'utility' | 'distributed' | 'floating';
  operator: string;
  status: 'operational' | 'construction' | 'planned';
  note?: string;
}

/**
 * Major solar installations in Ceará and Northeast Brazil.
 * The Brazilian Northeast has some of the highest solar irradiance
 * in the world (5.5-6.5 kWh/m²/day), making it ideal for utility-scale solar.
 */
export const CEARA_SOLAR_PARKS: SolarParkData[] = [
  { id: 'ce_jaguaribe', name: 'Complexo Solar Jaguaribe', state: 'CE', lat: -5.89, lon: -38.62, capacityMW: 360, type: 'utility', operator: 'Enel Green Power', status: 'operational', note: 'Sertão central. Irradiância 5.8 kWh/m²/dia.' },
  { id: 'ce_quixere', name: 'Usina Solar Quixeré', state: 'CE', lat: -5.07, lon: -37.99, capacityMW: 68, type: 'utility', operator: 'Equinor', status: 'operational', note: 'Vale do Jaguaribe. Híbrido eólico-solar.' },
  { id: 'ce_milagres', name: 'Complexo Solar Milagres', state: 'CE', lat: -7.31, lon: -38.94, capacityMW: 155, type: 'utility', operator: 'Canadian Solar', status: 'construction', note: 'Sul do Ceará. Chapada do Araripe.' },
  { id: 'ce_fortaleza_dist', name: 'Fortaleza Distributed Solar', state: 'CE', lat: -3.72, lon: -38.52, capacityMW: 450, type: 'distributed', operator: 'Diversos', status: 'operational', note: 'Geração distribuída na RMF. 85k+ sistemas instalados.' },
  { id: 'ba_bom_jesus', name: 'Parque Solar Bom Jesus da Lapa', state: 'BA', lat: -13.26, lon: -43.42, capacityMW: 475, type: 'utility', operator: 'Enel Green Power', status: 'operational', note: 'Maior usina solar do Brasil. Irradiância 6.2 kWh/m²/dia.' },
  { id: 'pi_sao_goncalo', name: 'Usina Solar São Gonçalo', state: 'PI', lat: -6.83, lon: -38.87, capacityMW: 608, type: 'utility', operator: 'Enel Green Power', status: 'operational', note: 'Maior usina solar da América Latina. Bifacial modules.' },
];

// ---- Green Hydrogen (Ceará is Brazil's hub) ----

export interface GreenHydrogenProject {
  id: string;
  name: string;
  lat: number;
  lon: number;
  capacityMW: number;
  investor: string;
  status: 'operational' | 'construction' | 'memorandum' | 'feasibility';
  exportPort: string;
  note: string;
}

/**
 * Ceará is positioning itself as Brazil's (and South America's) green
 * hydrogen hub. The state government has signed 30+ MoUs with international
 * investors, all channeling production through Porto do Pecém (CIPP).
 */
export const CEARA_GREEN_HYDROGEN: GreenHydrogenProject[] = [
  { id: 'h2v_fortescue', name: 'Fortescue H2V Hub Pecém', lat: -3.53, lon: -38.81, capacityMW: 5400, investor: 'Fortescue Future Industries (Australia)', status: 'feasibility', exportPort: 'Pecém', note: 'US$ 6B investment. 600k tonnes/year green ammonia. Target: 2028.' },
  { id: 'h2v_enegix', name: 'Base One (Enegix)', lat: -3.53, lon: -38.81, capacityMW: 3400, investor: 'Enegix Energy', status: 'memorandum', exportPort: 'Pecém', note: 'US$ 5.4B. 600MW electrolyzer. Green ammonia export.' },
  { id: 'h2v_qair', name: 'Qair H2V Pecém', lat: -3.53, lon: -38.81, capacityMW: 1000, investor: 'Qair (France)', status: 'memorandum', exportPort: 'Pecém', note: 'French renewable energy company. Ammonia export to EU.' },
  { id: 'h2v_neogreen', name: 'NeoGreen Pecém Hub', lat: -3.53, lon: -38.81, capacityMW: 1800, investor: 'NeoGreen (Brazil/Europe)', status: 'memorandum', exportPort: 'Pecém', note: 'Hybrid wind-solar powered electrolysis.' },
  { id: 'h2v_edf', name: 'EDF Renewables H2V', lat: -3.53, lon: -38.81, capacityMW: 500, investor: 'EDF Renewables (France)', status: 'feasibility', exportPort: 'Pecém', note: 'Pilot-scale green hydrogen for steel production at CSP (Pecém steelworks).' },
];

// ---- Regional Statistics (Ceará Energy Snapshot) ----

export interface RegionalEnergyStats {
  state: string;
  windInstalledMW: number;
  solarInstalledMW: number;
  windCapacityFactor: number;     // % — how efficiently wind farms produce
  solarIrradiance: number;         // kWh/m²/day
  renewableSharePercent: number;   // % of state consumption from renewables
  greenH2MoUs: number;             // signed memorandums of understanding
  year: number;
}

export const NE_BRAZIL_ENERGY_STATS: RegionalEnergyStats[] = [
  { state: 'CE', windInstalledMW: 2503, solarInstalledMW: 1850, windCapacityFactor: 44.2, solarIrradiance: 5.8, renewableSharePercent: 92, greenH2MoUs: 32, year: 2025 },
  { state: 'RN', windInstalledMW: 7890, solarInstalledMW: 1200, windCapacityFactor: 46.1, solarIrradiance: 5.6, renewableSharePercent: 88, greenH2MoUs: 5, year: 2025 },
  { state: 'BA', windInstalledMW: 6540, solarInstalledMW: 4200, windCapacityFactor: 41.5, solarIrradiance: 5.9, renewableSharePercent: 85, greenH2MoUs: 12, year: 2025 },
  { state: 'PI', windInstalledMW: 3210, solarInstalledMW: 2800, windCapacityFactor: 43.8, solarIrradiance: 6.1, renewableSharePercent: 95, greenH2MoUs: 8, year: 2025 },
  { state: 'PE', windInstalledMW: 1890, solarInstalledMW: 950, windCapacityFactor: 39.2, solarIrradiance: 5.5, renewableSharePercent: 72, greenH2MoUs: 6, year: 2025 },
];

// ---- Port Activity (Ceará Maritime Intelligence) ----

export interface PortActivityMetrics {
  portId: string;
  name: string;
  monthlyTEU: number;           // container throughput
  monthlyTonnage: number;       // bulk cargo in tonnes
  vesselCalls: number;          // monthly vessel arrivals
  topExports: string[];
  topImports: string[];
  note?: string;
}

export const CEARA_PORT_ACTIVITY: PortActivityMetrics[] = [
  {
    portId: 'pecem',
    name: 'Porto do Pecém (CIPP)',
    monthlyTEU: 8500,
    monthlyTonnage: 1_200_000,
    vesselCalls: 85,
    topExports: ['Aço (placas CSP)', 'Frutas tropicais', 'Castanha de caju', 'Calçados', 'Ferro-gusa'],
    topImports: ['Coque de petróleo', 'Carvão mineral', 'Equipamentos eólicos', 'Contêineres gerais', 'Trigo'],
    note: 'Hub de green hydrogen em desenvolvimento. Zona de processamento de exportações (ZPE). Conexão ferroviária Transnordestina (em construção).',
  },
  {
    portId: 'mucuripe',
    name: 'Porto de Fortaleza (Mucuripe)',
    monthlyTEU: 4200,
    monthlyTonnage: 450_000,
    vesselCalls: 120,
    topExports: ['Castanha de caju', 'Lagosta', 'Cera de carnaúba', 'Artesanato', 'Têxteis'],
    topImports: ['Diesel/gasolina', 'GLP', 'Trigo', 'Fertilizantes', 'Sal'],
    note: 'Porto histórico de Fortaleza. Terminal de passageiros para cruzeiros. Frota pesqueira artesanal e industrial.',
  },
];

// ---- Relevant Regional Intelligence Sources ----

export const CEARA_INTELLIGENCE_FEEDS = {
  energy: [
    { name: 'ONS Brasil', url: 'https://www.ons.org.br', type: 'gov', description: 'Operador Nacional do Sistema Elétrico — geração em tempo real por fonte e subsistema' },
    { name: 'ANEEL', url: 'https://www.aneel.gov.br', type: 'gov', description: 'Agência reguladora — leilões, tarifas, outorgas de usinas' },
    { name: 'ABEEólica', url: 'https://abeeolica.org.br', type: 'market', description: 'Associação Brasileira de Energia Eólica — boletins mensais, dados de capacidade' },
    { name: 'ABSOLAR', url: 'https://www.absolar.org.br', type: 'market', description: 'Associação Brasileira de Energia Solar — infográficos, dados GD' },
    { name: 'EPE Brasil', url: 'https://www.epe.gov.br', type: 'gov', description: 'Empresa de Pesquisa Energética — PDE, balanço energético, projeções' },
    { name: 'CCEE', url: 'https://www.ccee.org.br', type: 'market', description: 'Câmara de Comercialização de Energia Elétrica — PLD, preços de mercado' },
    { name: 'Canal Energia', url: 'https://canalenergia.com.br', type: 'market', description: 'Portal de notícias do setor elétrico brasileiro' },
    { name: 'Portal Hidrogênio Verde', url: 'https://www.h2verdebrasil.com.br', type: 'market', description: 'Hub de hidrogênio verde — projetos, investimentos, regulação' },
  ],
  ports: [
    { name: 'ANTAQ', url: 'https://www.antaq.gov.br', type: 'gov', description: 'Agência Nacional de Transportes Aquaviários — estatísticas portuárias' },
    { name: 'CIPP Pecém', url: 'https://www.complexodopecem.com.br', type: 'gov', description: 'Complexo Industrial e Portuário do Pecém — operações e projetos' },
    { name: 'Marinha do Brasil', url: 'https://www.marinha.mil.br', type: 'gov', description: 'Marinha — avisos aos navegantes, meteorologia marítima' },
    { name: 'MarineTraffic BR', url: 'https://www.marinetraffic.com', type: 'market', description: 'AIS tracking — posição de embarcações em tempo real' },
  ],
  regional: [
    { name: 'Diário do Nordeste', url: 'https://diariodonordeste.verdesmares.com.br', type: 'mainstream', description: 'Maior jornal do Ceará — economia, política, infraestrutura' },
    { name: 'O Povo', url: 'https://www.opovo.com.br', type: 'mainstream', description: 'Jornal de Fortaleza — notícias regionais e nacionais' },
    { name: 'Governo do Ceará', url: 'https://www.ceara.gov.br', type: 'gov', description: 'Portal oficial — licitações, investimentos, indicadores' },
    { name: 'ADECE', url: 'https://www.adece.ce.gov.br', type: 'gov', description: 'Agência de Desenvolvimento do Estado do Ceará — projetos industriais' },
    { name: 'FIEC', url: 'https://www.fiec.org.br', type: 'market', description: 'Federação das Indústrias do Ceará — indicadores industriais' },
    { name: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br', type: 'gov', description: 'Agência pública federal — cobertura nacional em português' },
  ],
};
