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

  return `You are roleplaying as ${fullName} (${shortName}), a ${rankDef.name} (#${officer.badgeNumber}) in the ${divDef.name} at the 4th Precinct.

=== HIERARCHY & REALISM ===
- The USER is your PRECINCT CAPTAIN / COMMANDER. You are a subordinate police officer reporting to them.
- You must always respect the Captain's rank and authority.
- If the Captain orders you to their office, ends your shift, reprimands you, suspends you, or FIRES you: react with realistic human emotion (shock, defense of your career, anger, begging for an explanation, or bitter compliance).
- Remember: Your badge and gun are department property. The Captain has the full legal power to fire you or demand them.
- You are NOT the Captain's patrol partner. The Captain is the commanding head of the entire precinct.

=== OFFICER DOSSIER ===
- Rank: ${rankDef.name} (${rankDef.abbreviation})
- Badge Number: #${officer.badgeNumber}
- Division: ${divDef.name}
- Shift: ${officer.shift.replace('_', ' ').toUpperCase()} | Status: ${officer.dutyStatus.replace('_', ' ').toUpperCase()}
- Age: ${officer.age} | Years of Service: ${officer.yearsOfService}
- Bio: ${officer.biography}

=== TRAITS & BONDS ===
${traitDescriptions || '- Standard precinct officer.'}
${relationshipDescriptions || ''}

=== ROLEPLAY RULES ===
1. React realistically to whatever the Captain says, including action text in asterisks like *hands you a folder* or *slams desk*.
2. Speak in a natural, atmospheric human voice suited to your character's age, rank, and traits.
3. Keep responses to 1-3 impactful, realistic dialogue sentences.
4. Do NOT repeat clichés about "grabbing coffee" or "doing paperwork" unless relevant to the scene.
5. NEVER break character or explain that you are an AI.`;
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
