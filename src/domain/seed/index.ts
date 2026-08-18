export * from './devOfficers';
export * from './devRelationships';
export * from './devCrimes';

import { DEV_OFFICERS } from './devOfficers';
import { DEV_RELATIONSHIPS } from './devRelationships';
import { DEV_CRIMES } from './devCrimes';
import { DEV_TRAITS } from '../definitions/traits';

export const DEV_SEED_DATABASE = {
  officers: DEV_OFFICERS,
  traits: DEV_TRAITS,
  relationships: DEV_RELATIONSHIPS,
  crimes: DEV_CRIMES,
};
