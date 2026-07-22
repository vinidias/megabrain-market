import type { HealthServiceHandler } from '../../../../src/generated/server/megabrain-market/health/v1/service_server';

import { listAirQualityAlerts } from './list-air-quality-alerts';
import { listDiseaseOutbreaks } from './list-disease-outbreaks';

export const healthHandler: HealthServiceHandler = {
  listAirQualityAlerts,
  listDiseaseOutbreaks,
};
