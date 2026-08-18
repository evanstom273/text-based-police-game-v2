import type { AppDefinition } from '../types';
import { DispatchApp } from '../components/apps/DispatchApp';
import { PersonnelApp } from '../components/apps/PersonnelApp';
import { CaseFilesApp } from '../components/apps/CaseFilesApp';
import { InboxApp } from '../components/apps/InboxApp';
import { CrimeAnalyticsApp } from '../components/apps/CrimeAnalyticsApp';
import { BudgetApp } from '../components/apps/BudgetApp';
import { CityMapApp } from '../components/apps/CityMapApp';

export const APP_REGISTRY: Record<string, AppDefinition> = {
  dispatch: {
    id: 'dispatch',
    name: 'Dispatch / CAD',
    shortName: 'CAD',
    subtitle: 'Computer-Aided Dispatch & Unit Tracking',
    description: 'Emergency 911 call intake, incident queue, and patrol unit dispatch matrix.',
    category: 'Operations',
    badgeCode: 'CAD-01',
    icon: 'dispatch',
    defaultSize: { width: 840, height: 560 },
    minSize: { width: 560, height: 400 },
    defaultGridPos: { row: 0, col: 0 },
    component: DispatchApp,
  },
  personnel: {
    id: 'personnel',
    name: 'Personnel',
    shortName: 'Roster',
    subtitle: 'Officer Roster & Shift Command',
    description: 'Departmental directory, duty assignments, stress levels, and personnel files.',
    category: 'Records',
    badgeCode: 'PERS-04',
    icon: 'personnel',
    defaultSize: { width: 880, height: 580 },
    minSize: { width: 600, height: 420 },
    defaultGridPos: { row: 1, col: 0 },
    component: PersonnelApp,
  },
  cases: {
    id: 'cases',
    name: 'Case Files',
    shortName: 'Cases',
    subtitle: 'Detective Bureau & Evidence Records',
    description: 'Open investigations, suspect dossiers, ballistic reports, and active warrants.',
    category: 'Records',
    badgeCode: 'CASE-09',
    icon: 'cases',
    defaultSize: { width: 880, height: 580 },
    minSize: { width: 620, height: 420 },
    defaultGridPos: { row: 2, col: 0 },
    component: CaseFilesApp,
  },
  inbox: {
    id: 'inbox',
    name: 'Inbox',
    shortName: 'Comms',
    subtitle: 'Encrypted Department Communications',
    description: 'Internal memos, City Hall alerts, IA communications, and shift handovers.',
    category: 'Communications',
    badgeCode: 'COMM-02',
    icon: 'inbox',
    defaultSize: { width: 820, height: 540 },
    minSize: { width: 580, height: 380 },
    defaultGridPos: { row: 3, col: 0 },
    component: InboxApp,
  },
  analytics: {
    id: 'analytics',
    name: 'Crime Analytics',
    shortName: 'Analytics',
    subtitle: 'CompStat & Threat Assessment',
    description: 'Crime heatmaps, clearance benchmarks, 28-day trends, and patrol efficiency.',
    category: 'Intelligence',
    badgeCode: 'STAT-07',
    icon: 'analytics',
    defaultSize: { width: 840, height: 560 },
    minSize: { width: 560, height: 400 },
    defaultGridPos: { row: 4, col: 0 },
    component: CrimeAnalyticsApp,
  },
  budget: {
    id: 'budget',
    name: 'Budget',
    shortName: 'Fiscal',
    subtitle: 'Department Ledger & Equipment Requisitions',
    description: 'Overtime burn rates, fleet maintenance reserves, and grant authorizations.',
    category: 'Administration',
    badgeCode: 'ACCT-03',
    icon: 'budget',
    defaultSize: { width: 800, height: 540 },
    minSize: { width: 540, height: 380 },
    defaultGridPos: { row: 5, col: 0 },
    component: BudgetApp,
  },
  map: {
    id: 'map',
    name: 'City Map',
    shortName: 'GIS Map',
    subtitle: 'Tactical Sector GIS & Unit GPS',
    description: 'Precinct boundaries, patrol sector density, and real-time transponder grid.',
    category: 'Operations',
    badgeCode: 'GIS-05',
    icon: 'map',
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 580, height: 420 },
    defaultGridPos: { row: 0, col: 1 },
    component: CityMapApp,
  },
};

export const APP_LIST: AppDefinition[] = Object.values(APP_REGISTRY);

export function getAppById(appId: string): AppDefinition | undefined {
  return APP_REGISTRY[appId];
}
