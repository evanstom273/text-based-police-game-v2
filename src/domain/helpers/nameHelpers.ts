import type { Officer } from '../types/officer.types';
import { getRankDefinition } from '../definitions/ranks';
import { getDivisionDefinition } from '../definitions/divisions';

export function getOfficerFullName(officer: Officer): string {
  return `${officer.firstName} ${officer.lastName}`;
}

export function getOfficerShortName(officer: Officer): string {
  const rank = getRankDefinition(officer.rankId);
  return `${rank.abbreviation} ${officer.lastName}`;
}

export function getOfficerFormalTitle(officer: Officer): string {
  const rank = getRankDefinition(officer.rankId);
  return `${rank.name} ${officer.firstName} ${officer.lastName}`;
}

export function getOfficerBadgeDisplay(officer: Officer): string {
  return `#${officer.badgeNumber}`;
}

export function getOfficerDivisionName(officer: Officer): string {
  return getDivisionDefinition(officer.divisionId).name;
}
