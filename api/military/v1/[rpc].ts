export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createMilitaryServiceRoutes } from '../../../src/generated/server/megabrain-market/military/v1/service_server';
import { militaryHandler } from '../../../server/megabrain-market/military/v1/handler';

export default createDomainGateway(
  createMilitaryServiceRoutes(militaryHandler, serverOptions),
);
