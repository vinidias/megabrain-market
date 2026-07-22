import type { BatchServiceHandler } from '../../../../src/generated/server/megabrain-market/batch/v1/service_server';

import { executeBatch } from './execute-batch';

export const batchHandler: BatchServiceHandler = {
  executeBatch,
};
