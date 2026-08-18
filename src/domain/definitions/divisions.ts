import type { DivisionId } from '../types/officer.types';

export interface DivisionDefinition {
  id: DivisionId;
  name: string;
  shortCode: string;
  description: string;
  isInvestigative: boolean;
}

export const POLICE_DIVISIONS: Record<string, DivisionDefinition> = {
  patrol: {
    id: 'patrol',
    name: 'Patrol Division',
    shortCode: 'PAT',
    description: 'Primary frontline uniformed response covering designated precinct sectors.',
    isInvestigative: false,
  },
  homicide: {
    id: 'homicide',
    name: 'Homicide Unit',
    shortCode: 'HOM',
    description: 'Specialized detective squad conducting inquiries into fatal violent crimes and suspicious deaths.',
    isInvestigative: true,
  },
  major_crimes: {
    id: 'major_crimes',
    name: 'Major Crimes Bureau',
    shortCode: 'MCB',
    description: 'Investigates grand larcenies, armed robberies, kidnappings, and organized crime syndicates.',
    isInvestigative: true,
  },
  narcotics: {
    id: 'narcotics',
    name: 'Narcotics & Special Investigations',
    shortCode: 'NAR',
    description: 'Undercover operations and long-term surveillance on illicit drug distribution networks.',
    isInvestigative: true,
  },
  traffic: {
    id: 'traffic',
    name: 'Traffic Enforcement & Collision Analysis',
    shortCode: 'TRF',
    description: 'Manages arterial transit compliance, DUI checkpoints, and serious collision reconstructions.',
    isInvestigative: false,
  },
  swat: {
    id: 'swat',
    name: 'Special Weapons and Tactics (SWAT)',
    shortCode: 'SWAT',
    description: 'High-risk tactical breach, active shooter neutralization, and barricaded suspect containment.',
    isInvestigative: false,
  },
  csi: {
    id: 'csi',
    name: 'Crime Scene Investigation & Forensics',
    shortCode: 'CSI',
    description: 'Technical evidence recovery, ballistics analysis, fingerprinting, and digital chain-of-custody.',
    isInvestigative: true,
  },
  internal_affairs: {
    id: 'internal_affairs',
    name: 'Internal Affairs Division',
    shortCode: 'IAD',
    description: 'Investigates departmental misconduct, use-of-force incidents, and ethics compliance.',
    isInvestigative: true,
  },
  missing_persons: {
    id: 'missing_persons',
    name: 'Missing Persons & Juvenile Bureau',
    shortCode: 'MPD',
    description: 'Specializes in runaway recoveries, vulnerable adult welfare, and abducted minor tracing.',
    isInvestigative: true,
  },
  cyber_crime: {
    id: 'cyber_crime',
    name: 'Cyber Crime & Digital Forensics',
    shortCode: 'CYB',
    description: 'Handles financial fraud, network intrusion, digital extortion, and hardware decryption.',
    isInvestigative: true,
  },
};

export const DIVISION_LIST = Object.values(POLICE_DIVISIONS);

export function getDivisionDefinition(divId: DivisionId): DivisionDefinition {
  return (
    POLICE_DIVISIONS[divId] || {
      id: divId,
      name: divId,
      shortCode: divId.substring(0, 3).toUpperCase(),
      description: 'Specialized precinct operational detachment.',
      isInvestigative: false,
    }
  );
}
