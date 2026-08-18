import type { Officer } from '../types/officer.types';
import type { Trait } from '../types/trait.types';
import type { Relationship } from '../types/relationship.types';
import type { CrimeIncident } from '../types/crime.types';
import { ATTRIBUTE_BOUNDS } from '../definitions/attributes';
import { SKILL_BOUNDS } from '../definitions/skills';
import { TRAIT_BOUNDS } from '../definitions/traits';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateOfficer(officer: Officer): ValidationResult {
  const errors: string[] = [];

  if (!officer.id || officer.id.trim() === '') {
    errors.push('Officer must have a valid non-empty ID.');
  }
  if (!officer.firstName || !officer.lastName) {
    errors.push('Officer must have both first and last names.');
  }
  if (officer.age < 18 || officer.age > 75) {
    errors.push(`Officer age (${officer.age}) must be between 18 and 75.`);
  }

  // Check attributes
  const attrs = officer.attributes;
  for (const [key, val] of Object.entries(attrs)) {
    if (val < ATTRIBUTE_BOUNDS.MIN_BASE || val > ATTRIBUTE_BOUNDS.MAX_BASE) {
      errors.push(`Attribute ${key} value (${val}) out of bounds [${ATTRIBUTE_BOUNDS.MIN_BASE}, ${ATTRIBUTE_BOUNDS.MAX_BASE}].`);
    }
  }

  // Check skills
  const skills = officer.skills;
  for (const [key, val] of Object.entries(skills)) {
    if (val < SKILL_BOUNDS.MIN_BASE || val > SKILL_BOUNDS.MAX_BASE) {
      errors.push(`Skill ${key} value (${val}) out of bounds [${SKILL_BOUNDS.MIN_BASE}, ${SKILL_BOUNDS.MAX_BASE}].`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTrait(trait: Trait): ValidationResult {
  const errors: string[] = [];

  for (const [key, mod] of Object.entries(trait.attributeModifiers)) {
    if (mod !== undefined && (mod < TRAIT_BOUNDS.MIN_MODIFIER || mod > TRAIT_BOUNDS.MAX_MODIFIER)) {
      errors.push(`Trait ${trait.id} attribute modifier ${key} (${mod}) out of range [-3, +3].`);
    }
  }

  for (const [key, mod] of Object.entries(trait.skillModifiers)) {
    if (mod !== undefined && (mod < TRAIT_BOUNDS.MIN_MODIFIER || mod > TRAIT_BOUNDS.MAX_MODIFIER)) {
      errors.push(`Trait ${trait.id} skill modifier ${key} (${mod}) out of range [-3, +3].`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRelationship(
  rel: Relationship,
  existingOfficerIds: Set<string>
): ValidationResult {
  const errors: string[] = [];

  if (rel.officerIdA === rel.officerIdB) {
    errors.push(`Relationship ${rel.id} cannot be between an officer and themselves.`);
  }
  if (!existingOfficerIds.has(rel.officerIdA)) {
    errors.push(`Relationship ${rel.id} references non-existent Officer A ID (${rel.officerIdA}).`);
  }
  if (!existingOfficerIds.has(rel.officerIdB)) {
    errors.push(`Relationship ${rel.id} references non-existent Officer B ID (${rel.officerIdB}).`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateCrimeIncident(
  incident: CrimeIncident,
  existingOfficerIds?: Set<string>
): ValidationResult {
  const errors: string[] = [];

  if (!incident.id || incident.id.trim() === '') {
    errors.push('Incident must have a valid non-empty ID.');
  }

  if (existingOfficerIds && incident.assignedOfficerIds.length > 0) {
    for (const officerId of incident.assignedOfficerIds) {
      if (!existingOfficerIds.has(officerId)) {
        errors.push(`Incident ${incident.id} assigns non-existent Officer ID (${officerId}).`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
