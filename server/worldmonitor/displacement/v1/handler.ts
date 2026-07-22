import type { DisplacementServiceHandler } from '../../../../src/generated/server/megabrain-market/displacement/v1/service_server';

import { getDisplacementSummary } from './get-displacement-summary';
import { getPopulationExposure } from './get-population-exposure';

export const displacementHandler: DisplacementServiceHandler = {
  getDisplacementSummary,
  getPopulationExposure,
};
