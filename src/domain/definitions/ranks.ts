import type { PoliceRankId } from '../types/officer.types';

export interface PoliceRankDefinition {
  id: PoliceRankId;
  order: number;
  name: string;
  abbreviation: string;
  description: string;
}

export const POLICE_RANKS: Record<PoliceRankId, PoliceRankDefinition> = {
  cadet: {
    id: 'cadet',
    order: 1,
    name: 'Cadet',
    abbreviation: 'Cdt.',
    description: 'Trainee undergoing police academy instruction and probationary field orientation.',
  },
  officer: {
    id: 'officer',
    order: 2,
    name: 'Police Officer',
    abbreviation: 'Ofc.',
    description: 'Sworn patrol officer executing general law enforcement and emergency call response.',
  },
  det_3: {
    id: 'det_3',
    order: 3,
    name: 'Detective 3rd Class',
    abbreviation: 'Det. 3',
    description: 'Junior investigative officer handling division-assigned criminal inquiries.',
  },
  det_2: {
    id: 'det_2',
    order: 4,
    name: 'Detective 2nd Class',
    abbreviation: 'Det. 2',
    description: 'Experienced investigator leading complex misdemeanor and felony casework.',
  },
  det_1: {
    id: 'det_1',
    order: 5,
    name: 'Detective 1st Class',
    abbreviation: 'Det. 1',
    description: 'Senior lead investigator handling major crimes, homicides, and tactical case files.',
  },
  sergeant: {
    id: 'sergeant',
    order: 6,
    name: 'Sergeant',
    abbreviation: 'Sgt.',
    description: 'First-line field supervisor overseeing patrol squads, shift logistics, and tactical scenes.',
  },
  lieutenant: {
    id: 'lieutenant',
    order: 7,
    name: 'Lieutenant',
    abbreviation: 'Lt.',
    description: 'Shift and bureau commander responsible for operational divisions and personnel management.',
  },
  captain: {
    id: 'captain',
    order: 8,
    name: 'Captain',
    abbreviation: 'Capt.',
    description: 'Precinct commanding officer with full administrative, budgetary, and operational authority.',
  },
};

export const RANK_LIST = Object.values(POLICE_RANKS).sort((a, b) => a.order - b.order);

export function getRankDefinition(rankId: PoliceRankId): PoliceRankDefinition {
  return POLICE_RANKS[rankId] || POLICE_RANKS.officer;
}
