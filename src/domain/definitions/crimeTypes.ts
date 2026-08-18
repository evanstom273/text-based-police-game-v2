import type { CrimeTypeId, CrimePriority } from '../types/crime.types';

export interface CrimeTypeDefinition {
  id: CrimeTypeId;
  name: string;
  cadRadioCode: string;
  defaultPriority: CrimePriority;
  description: string;
  category: 'violent' | 'property' | 'traffic' | 'public_order' | 'special';
}

export const CRIME_TYPES: Record<string, CrimeTypeDefinition> = {
  domestic_incident: {
    id: 'domestic_incident',
    name: 'Domestic Disturbance',
    cadRadioCode: '415-D',
    defaultPriority: 'medium',
    description: 'Physical or verbal domestic dispute requiring immediate peacekeeping and welfare check.',
    category: 'violent',
  },
  assault: {
    id: 'assault',
    name: 'Assault & Battery',
    cadRadioCode: '240',
    defaultPriority: 'high',
    description: 'Active or recent physical altercation resulting in bodily injury or immediate threat.',
    category: 'violent',
  },
  burglary: {
    id: 'burglary',
    name: 'Burglary / Breaking & Entering',
    cadRadioCode: '459',
    defaultPriority: 'medium',
    description: 'Unlawful entry into residential or commercial property with intent to commit felony theft.',
    category: 'property',
  },
  robbery: {
    id: 'robbery',
    name: 'Armed Robbery',
    cadRadioCode: '211',
    defaultPriority: 'critical',
    description: 'Taking of property from person with display or threat of lethal force.',
    category: 'violent',
  },
  traffic_collision: {
    id: 'traffic_collision',
    name: 'Traffic Collision / Hit & Run',
    cadRadioCode: '10-50',
    defaultPriority: 'medium',
    description: 'Motor vehicle collision on public roadway with potential structural hazard or injuries.',
    category: 'traffic',
  },
  missing_person: {
    id: 'missing_person',
    name: 'Missing Person / Endangered Minor',
    cadRadioCode: '10-65',
    defaultPriority: 'high',
    description: 'Unexplained disappearance of vulnerable citizen or juvenile requiring immediate search grid.',
    category: 'special',
  },
  suspicious_activity: {
    id: 'suspicious_activity',
    name: 'Suspicious Activity / Prowler',
    cadRadioCode: '10-31',
    defaultPriority: 'low',
    description: 'Unusual person, loitering vehicle, or unconfirmed security alarm activation.',
    category: 'public_order',
  },
  vandalism: {
    id: 'vandalism',
    name: 'Vandalism / Property Destruction',
    cadRadioCode: '594',
    defaultPriority: 'low',
    description: 'Malicious damage to public or private infrastructure, graffiti, or vehicle tampering.',
    category: 'property',
  },
  drug_offence: {
    id: 'drug_offence',
    name: 'Narcotics Distribution / Sale',
    cadRadioCode: '11-350',
    defaultPriority: 'medium',
    description: 'Street-level transaction or stash distribution of illicit controlled substances.',
    category: 'public_order',
  },
  homicide: {
    id: 'homicide',
    name: 'Homicide / Suspicious Death',
    cadRadioCode: '187',
    defaultPriority: 'critical',
    description: 'Unlawful killing of human being requiring full detective and forensic crime scene lockout.',
    category: 'violent',
  },
};

export const CRIME_TYPE_LIST = Object.values(CRIME_TYPES);

export function getCrimeTypeDefinition(typeId: CrimeTypeId): CrimeTypeDefinition {
  return (
    CRIME_TYPES[typeId] || {
      id: typeId,
      name: typeId.replace(/_/g, ' ').toUpperCase(),
      cadRadioCode: '10-00',
      defaultPriority: 'medium',
      description: 'Incident requiring law enforcement dispatch.',
      category: 'special',
    }
  );
}
