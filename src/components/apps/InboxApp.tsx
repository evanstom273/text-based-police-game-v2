import React, { useState } from 'react';
import { Inbox, Send, Archive, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export const InboxApp: React.FC<{ windowId: string; appId: string }> = () => {
  const isMobile = useIsMobile(768);
  const [selectedMail, setSelectedMail] = useState<string>('m1');
  const [mobileShowReader, setMobileShowReader] = useState(false);

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

  const handleSelectMail = (id: string) => {
    setSelectedMail(id);
    if (isMobile) {
      setMobileShowReader(true);
    }
  };

  return (
    <div className="flex h-full bg-white text-slate-900 text-xs font-sans select-text">
      {/* Mail Sidebar Folders (Hidden on Mobile) */}
      {!isMobile && (
        <div className="w-44 border-r border-slate-200 bg-slate-50 p-2.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider">
              Mail Folders
            </div>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-900 font-semibold border border-blue-200">
              <span className="flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-blue-700" />
                Inbox
              </span>
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono">2</span>
            </button>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Priority
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
              <span className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-slate-400" />
                Sent
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
              <span className="flex items-center gap-2">
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                Archive
              </span>
            </button>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded text-[11px] text-slate-500">
            <div className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Secure Network
            </div>
          </div>
        </div>
      )}

      {/* Mail List */}
      {(!isMobile || !mobileShowReader) && (
        <div className="w-full md:w-72 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-2.5 border-b border-slate-200 bg-white font-sans text-xs font-semibold text-slate-700 flex justify-between">
            <span>Inbox ({emails.length})</span>
            <span className="text-blue-700 font-medium cursor-pointer">Filter</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
            {emails.map((e) => (
              <div
                key={e.id}
                onClick={() => handleSelectMail(e.id)}
                className={`p-3 cursor-pointer transition ${
                  selectedMail === e.id 
                    ? 'bg-blue-50/80 border-l-4 border-l-blue-600' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`truncate max-w-[160px] ${e.unread ? 'text-slate-950 font-bold' : 'text-slate-600'}`}>
                    {e.from.split('<')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{e.time}</span>
                </div>
                <p className={`line-clamp-1 mb-1 ${e.unread ? 'text-blue-900 font-semibold' : 'text-slate-800'}`}>
                  {e.subject}
                </p>
                <p className="line-clamp-1 text-[11px] text-slate-500">
                  {e.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Reader View */}
      {(!isMobile || mobileShowReader) && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <button
                    onClick={() => setMobileShowReader(false)}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 mr-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h3 className="text-sm font-semibold text-slate-900">{current.subject}</h3>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium text-xs shadow-2xs">
                  Reply
                </button>
                <button className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium text-xs shadow-2xs">
                  Forward
                </button>
              </div>
            </div>
            <div className="text-slate-600 text-[11px] space-y-0.5 font-sans">
              <div>From: <span className="text-slate-900 font-medium">{current.from}</span></div>
              <div>Date: <span className="text-slate-700">{current.date} ({current.time})</span></div>
              <div>To: <span className="text-slate-700">Captain, 4th Precinct Command Staff</span></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 font-sans text-slate-800 leading-relaxed whitespace-pre-line text-xs">
            {current.body}
          </div>
        </div>
      )}
    </div>
  );
};
