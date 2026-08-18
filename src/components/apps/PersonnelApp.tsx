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
    <div className="flex flex-col h-full bg-white text-slate-900 text-xs font-sans select-text">
      {/* Top Filter & Stats Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search officer, badge #, or rank..." 
              className="bg-white border border-slate-300 rounded pl-8 pr-3 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 w-60 sm:w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5">
            {['ALL', 'Patrol', 'Major Crimes', 'Tactical'].map(div => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedDivision === div 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600 text-xs">
          <span>Active Roster: <strong className="text-slate-900 font-mono">42</strong></span>
          <span>On Duty: <strong className="text-emerald-700 font-mono">18</strong></span>
          <span>On Leave: <strong className="text-amber-700 font-mono">3</strong></span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold sticky top-0 uppercase tracking-wider">
              <th className="py-2.5 px-3.5">Badge</th>
              <th className="py-2.5 px-3.5">Officer Name</th>
              <th className="py-2.5 px-3.5">Rank</th>
              <th className="py-2.5 px-3.5">Division</th>
              <th className="py-2.5 px-3.5">Current Shift</th>
              <th className="py-2.5 px-3.5">Duty Status</th>
              <th className="py-2.5 px-3.5">Stress Level</th>
              <th className="py-2.5 px-3.5 text-right">Service</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.map((officer) => (
              <tr key={officer.badge} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="py-2.5 px-3.5 font-mono font-semibold text-blue-700">
                  #{officer.badge}
                </td>
                <td className="py-2.5 px-3.5 font-medium text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-[10px] font-bold text-slate-600">
                    {officer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {officer.name}
                </td>
                <td className="py-2.5 px-3.5 text-slate-700">
                  {officer.rank}
                </td>
                <td className="py-2.5 px-3.5 text-slate-600">
                  {officer.div}
                </td>
                <td className="py-2.5 px-3.5 text-slate-600">
                  {officer.shift}
                </td>
                <td className="py-2.5 px-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                    officer.status === 'On Duty' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : officer.status === 'On Call'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      officer.status === 'On Duty' ? 'bg-emerald-500' : officer.status === 'On Call' ? 'bg-blue-500' : 'bg-slate-400'
                    }`}></span>
                    {officer.status}
                  </span>
                </td>
                <td className="py-2.5 px-3.5">
                  <span className={`text-xs ${
                    officer.stress === 'Elevated' ? 'text-amber-800 font-semibold' : 'text-slate-600'
                  }`}>
                    {officer.stress}
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                  {officer.exp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Department Personnel Database — 4th Precinct Archive</span>
        <span>Authorized: Command Staff</span>
      </div>
    </div>
  );
};
