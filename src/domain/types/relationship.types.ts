/**
 * Precinct Command — Relationship Domain Types
 * Canonical representation of interpersonal relationships between officers.
 */

export type PersonalRelationshipType =
  | 'friend'
  | 'best_friend'
  | 'rival'
  | 'enemy'
  | 'partner'
  | 'ex_partner'
  | 'family'
  | 'parent'
  | 'child'
  | 'sibling';

export type ProfessionalRelationshipType =
  | 'colleague'
  | 'partner_officer'
  | 'mentor'
  | 'mentee'
  | 'supervisor'
  | 'subordinate';

export type RelationshipType =
  | PersonalRelationshipType
  | ProfessionalRelationshipType
  | 'none';

/**
 * Directional sentiment/feeling of one officer toward another.
 */
export type RelationshipDisposition =
  | 'hates'
  | 'dislikes'
  | 'neutral'
  | 'likes'
  | 'trusts'
  | 'respects';

/**
 * Significance/depth of the bond (positive or negative).
 */
export type RelationshipStrength =
  | 'very_weak'
  | 'weak'
  | 'moderate'
  | 'strong'
  | 'very_strong';

export type RelationshipStatus = 'active' | 'dormant' | 'ended';

/**
 * Structured event entry in relationship history.
 */
export interface RelationshipEvent {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  relevantOfficerIds?: [string, string];
  sourceIncidentId?: string;
  sourceCaseId?: string;
  dispositionEffect?: string;
}

/**
 * Canonical Relationship Model between Officer A and Officer B.
 */
export interface Relationship {
  id: string;
  officerIdA: string;
  officerIdB: string;

  /** Relationship classification from A to B (or mutual) */
  type: RelationshipType;

  /** Status of the relationship lifecycle */
  status: RelationshipStatus;

  /** Overall bond magnitude */
  strength: RelationshipStrength;

  /** Independent directional sentiment of Officer A toward Officer B */
  dispositionAtoB: RelationshipDisposition;

  /** Independent directional sentiment of Officer B toward Officer A */
  dispositionBtoA: RelationshipDisposition;

  /** Chronological history of significant interactions and events */
  history: RelationshipEvent[];
}
