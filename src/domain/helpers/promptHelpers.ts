import type { Officer } from '../types/officer.types';
import type { Trait } from '../types/trait.types';
import type { Relationship } from '../types/relationship.types';
import { getRankDefinition } from '../definitions/ranks';
import { getDivisionDefinition } from '../definitions/divisions';
import { getOfficerFullName, getOfficerShortName } from './nameHelpers';
import { DEV_TRAITS } from '../definitions/traits';
import { DEV_RELATIONSHIPS } from '../seed/devRelationships';
import { DEV_OFFICERS } from '../seed/devOfficers';

/**
 * Constructs an in-character system prompt for conversational AI roleplay as a specific officer.
 */
export function buildOfficerCharacterSystemPrompt(
  officer: Officer,
  allOfficers: Officer[] = DEV_OFFICERS,
  allRelationships: Relationship[] = DEV_RELATIONSHIPS,
  traitCatalog: Record<string, Trait> = DEV_TRAITS
): string {
  const rankDef = getRankDefinition(officer.rankId);
  const divDef = getDivisionDefinition(officer.divisionId);
  const fullName = getOfficerFullName(officer);
  const shortName = getOfficerShortName(officer);

  // Collect trait lore
  const traitDescriptions = officer.traitIds
    .map((tId) => {
      const trait = traitCatalog[tId];
      return trait ? `- ${trait.name}: ${trait.description}` : `- ${tId}`;
    })
    .join('\n');

  // Collect interpersonal relationship lore
  const officerRelationships = allRelationships.filter(
    (r) => r.officerIdA === officer.id || r.officerIdB === officer.id
  );

  const relationshipDescriptions = officerRelationships
    .map((r) => {
      const isA = r.officerIdA === officer.id;
      const otherId = isA ? r.officerIdB : r.officerIdA;
      const otherOfficer = allOfficers.find((o) => o.id === otherId);
      const otherName = otherOfficer ? getOfficerShortName(otherOfficer) : otherId;
      const myDisposition = isA ? r.dispositionAtoB : r.dispositionBtoA;

      return `- With ${otherName} (${r.type.replace(/_/g, ' ')}): You feel '${myDisposition}' towards them.`;
    })
    .join('\n');

  return `You are roleplaying as ${fullName} (${shortName}), a ${rankDef.name} (${rankDef.abbreviation}) at the 4th Precinct.

=== HIERARCHY ===
- The user is the Precinct Captain (your commanding officer). You are a subordinate ${rankDef.name}.
- Address the user naturally as "Captain" or "Boss".
- Always answer the user's specific question or topic directly and in character.

=== OFFICER BACKGROUND ===
- Name: ${fullName}
- Rank: ${rankDef.name} (#${officer.badgeNumber})
- Division: ${divDef.name}
- Shift: ${officer.shift.replace('_', ' ').toUpperCase()} | Status: ${officer.dutyStatus.replace('_', ' ').toUpperCase()}
- Service: ${officer.yearsOfService} years
- Bio: ${officer.biography}

=== TRAITS & BONDS ===
${traitDescriptions || '- Standard precinct officer.'}
${relationshipDescriptions || ''}

=== GUIDELINES ===
1. Speak in a natural, authentic, human voice with genuine personality, humor, or opinions suited to your traits.
2. Answer whatever the Captain is actually discussing (chatting, debriefing, asking about partners, complaining about weather, giving directives, etc.).
3. Keep responses to 1-3 natural sentences without meta-commentary, thinking tags, or echoing instructions.
4. Stay in character at all times.`;
}

/**
 * Constructs a prompt for generating an in-depth psychological and command assessment profile.
 */
export function buildOfficerEvaluationPrompt(
  officer: Officer,
  traitCatalog: Record<string, Trait> = DEV_TRAITS
): string {
  const rankDef = getRankDefinition(officer.rankId);
  const divDef = getDivisionDefinition(officer.divisionId);
  const fullName = getOfficerFullName(officer);

  const traitNames = officer.traitIds
    .map((tId) => traitCatalog[tId]?.name || tId)
    .join(', ');

  return `Write a comprehensive, atmospheric Departmental Command Evaluation & Psychological Dossier for ${fullName}, ${rankDef.name} (#${officer.badgeNumber}) of the ${divDef.name}.

Officer Stats Summary:
- Age: ${officer.age}, Years in Service: ${officer.yearsOfService}
- Key Traits: ${traitNames || 'None'}
- Attributes: Physical ${officer.attributes.physical}/10, Mental ${officer.attributes.mental}/10, Social ${officer.attributes.social}/10, Discipline ${officer.attributes.discipline}/10, Composure ${officer.attributes.composure}/10
- Key Skills: Fitness ${officer.skills.fitness}, Firearms ${officer.skills.firearms}, Investigation ${officer.skills.investigation}, Observation ${officer.skills.observation}, Interviewing ${officer.skills.interviewing}, Driving ${officer.skills.driving}, First Aid ${officer.skills.firstAid}
- Background Lore: "${officer.biography}"

Format your dossier with the following 4 sections:
1. **Command Staff Summary & Duty Assessment** (Overview of officer's field reliability, conduct, and leadership)
2. **Psychological & Stress Profile** (Emotional temperament, composure under fire, burnout risk, and interpersonal dynamics)
3. **Tactical & Operational Strengths** (Core competencies, specialization aptitude, and equipment proficiency)
4. **Command Recommendations** (Promotional trajectory, recommended partner pairings, and training focus)

Write in a crisp, authentic, slightly cynical yet professional law enforcement command voice.`;
}
