import type { AttributeId } from '../types/officer.types';

export interface AttributeDefinition {
  id: AttributeId;
  name: string;
  description: string;
  minBaseValue: number;
  maxBaseValue: number;
}

export const ATTRIBUTE_BOUNDS = {
  MIN_BASE: 1,
  MAX_BASE: 10,
  MIN_EFFECTIVE: 1,
  MAX_EFFECTIVE: 15,
} as const;

export const ATTRIBUTES: Record<AttributeId, AttributeDefinition> = {
  physical: {
    id: 'physical',
    name: 'Physical',
    description: 'Raw stamina, muscular strength, athletic agility, and resilience against physical exhaustion.',
    minBaseValue: ATTRIBUTE_BOUNDS.MIN_BASE,
    maxBaseValue: ATTRIBUTE_BOUNDS.MAX_BASE,
  },
  mental: {
    id: 'mental',
    name: 'Mental',
    description: 'Cognitive reasoning, investigative deductive capacity, spatial observation, and analytical problem solving.',
    minBaseValue: ATTRIBUTE_BOUNDS.MIN_BASE,
    maxBaseValue: ATTRIBUTE_BOUNDS.MAX_BASE,
  },
  social: {
    id: 'social',
    name: 'Social',
    description: 'Interpersonal persuasion, empathy, interrogation rapport, and team command leadership.',
    minBaseValue: ATTRIBUTE_BOUNDS.MIN_BASE,
    maxBaseValue: ATTRIBUTE_BOUNDS.MAX_BASE,
  },
  discipline: {
    id: 'discipline',
    name: 'Discipline',
    description: 'Adherence to departmental protocol, precision driving, reliability under routine procedures, and attention to detail.',
    minBaseValue: ATTRIBUTE_BOUNDS.MIN_BASE,
    maxBaseValue: ATTRIBUTE_BOUNDS.MAX_BASE,
  },
  composure: {
    id: 'composure',
    name: 'Composure',
    description: 'Psychological fortitude, calmness during armed encounters, and stress tolerance under critical peril.',
    minBaseValue: ATTRIBUTE_BOUNDS.MIN_BASE,
    maxBaseValue: ATTRIBUTE_BOUNDS.MAX_BASE,
  },
};

export const ATTRIBUTE_LIST = Object.values(ATTRIBUTES);
