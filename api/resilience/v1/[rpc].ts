export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createResilienceServiceRoutes } from '../../../src/generated/server/megabrain-market/resilience/v1/service_server';
import { resilienceHandler } from '../../../server/megabrain-market/resilience/v1/handler';

export default createDomainGateway(
  createResilienceServiceRoutes(resilienceHandler, serverOptions),
);
