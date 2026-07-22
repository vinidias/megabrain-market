import type { GivingServiceHandler } from '../../../../src/generated/server/megabrain-market/giving/v1/service_server';

import { getGivingSummary } from './get-giving-summary';

export const givingHandler: GivingServiceHandler = {
  getGivingSummary,
};
