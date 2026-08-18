/**
 * Precinct Command — Officer Domain Types
 * Canonical representation of law enforcement personnel.
 */

export type PoliceRankId =
  | 'cadet'
  | 'officer'
  | 'det_3'
  | 'det_2'
  | 'det_1'
  | 'sergeant'
  | 'lieutenant'
  | 'captain';

export type DivisionId =
  | 'patrol'
  | 'homicide'
  | 'major_crimes'
  | 'narcotics'
  | 'traffic'
  | 'swat'
  | 'csi'
  | 'internal_affairs'
  | 'missing_persons'
  | 'cyber_crime'
  | (string & {});

export type OfficerDutyStatus =
  | 'on_duty'
  | 'off_duty'
  | 'on_call'
  | 'leave'
  | 'suspended';

export type ShiftAssignment = 'shift_a' | 'shift_b' | 'shift_c';

export type Gender = 'male' | 'female' | 'non_binary' | 'other' | (string & {});

export interface DivisionHistoryEntry {
  divisionId: DivisionId;
  startDate: string;
  endDate?: string;
  role?: string;
}

/**
 * The five core attributes of an officer (Range: 1–10).
 */
export type AttributeId =
  | 'physical'
  | 'mental'
  | 'social'
  | 'discipline'
  | 'composure';

export interface OfficerAttributes {
  physical: number;
  mental: number;
  social: number;
  discipline: number;
  composure: number;
}

/**
 * The twelve core skills across the five attribute categories (Range: 1–9).
 */
export type PhysicalSkillId = 'fitness' | 'defensiveTactics' | 'firearms';
export type MentalSkillId = 'investigation' | 'observation' | 'forensics' | 'reportWriting';
export type SocialSkillId = 'interviewing' | 'negotiation' | 'leadership';
export type DisciplineSkillId = 'driving';
export type ComposureSkillId = 'firstAid';

export type SkillId =
  | PhysicalSkillId
  | MentalSkillId
  | SocialSkillId
  | DisciplineSkillId
  | ComposureSkillId;

export interface OfficerSkills {
  // Physical Skills
  fitness: number;
  defensiveTactics: number;
  firearms: number;

  // Mental Skills
  investigation: number;
  observation: number;
  forensics: number;
  reportWriting: number;

  // Social Skills
  interviewing: number;
  negotiation: number;
  leadership: number;

  // Discipline Skills
  driving: number;

  // Composure Skills
  firstAid: number;
}

/**
 * Canonical Officer Domain Model
 */
export interface Officer {
  id: string;
  badgeNumber: string;

  // Personal Identity
  firstName: string;
  lastName: string;
  callsign?: string;
  biography: string;
  age: number;
  gender: Gender;
  nationality: string;

  // Employment
  rankId: PoliceRankId;
  divisionId: DivisionId;
  divisionHistory: DivisionHistoryEntry[];
  dutyStatus: OfficerDutyStatus;
  shift: ShiftAssignment;
  yearsOfService: number;

  // Core Statistics (Base values prior to trait/condition modifiers)
  attributes: OfficerAttributes;
  skills: OfficerSkills;

  // Traits assigned to the officer
  traitIds: string[];
}
