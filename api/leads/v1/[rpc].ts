export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createLeadsServiceRoutes } from '../../../src/generated/server/megabrain-market/leads/v1/service_server';
import { leadsHandler } from '../../../server/megabrain-market/leads/v1/handler';

export default createDomainGateway(
  createLeadsServiceRoutes(leadsHandler, serverOptions),
);
