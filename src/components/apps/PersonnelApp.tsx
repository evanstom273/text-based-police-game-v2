import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const PersonnelApp: React.FC<{ windowId: string; appId: string }> = () => {
  const [selectedDivision, setSelectedDivision] = useState('ALL');

  const officers = [
    { badge: '4011', name: 'James Miller', rank: 'Senior Officer', div: 'Patrol', shift: 'Night Shift (B)', status: 'On Duty', stress: 'Low', exp: '8 Yrs' },
    { badge: '4012', name: 'Linda Chen', rank: 'Patrol Officer', div: 'Patrol', shift: 'Night Shift (B)', status: 'On Duty', stress: 'Low', exp: '3 Yrs' },
    { badge: '3104', name: 'Marcus Kowalski', rank: 'Sergeant', div: 'Patrol (Field Sup)', shift: 'Night Shift (B)', status: 'On Duty', stress: 'Moderate', exp: '14 Yrs' },
    { badge: '2088', name: 'Elena Velez', rank: 'Detective', div: 'Major Crimes', shift: 'Day Shift (A)', status: 'On Call', stress: 'Elevated', exp: '11 Yrs' },
    { badge: '2092', name: 'David Sterling', rank: 'Detective', div: 'Narcotics', shift: 'Day Shift (A)', status: 'Off Duty', stress: 'Low', exp: '6 Yrs' },
    { badge: '5019', name: 'Sarah Hayes', rank: 'Lieutenant', div: 'Administration', shift: 'Day Shift (A)', status: 'On Duty', shiftLeader: true, exp: '19 Yrs' },
    { badge: '1004', name: 'Buster / Vance', rank: 'K-9 Specialist', div: 'Tactical / K9', shift: 'Night Shift (B)', status: 'On Duty', stress: 'Low', exp: '5 Yrs' },
  ];

  const filtered = selectedDivision === 'ALL' ? officers : officers.filter(o => o.div.includes(selectedDivision));

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 text-xs select-text">
      {/* Top Filter & Stats Bar */}
      <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search officer name, badge #, or rank..." 
              className="bg-slate-900 border border-slate-700/80 rounded pl-8 pr-3 py-1 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5">
            {['ALL', 'Patrol', 'Major Crimes', 'Tactical'].map(div => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  selectedDivision === div 
                    ? 'bg-sky-950 text-sky-300 border border-sky-800/80 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>TOTAL STRENGTH: <strong className="text-slate-200">42</strong></span>
          <span>ON-DUTY: <strong className="text-emerald-400">18</strong></span>
          <span>LEAVE/SICK: <strong className="text-amber-400">3</strong></span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 text-[11px] font-mono sticky top-0 uppercase tracking-wider">
              <th className="py-2.5 px-3">Badge</th>
              <th className="py-2.5 px-3">Officer Name</th>
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Division</th>
              <th className="py-2.5 px-3">Current Shift</th>
              <th className="py-2.5 px-3">Duty Status</th>
              <th className="py-2.5 px-3">Stress / Condition</th>
              <th className="py-2.5 px-3 text-right">Service</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filtered.map((officer) => (
              <tr key={officer.badge} className="hover:bg-slate-800/40 transition group cursor-pointer">
                <td className="py-2.5 px-3 font-mono font-bold text-sky-400">
                  #{officer.badge}
                </td>
                <td className="py-2.5 px-3 font-medium text-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-[10px] font-bold text-slate-400">
                    {officer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {officer.name}
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  {officer.rank}
                </td>
                <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                  {officer.div}
                </td>
                <td className="py-2.5 px-3 text-slate-400">
                  {officer.shift}
                </td>
                <td className="py-2.5 px-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium font-mono border ${
                    officer.status === 'On Duty' 
                      ? 'bg-emerald-950/70 border-emerald-800/60 text-emerald-400' 
                      : officer.status === 'On Call'
                      ? 'bg-sky-950/70 border-sky-800/60 text-sky-400'
                      : 'bg-slate-800/70 border-slate-700 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      officer.status === 'On Duty' ? 'bg-emerald-400' : officer.status === 'On Call' ? 'bg-sky-400' : 'bg-slate-500'
                    }`}></span>
                    {officer.status}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`text-[11px] font-mono ${
                    officer.stress === 'Elevated' ? 'text-amber-400 font-bold' : 'text-slate-400'
                  }`}>
                    {officer.stress}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                  {officer.exp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>PRECINCT ROSTER DATABASE — 4TH PRECINCT RECORD ARCHIVE</span>
        <span className="text-slate-500">AUTHORIZATION: COMMAND STAFF ONLY</span>
      </div>
    </div>
  );
};
