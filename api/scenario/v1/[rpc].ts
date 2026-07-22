export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createScenarioServiceRoutes } from '../../../src/generated/server/megabrain-market/scenario/v1/service_server';
import { scenarioHandler } from '../../../server/megabrain-market/scenario/v1/handler';

export default createDomainGateway(
  createScenarioServiceRoutes(scenarioHandler, serverOptions),
);
