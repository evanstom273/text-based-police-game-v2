import React, { useState } from 'react';
import { Inbox, Send, Archive, ShieldAlert } from 'lucide-react';

export const InboxApp: React.FC<{ windowId: string; appId: string }> = () => {
  const [selectedMail, setSelectedMail] = useState<string>('m1');

  const emails = [
    {
      id: 'm1',
      from: 'Chief of Police E. Bradley <e.bradley@metro.pd.gov>',
      subject: 'URGENT: City Council Oversight Hearing — Q3 Overtime Analysis',
      time: '03:15 AM',
      date: 'Today',
      unread: true,
      priority: 'high',
      body: `Captain,\n\nThe City Council Public Safety Committee has moved the budget audit forward by two weeks. They are scrutinizing 4th Precinct's overtime expenditures during the recent Riverfront patrol surge.\n\nHave your shift supervisors submit justification memos for all Level-2 tactical deployments by 0800 hours tomorrow. I need your executive summary on my desk before the morning press briefing.\n\nKeep a tight lid on this.\n\nChief Bradley\nOffice of the Police Commissioner`
    },
    {
      id: 'm2',
      from: 'Internal Affairs Division <iad.notifications@metro.pd.gov>',
      subject: 'Case Update: #IA-26-0041 (Incident at 8th & Broadway)',
      time: 'Yesterday',
      date: '2026-08-17',
      unread: true,
      priority: 'high',
      body: `Captain,\n\nBody camera footage review from the August 12 pursuit involving Unit 402 has concluded preliminary intake. No procedural violations were flagged at this stage.\n\nFull IA disposition report will be transmitted to the precinct records bureau by Friday.\n\nRespectfully,\nLt. K. Ramos, Internal Affairs`
    },
    {
      id: 'm3',
      from: 'City Fleet Maintenance <motorpool@metro.gov>',
      subject: 'Vehicle Maintenance Recall: Cruiser 406 & 412 Alternator Inspection',
      time: 'Aug 16',
      date: '2026-08-16',
      unread: false,
      priority: 'normal',
      body: `Captain,\n\nPlease instruct your motor pool officer to cycle Cruiser 406 and 412 to Municipal Depot B on Wednesday for preventative alternator replacements under service bulletin #SB-89.\n\nExpected downtime: 4 hours per unit.\n\nRegards,\nFleet Logistics Coordinator`
    },
    {
      id: 'm4',
      from: 'Sgt. M. Kowalski <m.kowalski.3104@metro.pd.gov>',
      subject: 'Night Shift B - Shift Handover & Priority Log',
      time: 'Aug 16',
      date: '2026-08-16',
      unread: false,
      priority: 'normal',
      body: `Captain,\n\nNight shift B was mostly standard with 14 dispatched calls. We seized two unregistered firearms during a traffic stop on Elm Street (Case #26-0849). Both suspects processed into Central Booking.\n\nMorale is good. Officer Chen performed well handling a volatile domestic call without incident.\n\nSgt. Kowalski`
    }
  ];

  const current = emails.find(e => e.id === selectedMail) || emails[0];

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 text-xs select-text">
      {/* Mail Sidebar Folders */}
      <div className="w-44 border-r border-slate-800 bg-slate-950/60 p-2 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Folders
          </div>
          <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-sky-950/80 text-sky-300 font-semibold border border-sky-800/60">
            <span className="flex items-center gap-2">
              <Inbox className="w-3.5 h-3.5 text-sky-400" />
              Inbox
            </span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono">2</span>
          </button>
          <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              High Priority
            </span>
          </button>
          <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition">
            <span className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-slate-500" />
              Sent Items
            </span>
          </button>
          <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition">
            <span className="flex items-center gap-2">
              <Archive className="w-3.5 h-3.5 text-slate-500" />
              Archive
            </span>
          </button>
        </div>

        <div className="p-2 bg-slate-900 border border-slate-800/80 rounded text-[10px] text-slate-400 font-mono">
          <div>ENC: AES-256</div>
          <div className="text-emerald-400">STATUS: SECURE</div>
        </div>
      </div>

      {/* Mail List */}
      <div className="w-72 border-r border-slate-800 flex flex-col bg-slate-950/20">
        <div className="p-2 border-b border-slate-800 bg-slate-950/60 font-mono text-[11px] text-slate-400 flex justify-between">
          <span>INBOX (4 MESSAGES)</span>
          <span className="text-sky-400">FILTER</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {emails.map((e) => (
            <div
              key={e.id}
              onClick={() => setSelectedMail(e.id)}
              className={`p-2.5 cursor-pointer transition ${
                selectedMail === e.id 
                  ? 'bg-slate-800/80 border-l-2 border-l-sky-400' 
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold truncate max-w-[150px] ${e.unread ? 'text-white' : 'text-slate-400'}`}>
                  {e.from.split('<')[0]}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{e.time}</span>
              </div>
              <p className={`line-clamp-1 mb-1 ${e.unread ? 'text-sky-300 font-medium' : 'text-slate-300'}`}>
                {e.subject}
              </p>
              <p className="line-clamp-1 text-[11px] text-slate-500">
                {e.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Reader View */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <div className="p-3 bg-slate-950/50 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-100">{current.subject}</h3>
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 font-medium text-[11px]">
                Reply
              </button>
              <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 font-medium text-[11px]">
                Forward
              </button>
            </div>
          </div>
          <div className="text-slate-400 text-[11px] space-y-0.5 font-mono">
            <div>FROM: <span className="text-slate-200">{current.from}</span></div>
            <div>DATE: <span className="text-slate-300">{current.date} ({current.time})</span></div>
            <div>TO: <span className="text-slate-300">Captain, 4th Precinct Command Staff</span></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 font-sans text-slate-300 leading-relaxed whitespace-pre-line text-xs">
          {current.body}
        </div>
      </div>
    </div>
  );
};
