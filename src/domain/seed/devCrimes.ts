import type { CrimeIncident } from '../types/crime.types';

/**
 * Seed / Development Crime and Incident Dataset
 * Demonstrates dispatched calls, pending priority incidents, and closed cases.
 */
export const DEV_CRIMES: CrimeIncident[] = [
  {
    id: 'INC-2026-0841',
    cadNumber: 'CAD-211-04',
    crimeTypeId: 'robbery',
    title: 'Armed Robbery — QuickMart Convenience',
    description: 'Male suspect in dark hooded jacket displayed black semi-automatic handgun, took cash drawer contents, and fled east on foot toward railroad tracks.',
    location: {
      address: '842 W. Roosevelt Ave',
      sector: 'Sector 2',
      venueName: 'QuickMart #14',
      coordinates: { x: 490, y: 180 },
    },
    priority: 'critical',
    status: 'in_progress',
    outcome: 'none',
    reportedAt: '2026-08-18T03:38:00Z',
    dispatchedAt: '2026-08-18T03:39:15Z',
    assignedOfficerIds: ['officer-3104', 'officer-4081'], // Sgt. Kowalski & Ofc. Diaz
    caseId: '26-0841',
    suspectDescriptions: ['Male, 6ft, dark hoodie, dark jeans, handgun'],
    notes: ['Witness states suspect dropped silver wristwatch near dumpster during escape.'],
  },
  {
    id: 'INC-2026-0842',
    cadNumber: 'CAD-415-08',
    crimeTypeId: 'domestic_incident',
    title: 'Domestic Disturbance / Noise',
    description: 'Ongoing loud argument and physical disturbance with sounds of broken glass reported by 2nd floor tenant.',
    location: {
      address: '1104 Elmwood Terr, Apt 3B',
      sector: 'Sector 3',
      venueName: 'Elmwood Residential Complex',
      coordinates: { x: 140, y: 380 },
    },
    priority: 'medium',
    status: 'dispatched',
    outcome: 'none',
    reportedAt: '2026-08-18T03:31:00Z',
    dispatchedAt: '2026-08-18T03:33:00Z',
    assignedOfficerIds: ['officer-4082'], // Ofc. Gallagher
    notes: ['History of prior welfare checks at this address.'],
  },
  {
    id: 'INC-2026-0840',
    cadNumber: 'CAD-1031-12',
    crimeTypeId: 'suspicious_activity',
    title: 'Suspicious Vehicle Loitering',
    description: 'Unmarked white commercial cargo van parked near industrial shipping bay with headlights turned off since 02:00.',
    location: {
      address: 'Oak Street Industrial Park, Gate 4',
      sector: 'Sector 4',
      venueName: 'Oak Industrial Logistics',
      coordinates: { x: 520, y: 420 },
    },
    priority: 'low',
    status: 'waiting',
    outcome: 'none',
    reportedAt: '2026-08-18T03:22:00Z',
    assignedOfficerIds: [],
    notes: ['Caller reports two individuals standing by rear cargo door.'],
  },
  {
    id: 'INC-2026-0799',
    cadNumber: 'CAD-459-01',
    crimeTypeId: 'burglary',
    title: 'Commercial Vault Burglary — Diamond Exchange',
    description: 'After-hours silent intrusion. Safe bypassed using high-temperature thermal cutting equipment without triggering vibration sensors.',
    location: {
      address: '420 Diamond Way, Suite 100',
      sector: 'Sector 1',
      venueName: 'Midtown Diamond Exchange',
      coordinates: { x: 190, y: 110 },
    },
    priority: 'high',
    status: 'resolved',
    outcome: 'under_investigation',
    reportedAt: '2026-08-09T06:00:00Z',
    dispatchedAt: '2026-08-09T06:05:00Z',
    resolvedAt: '2026-08-09T14:30:00Z',
    assignedOfficerIds: ['officer-2088'], // Det. Velez
    caseId: '26-0799',
    evidenceIds: ['EVID-01', 'EVID-02', 'EVID-03', 'EVID-04'],
    notes: ['Estimated loss $420,000 in uncut gems. Handed over to Major Crimes Bureau.'],
  },
  {
    id: 'INC-2026-0752',
    cadNumber: 'CAD-11350-02',
    crimeTypeId: 'drug_offence',
    title: 'Riverfront Narcotics Hub Surveillance',
    description: 'Multi-jurisdictional fentanyl and illicit stimulant trafficking network operating out of riverfront shipping depot.',
    location: {
      address: 'Pier 14 Logistics Yard',
      sector: 'Sector 2',
      venueName: 'St. Jude Trucking Warehouse',
      coordinates: { x: 550, y: 220 },
    },
    priority: 'high',
    status: 'in_progress',
    outcome: 'under_investigation',
    reportedAt: '2026-07-28T12:00:00Z',
    assignedOfficerIds: ['officer-2092'], // Det. Sterling
    caseId: '26-0752',
    evidenceIds: ['EVID-21', 'EVID-22', 'EVID-23'],
    notes: ['Long-term surveillance operation in coordination with state police.'],
  },
];
