import type {
  Officer,
  OfficerAttributes,
  OfficerSkills,
  AttributeId,
  SkillId,
} from '../types/officer.types';
import type { Trait } from '../types/trait.types';
import { ATTRIBUTE_BOUNDS } from '../definitions/attributes';
import { SKILL_BOUNDS } from '../definitions/skills';
import { DEV_TRAITS } from '../definitions/traits';

export interface ModifierContribution {
  sourceId: string;
  sourceName: string;
  value: number;
}

export interface EffectiveStatBreakdown {
  base: number;
  modifiers: ModifierContribution[];
  totalModifier: number;
  effective: number;
}

export interface EffectiveOfficerStats {
  effectiveAttributes: OfficerAttributes;
  effectiveSkills: OfficerSkills;
  attributeBreakdown: Record<AttributeId, EffectiveStatBreakdown>;
  skillBreakdown: Record<SkillId, EffectiveStatBreakdown>;
}

export interface TemporaryModifiers {
  attributes?: Partial<Record<AttributeId, number>>;
  skills?: Partial<Record<SkillId, number>>;
  sourceLabel?: string;
}

/**
 * Calculates an officer's effective attributes and skills after applying trait modifiers
 * and optional temporary conditions (fatigue, injuries, equipment, etc.) without mutating the base officer.
 */
export function calculateEffectiveStats(
  officer: Officer,
  traitCatalog: Record<string, Trait> = DEV_TRAITS,
  temporaryModifiers: TemporaryModifiers[] = []
): EffectiveOfficerStats {
  const attributeKeys: AttributeId[] = ['physical', 'mental', 'social', 'discipline', 'composure'];
  const skillKeys: SkillId[] = [
    'fitness',
    'defensiveTactics',
    'firearms',
    'investigation',
    'observation',
    'forensics',
    'reportWriting',
    'interviewing',
    'negotiation',
    'leadership',
    'driving',
    'firstAid',
  ];

  const attributeBreakdown = {} as Record<AttributeId, EffectiveStatBreakdown>;
  const effectiveAttributes = {} as OfficerAttributes;

  // 1. Calculate Attributes
  for (const attrKey of attributeKeys) {
    const base = officer.attributes[attrKey] ?? 5;
    const modifiers: ModifierContribution[] = [];

    // Apply traits
    for (const traitId of officer.traitIds) {
      const trait = traitCatalog[traitId];
      if (trait && trait.attributeModifiers[attrKey] !== undefined) {
        const mod = trait.attributeModifiers[attrKey]!;
        if (mod !== 0) {
          modifiers.push({
            sourceId: trait.id,
            sourceName: trait.name,
            value: mod,
          });
        }
      }
    }

    // Apply temporary modifiers
    for (let i = 0; i < temporaryModifiers.length; i++) {
      const temp = temporaryModifiers[i];
      if (temp.attributes && temp.attributes[attrKey] !== undefined) {
        const val = temp.attributes[attrKey]!;
        if (val !== 0) {
          modifiers.push({
            sourceId: `temp-${i}`,
            sourceName: temp.sourceLabel || 'Temporary Condition',
            value: val,
          });
        }
      }
    }

    const totalMod = modifiers.reduce((acc, curr) => acc + curr.value, 0);
    const rawEffective = base + totalMod;
    const clampedEffective = Math.max(
      ATTRIBUTE_BOUNDS.MIN_EFFECTIVE,
      Math.min(ATTRIBUTE_BOUNDS.MAX_EFFECTIVE, rawEffective)
    );

    effectiveAttributes[attrKey] = clampedEffective;
    attributeBreakdown[attrKey] = {
      base,
      modifiers,
      totalModifier: totalMod,
      effective: clampedEffective,
    };
  }

  // 2. Calculate Skills
  const skillBreakdown = {} as Record<SkillId, EffectiveStatBreakdown>;
  const effectiveSkills = {} as OfficerSkills;

  for (const skillKey of skillKeys) {
    const base = officer.skills[skillKey] ?? 3;
    const modifiers: ModifierContribution[] = [];

    // Apply traits
    for (const traitId of officer.traitIds) {
      const trait = traitCatalog[traitId];
      if (trait && trait.skillModifiers[skillKey] !== undefined) {
        const mod = trait.skillModifiers[skillKey]!;
        if (mod !== 0) {
          modifiers.push({
            sourceId: trait.id,
            sourceName: trait.name,
            value: mod,
          });
        }
      }
    }

    // Apply temporary modifiers
    for (let i = 0; i < temporaryModifiers.length; i++) {
      const temp = temporaryModifiers[i];
      if (temp.skills && temp.skills[skillKey] !== undefined) {
        const val = temp.skills[skillKey]!;
        if (val !== 0) {
          modifiers.push({
            sourceId: `temp-${i}`,
            sourceName: temp.sourceLabel || 'Temporary Condition',
            value: val,
          });
        }
      }
    }

    const totalMod = modifiers.reduce((acc, curr) => acc + curr.value, 0);
    const rawEffective = base + totalMod;
    const clampedEffective = Math.max(
      SKILL_BOUNDS.MIN_EFFECTIVE,
      Math.min(SKILL_BOUNDS.MAX_EFFECTIVE, rawEffective)
    );

    effectiveSkills[skillKey] = clampedEffective;
    skillBreakdown[skillKey] = {
      base,
      modifiers,
      totalModifier: totalMod,
      effective: clampedEffective,
    };
  }

  return {
    effectiveAttributes,
    effectiveSkills,
    attributeBreakdown,
    skillBreakdown,
  };
}
