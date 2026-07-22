import type { ImageryServiceHandler } from '../../../../src/generated/server/megabrain-market/imagery/v1/service_server';
import { searchImagery } from './search-imagery';

export const imageryHandler: ImageryServiceHandler = {
  searchImagery,
};
