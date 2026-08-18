import type { Relationship } from '../types/relationship.types';

/**
 * Seed / Development Relationship Dataset
 * Demonstrates mutual and asymmetric relationships, mentor/mentee, partnerships, and rivals.
 */
export const DEV_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-miller-chen',
    officerIdA: 'officer-4011', // James Miller
    officerIdB: 'officer-4012', // Linda Chen
    type: 'partner_officer',
    status: 'active',
    strength: 'strong',
    dispositionAtoB: 'trusts',
    dispositionBtoA: 'respects',
    history: [
      {
        id: 'ev-1',
        timestamp: '2024-02-14',
        eventType: 'patrol_assignment',
        description: 'Assigned as regular sector patrol partners for Night Shift B.',
      },
      {
        id: 'ev-2',
        timestamp: '2025-08-11',
        eventType: 'incident_assistance',
        description: 'Chen backed up Miller during high-risk commercial robbery standoff.',
        sourceIncidentId: 'INC-2025-0419',
        dispositionEffect: 'Mutual trust reinforced',
      },
    ],
  },
  {
    id: 'rel-kowalski-chen',
    officerIdA: 'officer-3104', // Marcus Kowalski (Sgt)
    officerIdB: 'officer-4012', // Linda Chen
    type: 'mentor',
    status: 'active',
    strength: 'moderate',
    dispositionAtoB: 'likes',
    dispositionBtoA: 'respects',
    history: [
      {
        id: 'ev-3',
        timestamp: '2023-06-15',
        eventType: 'mentorship_intake',
        description: 'Kowalski took on Chen for probationary field guidance.',
      },
    ],
  },
  {
    id: 'rel-kowalski-taylor',
    officerIdA: 'officer-3104', // Marcus Kowalski (Sgt)
    officerIdB: 'officer-9001', // Alex Taylor (Cadet)
    type: 'supervisor',
    status: 'active',
    strength: 'weak',
    dispositionAtoB: 'neutral',
    dispositionBtoA: 'respects',
    history: [
      {
        id: 'ev-4',
        timestamp: '2026-01-10',
        eventType: 'field_evaluation',
        description: 'Initial shift briefing and driving evaluation.',
      },
    ],
  },
  {
    id: 'rel-velez-sterling',
    officerIdA: 'officer-2088', // Elena Velez (Det)
    officerIdB: 'officer-2092', // David Sterling (Det)
    type: 'colleague',
    status: 'active',
    strength: 'moderate',
    // Asymmetric disposition: Velez is skeptical of Sterling's aggressive methods; Sterling respects Velez's case clearance
    dispositionAtoB: 'dislikes',
    dispositionBtoA: 'respects',
    history: [
      {
        id: 'ev-5',
        timestamp: '2024-11-20',
        eventType: 'joint_task_force',
        description: 'Clashed over informant handling during Riverfront narcotics sweep.',
        sourceCaseId: '26-0752',
        dispositionEffect: 'Professional friction created',
      },
    ],
  },
  {
    id: 'rel-hayes-kowalski',
    officerIdA: 'officer-5019', // Sarah Hayes (Lt)
    officerIdB: 'officer-3104', // Marcus Kowalski (Sgt)
    type: 'supervisor',
    status: 'active',
    strength: 'very_strong',
    dispositionAtoB: 'trusts',
    dispositionBtoA: 'trusts',
    history: [
      {
        id: 'ev-6',
        timestamp: '2016-05-12',
        eventType: 'tactical_commendation',
        description: 'Served together through precinct reorganization; strong mutual professional bond.',
      },
    ],
  },
  {
    id: 'rel-diaz-gallagher',
    officerIdA: 'officer-4081', // Tony Diaz
    officerIdB: 'officer-4082', // Sean Gallagher
    type: 'partner_officer',
    status: 'active',
    strength: 'strong',
    dispositionAtoB: 'likes',
    dispositionBtoA: 'likes',
    history: [
      {
        id: 'ev-7',
        timestamp: '2023-01-20',
        eventType: 'partner_assignment',
        description: 'Assigned as sector 3 & 4 emergency response car.',
      },
    ],
  },
];
