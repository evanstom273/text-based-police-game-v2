import type { Trait } from '../types/trait.types';

export const TRAIT_BOUNDS = {
  MIN_MODIFIER: -3,
  MAX_MODIFIER: 3,
} as const;

/**
 * Development / Example Trait Catalogue
 * NOTE: These are initial development examples for mechanics testing and seed datasets.
 */
export const DEV_TRAITS: Record<string, Trait> = {
  veteran_street_cop: {
    id: 'veteran_street_cop',
    name: 'Veteran Street Cop',
    description: 'Decades of street patrol have sharpened observational instincts and tactical resilience.',
    category: 'background',
    attributeModifiers: {
      composure: 1,
      discipline: 1,
    },
    skillModifiers: {
      observation: 2,
      defensiveTactics: 1,
      interviewing: 1,
    },
  },
  sharp_investigator: {
    id: 'sharp_investigator',
    name: 'Sharp Investigator',
    description: 'Possesses exceptional deductive logic and an eye for forensic inconsistencies.',
    category: 'specialization',
    attributeModifiers: {
      mental: 2,
      social: -1,
    },
    skillModifiers: {
      investigation: 2,
      forensics: 1,
      reportWriting: 1,
    },
  },
  tactical_marksman: {
    id: 'tactical_marksman',
    name: 'Tactical Marksman',
    description: 'Former SWAT competition shooter with surgical precision behind the trigger.',
    category: 'tactical',
    attributeModifiers: {
      physical: 1,
      composure: 1,
    },
    skillModifiers: {
      firearms: 3,
      fitness: 1,
      negotiation: -1,
    },
  },
  hot_headed: {
    id: 'hot_headed',
    name: 'Hot-Headed',
    description: 'Quick to anger and prone to confrontation during contentious interactions.',
    category: 'personality',
    attributeModifiers: {
      composure: -2,
      discipline: -1,
      physical: 1,
    },
    skillModifiers: {
      negotiation: -2,
      defensiveTactics: 1,
    },
  },
  empathetic_negotiator: {
    id: 'empathetic_negotiator',
    name: 'Empathetic Negotiator',
    description: 'Naturally attuned to human emotion, capable of talking down desperate suspects.',
    category: 'personality',
    attributeModifiers: {
      social: 2,
      composure: 1,
    },
    skillModifiers: {
      negotiation: 3,
      interviewing: 2,
      firearms: -1,
    },
  },
  methodical_bureaucrat: {
    id: 'methodical_bureaucrat',
    name: 'Methodical Bureaucrat',
    description: 'Obsessive attention to legal standards and airtight report formatting.',
    category: 'specialization',
    attributeModifiers: {
      discipline: 2,
      physical: -1,
    },
    skillModifiers: {
      reportWriting: 3,
      driving: 1,
      fitness: -1,
    },
  },
  iron_nerves: {
    id: 'iron_nerves',
    name: 'Iron Nerves',
    description: 'Completely unflappable when shots are fired or chaos erupts on scene.',
    category: 'personality',
    attributeModifiers: {
      composure: 3,
    },
    skillModifiers: {
      firstAid: 2,
      firearms: 1,
    },
  },
  evoc_expert: {
    id: 'evoc_expert',
    name: 'EVOC Specialist',
    description: 'Master of emergency vehicle operations and pursuit interception physics.',
    category: 'specialization',
    attributeModifiers: {
      discipline: 1,
      physical: 1,
    },
    skillModifiers: {
      driving: 3,
    },
  },
};

export const TRAIT_LIST = Object.values(DEV_TRAITS);

export function getTraitById(traitId: string): Trait | undefined {
  return DEV_TRAITS[traitId];
}
