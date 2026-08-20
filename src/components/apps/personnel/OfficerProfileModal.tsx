import React, { useState, useEffect } from 'react';
import type { Officer } from '../../../domain/types/officer.types';
import { getRankDefinition } from '../../../domain/definitions/ranks';
import { getDivisionDefinition } from '../../../domain/definitions/divisions';
import { getOfficerFullName, getOfficerShortName } from '../../../domain/helpers/nameHelpers';
import { calculateEffectiveStats } from '../../../domain/helpers/officerStats';
import { DEV_TRAITS } from '../../../domain/definitions/traits';
import { DEV_RELATIONSHIPS } from '../../../domain/seed/devRelationships';
import { DEV_OFFICERS } from '../../../domain/seed/devOfficers';
import { ATTRIBUTES } from '../../../domain/definitions/attributes';
import { SKILLS } from '../../../domain/definitions/skills';
import {
  buildOfficerCharacterSystemPrompt,
  buildOfficerEvaluationPrompt,
} from '../../../domain/helpers/promptHelpers';
import { useAI } from '../../../context/AIContext';
import {
  X,
  User,
  Activity,
  Award,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Send,
  RefreshCw,
  Clock,
  Shield,
  FileText,
  TrendingUp,
  Brain,
  Trash2,
  Zap,
} from 'lucide-react';

interface OfficerProfileModalProps {
  officer: Officer;
  onClose: () => void;
}

interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const OfficerProfileModal: React.FC<OfficerProfileModalProps> = ({ officer, onClose }) => {
  const [activeTab, setActiveTab] = useState<'record' | 'stats' | 'traits' | 'evaluation' | 'chat'>(
    'record'
  );

  const { status: aiStatus, config: aiConfig, generateText, generateChat } = useAI();

  const chatStorageKey = `precinct_chat_v2_${officer.id}`;
  const evalStorageKey = `precinct_eval_v2_${officer.id}`;

  // Evaluation state with local persistence
  const [evaluationText, setEvaluationText] = useState<string>(() => {
    try {
      return localStorage.getItem(evalStorageKey) || '';
    } catch {
      return '';
    }
  });
  const [isGeneratingEval, setIsGeneratingEval] = useState(false);

  // Chat state with local persistence
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [
      {
        role: 'assistant',
        content: `Captain. ${getOfficerShortName(officer)} here, on ${officer.shift.replace('_', ' ')}. What's on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [isStreamingChat, setIsStreamingChat] = useState(false);
  const [streamingReply, setStreamingReply] = useState('');

  // Persist chat messages whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(chatMessages));
    } catch {
      // Storage unavailable
    }
  }, [chatMessages, chatStorageKey]);

  // Persist evaluation text whenever updated
  useEffect(() => {
    try {
      if (evaluationText) {
        localStorage.setItem(evalStorageKey, evaluationText);
      }
    } catch {
      // Storage unavailable
    }
  }, [evaluationText, evalStorageKey]);

  const rankDef = getRankDefinition(officer.rankId);
  const divDef = getDivisionDefinition(officer.divisionId);
  const fullName = getOfficerFullName(officer);
  const stats = calculateEffectiveStats(officer);

  // Filter relationships for this officer
  const relationships = DEV_RELATIONSHIPS.filter(
    (r) => r.officerIdA === officer.id || r.officerIdB === officer.id
  );

  // Clear chat history
  const handleClearChatHistory = () => {
    const defaultMsg: ChatHistoryEntry[] = [
      {
        role: 'assistant',
        content: `Captain. ${getOfficerShortName(officer)} here, on ${officer.shift.replace('_', ' ')}. Comms log reset. What's the situation?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setChatMessages(defaultMsg);
    try {
      localStorage.removeItem(chatStorageKey);
    } catch {
      // Ignore
    }
  };

  // Handle AI Evaluation Generation
  const handleGenerateEvaluation = async () => {
    setIsGeneratingEval(true);
    setEvaluationText('');

    const prompt = buildOfficerEvaluationPrompt(officer, DEV_TRAITS);

    try {
      await generateText({
        prompt,
        stream: true,
        onToken: (token) => {
          setEvaluationText((prev) => prev + token);
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setEvaluationText(`[EVALUATION FAILED]: ${msg}. Please ensure the Gemini backend is connected in System Settings.`);
    } finally {
      setIsGeneratingEval(false);
    }
  };

  // Handle In-Character Chat
  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || chatInput.trim();
    if (!text || isStreamingChat) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatHistoryEntry = { role: 'user', content: text, timestamp: time };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setChatInput('');
    setIsStreamingChat(true);
    setStreamingReply('');

    const systemPrompt = buildOfficerCharacterSystemPrompt(
      officer,
      DEV_OFFICERS,
      DEV_RELATIONSHIPS,
      DEV_TRAITS
    );

    const historyPayload = chatMessages
      .concat(userMsg)
      .slice(-10) // Keep last 10 messages for fast prompt evaluation
      .map((m) => ({ role: m.role, content: m.content }));

    let accumulated = '';

    try {
      await generateChat({
        messages: [{ role: 'system', content: systemPrompt }, ...historyPayload],
        stream: true,
        onToken: (token) => {
          accumulated += token;
          setStreamingReply(accumulated);
        },
      });

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: accumulated, timestamp: replyTime },
      ]);
      setStreamingReply('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `[Static over comms]: Could not reach ${getOfficerShortName(officer)}. (${msg})`,
          timestamp: replyTime,
        },
      ]);
      setStreamingReply('');
    } finally {
      setIsStreamingChat(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-white text-slate-900 flex flex-col z-20 select-text overflow-hidden animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-sm text-blue-800 shadow-2xs">
            {officer.firstName[0]}
            {officer.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{fullName}</span>
              <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                #{officer.badgeNumber}
              </span>
              {officer.callsign && (
                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                  {officer.callsign}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{rankDef.name}</span>
              <span>•</span>
              <span>{divDef.name}</span>
              <span>•</span>
              <span className="uppercase font-mono">{officer.shift.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${
              officer.dutyStatus === 'on_duty'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : officer.dutyStatus === 'on_call'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                officer.dutyStatus === 'on_duty'
                  ? 'bg-emerald-500'
                  : officer.dutyStatus === 'on_call'
                  ? 'bg-blue-500'
                  : 'bg-slate-400'
              }`}
            ></span>
            {officer.dutyStatus.replace('_', ' ').toUpperCase()}
          </span>

          <button
            onClick={onClose}
            title="Close Dossier"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4">
        <button
          onClick={() => setActiveTab('record')}
          className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'record'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Dossier & Bio
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'stats'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Attributes & Skills
        </button>
        <button
          onClick={() => setActiveTab('traits')}
          className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'traits'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Traits & Bonds ({relationships.length})
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'evaluation'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          AI Psychological Dossier
          {evaluationText && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2 px-3 font-medium text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          In-Character Comms
          {chatMessages.length > 1 && (
            <span className="font-mono text-[9px] bg-blue-100 text-blue-800 px-1 rounded-full font-bold">
              {chatMessages.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50">
        {/* 1. Dossier & Bio Tab */}
        {activeTab === 'record' && (
          <div className="space-y-4 max-w-3xl">
            {/* Overview Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Service Summary & Background
              </span>
              <p className="text-slate-700 text-xs leading-relaxed bg-slate-50/70 p-3 rounded border border-slate-200/80">
                {officer.biography}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">Age / Gender</span>
                  <span className="font-semibold text-xs text-slate-800 capitalize">
                    {officer.age} Yrs • {officer.gender.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">Nationality</span>
                  <span className="font-semibold text-xs text-slate-800">{officer.nationality}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">Total Service</span>
                  <span className="font-semibold text-xs text-slate-800">{officer.yearsOfService} Years</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block">Rank Precedence</span>
                  <span className="font-semibold text-xs text-blue-700">Grade {rankDef.order} / 8</span>
                </div>
              </div>
            </div>

            {/* Division Transfer History */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Career Division History
              </span>

              <div className="space-y-2">
                {officer.divisionHistory.map((hist, idx) => {
                  const div = getDivisionDefinition(hist.divisionId);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{div.name}</div>
                        <div className="text-[11px] text-slate-500">{hist.role || 'Operational Member'}</div>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">
                        {hist.startDate} {hist.endDate ? `→ ${hist.endDate}` : '→ Present'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. Attributes & Skills Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4 max-w-3xl">
            {/* Core Attributes Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Core Attributes (1–10 Scale)
              </span>

              <div className="space-y-3">
                {Object.entries(stats.effectiveAttributes).map(([attrKey, effectiveVal]) => {
                  const def = ATTRIBUTES[attrKey as keyof typeof ATTRIBUTES];
                  const breakdown = stats.attributeBreakdown[attrKey as keyof typeof ATTRIBUTES];
                  const percentage = (effectiveVal / 10) * 100;

                  return (
                    <div key={attrKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800 capitalize">{def.name}</span>
                        <div className="flex items-center gap-2">
                          {breakdown.totalModifier !== 0 && (
                            <span
                              className={`text-[10px] font-mono font-semibold ${
                                breakdown.totalModifier > 0 ? 'text-emerald-700' : 'text-red-700'
                              }`}
                            >
                              ({breakdown.totalModifier > 0 ? `+${breakdown.totalModifier}` : breakdown.totalModifier} trait)
                            </span>
                          )}
                          <span className="font-mono font-bold text-slate-900">{effectiveVal} / 10</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorized Skills Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Skills Matrix (1–9 Scale)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(stats.effectiveSkills).map(([skillKey, effectiveVal]) => {
                  const def = SKILLS[skillKey as keyof typeof SKILLS];
                  const breakdown = stats.skillBreakdown[skillKey as keyof typeof SKILLS];

                  return (
                    <div
                      key={skillKey}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-slate-800">{def?.name || skillKey}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{def?.category} skill</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {breakdown.totalModifier !== 0 && (
                          <span
                            className={`text-[10px] font-mono font-semibold ${
                              breakdown.totalModifier > 0 ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {breakdown.totalModifier > 0 ? `+${breakdown.totalModifier}` : breakdown.totalModifier}
                          </span>
                        )}
                        <span className="w-6 h-6 rounded bg-white border border-slate-300 font-mono font-bold text-xs flex items-center justify-center text-blue-700 shadow-2xs">
                          {effectiveVal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Traits & Bonds Tab */}
        {activeTab === 'traits' && (
          <div className="space-y-4 max-w-3xl">
            {/* Active Traits Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                Character Traits & Behavioral Lore
              </span>

              {officer.traitIds.length > 0 ? (
                <div className="space-y-2">
                  {officer.traitIds.map((tId) => {
                    const trait = DEV_TRAITS[tId];
                    if (!trait) return null;

                    return (
                      <div
                        key={tId}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{trait.name}</span>
                          <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                            {trait.category}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{trait.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {Object.entries(trait.attributeModifiers).map(([k, v]) => (
                            <span
                              key={k}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${
                                v > 0
                                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                  : 'bg-red-50 border border-red-200 text-red-800'
                              }`}
                            >
                              {v > 0 ? `+${v}` : v} {k}
                            </span>
                          ))}
                          {Object.entries(trait.skillModifiers).map(([k, v]) => (
                            <span
                              key={k}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${
                                v > 0
                                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                                  : 'bg-amber-50 border border-amber-200 text-amber-800'
                              }`}
                            >
                              {v > 0 ? `+${v}` : v} {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-500 text-xs italic">
                  No specialized traits currently recorded for this officer.
                </div>
              )}
            </div>

            {/* Relationships Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-blue-600" />
                Interpersonal Precinct Relationships
              </span>

              {relationships.length > 0 ? (
                <div className="space-y-2.5">
                  {relationships.map((rel) => {
                    const isA = rel.officerIdA === officer.id;
                    const otherId = isA ? rel.officerIdB : rel.officerIdA;
                    const otherOfficer = DEV_OFFICERS.find((o) => o.id === otherId);
                    const myDisposition = isA ? rel.dispositionAtoB : rel.dispositionBtoA;

                    if (!otherOfficer) return null;

                    return (
                      <div
                        key={rel.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {getOfficerShortName(otherOfficer)}
                            </span>
                            <span className="text-[11px] text-slate-500 capitalize">
                              ({rel.type.replace(/_/g, ' ')})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 border border-blue-200 text-blue-800">
                              Feels: {myDisposition}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-600 bg-slate-200">
                              {rel.strength.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Event history snippets */}
                        {rel.history.length > 0 && (
                          <div className="pl-3 border-l-2 border-slate-300 space-y-1">
                            {rel.history.map((ev) => (
                              <div key={ev.id} className="text-[11px] text-slate-600">
                                <span className="font-mono text-slate-400">{ev.timestamp}: </span>
                                {ev.description}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-500 text-xs italic">
                  Standard professional relationship with precinct staff.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. AI Evaluation Dossier Tab */}
        {activeTab === 'evaluation' && (
          <div className="space-y-4 max-w-3xl">
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-blue-600" />
                    AI Psychological Dossier & Command Assessment
                  </span>
                  <div className="text-[11px] text-slate-500">
                    Synthesizes {fullName}'s stats, personality traits, and service records into a commanding evaluation.
                  </div>
                </div>

                <button
                  onClick={handleGenerateEvaluation}
                  disabled={isGeneratingEval || aiStatus !== 'connected'}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingEval ? 'animate-spin' : ''}`} />
                  {isGeneratingEval ? 'Generating Dossier...' : 'Generate AI Evaluation'}
                </button>
              </div>

              {aiStatus !== 'connected' && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Gemini AI is currently offline. Connect in <strong>System Settings (SYS-08)</strong> to generate dossiers.
                  </span>
                </div>
              )}

              {evaluationText ? (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-sans text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 shadow-inner">
                  {evaluationText}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    No psychological evaluation generated yet for {getOfficerShortName(officer)}.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Click <strong>Generate AI Evaluation</strong> above to request a tactical & stress profile from{' '}
                    <code className="text-blue-700 font-mono">{aiConfig.model}</code>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. In-Character Freeform Comms Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[520px] max-w-3xl bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            {/* Comms Header */}
            <div className="px-4 py-2.5 bg-slate-900 text-slate-200 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-xs text-slate-100">
                  Direct Line: {getOfficerShortName(officer)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  [{officer.callsign || `#${officer.badgeNumber}`}]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-slate-200 text-[10px] font-mono">{aiConfig.model}</span>
                </div>

                <button
                  onClick={handleClearChatHistory}
                  title="Clear Conversation History"
                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Conversation Starters */}
            <div className="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium self-center pl-1">Prompts:</span>
              {[
                "Report on your current sector status.",
                "How's the mood on your shift tonight?",
                "Grab a coffee, let's talk off the record.",
                "How is your rapport with your partner right now?",
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(starter)}
                  disabled={isStreamingChat}
                  className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700 hover:text-blue-700 hover:border-blue-300 transition shadow-2xs disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>

            {/* Chat Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/40">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-600">
                      {msg.role === 'user' ? 'Commander (You)' : getOfficerShortName(officer)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Streaming reply chunk */}
              {isStreamingChat && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-600">
                      {getOfficerShortName(officer)}
                    </span>
                    <span className="text-[9px] text-blue-600 font-mono animate-pulse">
                      typing...
                    </span>
                  </div>
                  <div className="max-w-[85%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap bg-white border border-blue-300 text-slate-800 rounded-tl-none shadow-2xs">
                    {streamingReply || <span className="text-slate-400 italic">Listening...</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Speak with ${getOfficerShortName(officer)} (natural conversation, tactical debrief, or banter)...`}
                disabled={isStreamingChat}
                className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || isStreamingChat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                {isStreamingChat ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Confidential Officer Dossier • 4th Precinct Personnel Command</span>
        <span>Secure Clearance: Captain / Commander • Persistent Comms</span>
      </div>
    </div>
  );
};
