export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createClimateServiceRoutes } from '../../../src/generated/server/megabrain-market/climate/v1/service_server';
import { climateHandler } from '../../../server/megabrain-market/climate/v1/handler';

export default createDomainGateway(
  createClimateServiceRoutes(climateHandler, serverOptions),
);
