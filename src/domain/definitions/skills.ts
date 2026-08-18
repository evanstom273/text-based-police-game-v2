import type { SkillId, AttributeId } from '../types/officer.types';

export interface SkillDefinition {
  id: SkillId;
  name: string;
  category: AttributeId;
  associatedAttributeId: AttributeId;
  description: string;
  minBaseValue: number;
  maxBaseValue: number;
}

export const SKILL_BOUNDS = {
  MIN_BASE: 1,
  MAX_BASE: 9,
  MIN_EFFECTIVE: 1,
  MAX_EFFECTIVE: 15,
} as const;

export const SKILLS: Record<SkillId, SkillDefinition> = {
  // Physical Skills
  fitness: {
    id: 'fitness',
    name: 'Fitness',
    category: 'physical',
    associatedAttributeId: 'physical',
    description: 'Sprint endurance, obstacle scaling, and foot pursuit persistence.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  defensiveTactics: {
    id: 'defensiveTactics',
    name: 'Defensive Tactics',
    category: 'physical',
    associatedAttributeId: 'physical',
    description: 'Hand-to-hand combat control, suspect restraint, and baton defensive grappling.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  firearms: {
    id: 'firearms',
    name: 'Firearms',
    category: 'physical',
    associatedAttributeId: 'physical',
    description: 'Sidearm marksmanship, target acquisition speed, and weapon safety compliance.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },

  // Mental Skills
  investigation: {
    id: 'investigation',
    name: 'Investigation',
    category: 'mental',
    associatedAttributeId: 'mental',
    description: 'Connecting crime clues, suspect motive profiling, and tracking leads across inquiries.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  observation: {
    id: 'observation',
    name: 'Observation',
    category: 'mental',
    associatedAttributeId: 'mental',
    description: 'Perceiving hidden evidence, noting vehicle irregularities, and threat identification.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  forensics: {
    id: 'forensics',
    name: 'Forensics',
    category: 'mental',
    associatedAttributeId: 'mental',
    description: 'Ballistics recovery, fingerprint lifting, and digital storage data extraction.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  reportWriting: {
    id: 'reportWriting',
    name: 'Report Writing',
    category: 'mental',
    associatedAttributeId: 'mental',
    description: 'Clear documentation for prosecution, evidentiary integrity, and legal paperwork.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },

  // Social Skills
  interviewing: {
    id: 'interviewing',
    name: 'Interviewing',
    category: 'social',
    associatedAttributeId: 'social',
    description: 'Eliciting actionable testimony from witnesses, informants, and cooperative suspects.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  negotiation: {
    id: 'negotiation',
    name: 'Negotiation',
    category: 'social',
    associatedAttributeId: 'social',
    description: 'Crisis de-escalation, hostage surrender dialogue, and resolving volatile standoffs peacefully.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
  leadership: {
    id: 'leadership',
    name: 'Leadership',
    category: 'social',
    associatedAttributeId: 'social',
    description: 'Directing tactical squad maneuvers, bolstering officer morale, and maintaining team unity.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },

  // Discipline Skills
  driving: {
    id: 'driving',
    name: 'Driving',
    category: 'discipline',
    associatedAttributeId: 'discipline',
    description: 'High-speed emergency vehicle operations (EVOC), precision pursuit, and tactical intercept.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },

  // Composure Skills
  firstAid: {
    id: 'firstAid',
    name: 'First Aid',
    category: 'composure',
    associatedAttributeId: 'composure',
    description: 'Combat casualty triage, tourniquet application, CPR, and stabilizing trauma victims under fire.',
    minBaseValue: SKILL_BOUNDS.MIN_BASE,
    maxBaseValue: SKILL_BOUNDS.MAX_BASE,
  },
};

export const SKILL_LIST = Object.values(SKILLS);

/**
 * Returns the primary core attribute associated with a given skill.
 */
export function getAssociatedAttribute(skillId: SkillId): AttributeId {
  return SKILLS[skillId]?.associatedAttributeId || 'mental';
}
