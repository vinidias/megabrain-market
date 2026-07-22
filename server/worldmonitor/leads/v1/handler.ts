import type { LeadsServiceHandler } from '../../../../src/generated/server/megabrain-market/leads/v1/service_server';

import { registerInterest } from './register-interest';
import { submitContact } from './submit-contact';

export const leadsHandler: LeadsServiceHandler = {
  submitContact,
  registerInterest,
};
