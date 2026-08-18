/**
 * Precinct Command — Trait Domain Types
 * Canonical representation of officer character traits and modifiers.
 */

import type { AttributeId, SkillId } from './officer.types';

export type TraitCategory =
  | 'personality'
  | 'background'
  | 'tactical'
  | 'specialization'
  | 'physical';

/**
 * Trait definition representing mechanical modifiers and descriptive lore.
 * Attribute and skill modifiers range from -3 to +3.
 */
export interface Trait {
  id: string;
  name: string;
  description: string;
  category: TraitCategory;

  /** Modifiers applied to base attributes (Range: -3 to +3) */
  attributeModifiers: Partial<Record<AttributeId, number>>;

  /** Modifiers applied to base skills (Range: -3 to +3) */
  skillModifiers: Partial<Record<SkillId, number>>;
}
