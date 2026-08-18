/**
 * Precinct Command — Crime & Incident Domain Types
 * Canonical representation of dispatched calls, incidents, and criminal investigations.
 */

export type CrimeTypeId =
  | 'domestic_incident'
  | 'assault'
  | 'burglary'
  | 'robbery'
  | 'traffic_collision'
  | 'missing_person'
  | 'suspicious_activity'
  | 'vandalism'
  | 'drug_offence'
  | 'homicide'
  | (string & {});

/**
 * Underlying simulation priority (independent of presentation radio codes).
 */
export type CrimePriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Incident lifecycle status.
 */
export type IncidentStatus =
  | 'waiting'
  | 'dispatched'
  | 'in_progress'
  | 'resolved'
  | 'closed';

/**
 * Structured resolution outcome.
 */
export type CrimeOutcome =
  | 'none'
  | 'suspect_arrested'
  | 'suspect_escaped'
  | 'no_action_required'
  | 'false_report'
  | 'victim_assisted'
  | 'under_investigation'
  | (string & {});

export interface IncidentLocation {
  address: string;
  sector: string;
  venueName?: string;
  coordinates?: { x: number; y: number };
}

/**
 * Canonical Crime / Incident Model
 */
export interface CrimeIncident {
  id: string;
  cadNumber: string;
  crimeTypeId: CrimeTypeId;
  title: string;
  description: string;

  location: IncidentLocation;
  priority: CrimePriority;
  status: IncidentStatus;
  outcome: CrimeOutcome;

  reportedAt: string;
  dispatchedAt?: string;
  resolvedAt?: string;

  /** Canonical references to assigned officers (IDs only) */
  assignedOfficerIds: string[];

  /** Case & investigative references */
  caseId?: string;
  evidenceIds?: string[];
  suspectDescriptions?: string[];
  notes?: string[];
}
