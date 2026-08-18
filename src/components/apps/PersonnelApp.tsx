import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { Officer } from '../../domain/types/officer.types';
import { DEV_OFFICERS } from '../../domain/seed/devOfficers';
import { getRankDefinition } from '../../domain/definitions/ranks';
import { getDivisionDefinition } from '../../domain/definitions/divisions';
import { getOfficerFullName } from '../../domain/helpers/nameHelpers';
import { OfficerProfileModal } from './personnel/OfficerProfileModal';

export const PersonnelApp: React.FC<{ windowId: string; appId: string }> = () => {
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  const officers = DEV_OFFICERS;

  const filtered = officers.filter((officer) => {
    const divDef = getDivisionDefinition(officer.divisionId);
    const rankDef = getRankDefinition(officer.rankId);
    const fullName = getOfficerFullName(officer);

    const matchesDivision =
      selectedDivision === 'ALL' ||
      officer.divisionId.toLowerCase() === selectedDivision.toLowerCase() ||
      divDef.name.toLowerCase().includes(selectedDivision.toLowerCase());

    const matchesSearch =
      searchTerm.trim() === '' ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.badgeNumber.includes(searchTerm) ||
      rankDef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      divDef.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDivision && matchesSearch;
  });

  const onDutyCount = officers.filter((o) => o.dutyStatus === 'on_duty').length;
  const onCallCount = officers.filter((o) => o.dutyStatus === 'on_call').length;

  return (
    <div className="relative flex flex-col h-full bg-white text-slate-900 text-xs font-sans select-text overflow-hidden">
      {/* Top Filter & Stats Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search officer, badge #, or rank..."
              className="bg-white border border-slate-300 rounded pl-8 pr-3 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 w-60 sm:w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5">
            {['ALL', 'Patrol', 'Major Crimes', 'Narcotics', 'SWAT'].map((div) => (
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
          <span>
            Active Roster: <strong className="text-slate-900 font-mono">{officers.length}</strong>
          </span>
          <span>
            On Duty: <strong className="text-emerald-700 font-mono">{onDutyCount}</strong>
          </span>
          <span>
            On Call: <strong className="text-blue-700 font-mono">{onCallCount}</strong>
          </span>
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
              <th className="py-2.5 px-3.5">Shift</th>
              <th className="py-2.5 px-3.5">Duty Status</th>
              <th className="py-2.5 px-3.5">Traits</th>
              <th className="py-2.5 px-3.5 text-right">Service</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.map((officer) => {
              const rankDef = getRankDefinition(officer.rankId);
              const divDef = getDivisionDefinition(officer.divisionId);
              const fullName = getOfficerFullName(officer);

              return (
                <tr
                  key={officer.id}
                  onClick={() => setSelectedOfficer(officer)}
                  className="hover:bg-blue-50/50 transition cursor-pointer group"
                >
                  <td className="py-2.5 px-3.5 font-mono font-semibold text-blue-700 group-hover:text-blue-900">
                    #{officer.badgeNumber}
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center border border-slate-200 text-[10px] font-bold text-slate-600 group-hover:text-blue-800 transition">
                      {officer.firstName[0]}
                      {officer.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition">
                        {fullName}
                      </div>
                      {officer.callsign && (
                        <div className="text-[10px] text-slate-400 font-mono">{officer.callsign}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-700">{rankDef.name}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{divDef.name}</td>
                  <td className="py-2.5 px-3.5 text-slate-600 uppercase font-mono text-[11px]">
                    {officer.shift.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                        officer.dutyStatus === 'on_duty'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : officer.dutyStatus === 'on_call'
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          officer.dutyStatus === 'on_duty'
                            ? 'bg-emerald-500'
                            : officer.dutyStatus === 'on_call'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      {officer.dutyStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex flex-wrap gap-1">
                      {officer.traitIds.length > 0 ? (
                        officer.traitIds.map((tId) => (
                          <span
                            key={tId}
                            className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-medium capitalize"
                          >
                            {tId.replace(/_/g, ' ')}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">None</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                    {officer.yearsOfService} Yrs
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Department Personnel Database — Click any officer to open dossier & comms</span>
        <span>Authorized: Command Staff</span>
      </div>

      {/* Officer Profile Dossier Modal */}
      {selectedOfficer && (
        <OfficerProfileModal
          officer={selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
        />
      )}
    </div>
  );
};
