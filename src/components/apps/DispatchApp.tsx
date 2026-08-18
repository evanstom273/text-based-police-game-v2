import React, { useState } from 'react';
import { AlertCircle, Navigation, MapPin } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { DEV_CRIMES } from '../../domain/seed/devCrimes';
import { DEV_OFFICERS } from '../../domain/seed/devOfficers';
import { getCrimeTypeDefinition } from '../../domain/definitions/crimeTypes';
import { getOfficerShortName } from '../../domain/helpers/nameHelpers';

export const DispatchApp: React.FC<{ windowId: string; appId: string }> = () => {
  const isMobile = useIsMobile(640);
  const [mobileTab, setMobileTab] = useState<'incidents' | 'units'>('incidents');

  const incidents = DEV_CRIMES;
  const officers = DEV_OFFICERS;

  const pendingCount = incidents.filter((i) => i.status === 'waiting' || i.status === 'dispatched').length;
  const availableOfficers = officers.filter((o) => o.dutyStatus === 'on_duty');

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans text-xs select-text">
      {/* CAD Header Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            CAD Terminal 04 — Active
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-500 hidden sm:inline">
            Primary Channel: <span className="font-medium text-slate-700">TAC-1</span>
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-xs">
          <span className="text-slate-600">
            Pending Calls: <strong className="text-amber-700 font-mono font-semibold">{pendingCount}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">
            Units Available: <strong className="text-emerald-700 font-mono font-semibold">{availableOfficers.length} / {officers.length}</strong>
          </span>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      {isMobile && (
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setMobileTab('incidents')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition ${
              mobileTab === 'incidents'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Incidents ({incidents.length})
          </button>
          <button
            onClick={() => setMobileTab('units')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition ${
              mobileTab === 'units'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Patrol Units ({availableOfficers.length})
          </button>
        </div>
      )}

      {/* Main CAD Split View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-100/50">
        {/* Left: Active Incidents Queue */}
        {(!isMobile || mobileTab === 'incidents') && (
          <div className="md:col-span-7 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-500" />
                Active 911 Incidents
              </span>
              <span className="text-[11px] text-slate-500 font-sans">Live CAD Dispatch Queue</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {incidents.map((incident) => {
                const typeDef = getCrimeTypeDefinition(incident.crimeTypeId);
                const assignedNames = incident.assignedOfficerIds
                  .map((id) => {
                    const officer = officers.find((o) => o.id === id);
                    return officer ? getOfficerShortName(officer) : id;
                  })
                  .join(', ');

                const isCritical = incident.priority === 'critical';
                const isHigh = incident.priority === 'high';
                const isMedium = incident.priority === 'medium';

                const borderStyle = isCritical
                  ? 'border-l-4 border-l-red-600 border border-red-200/80 bg-red-50/50'
                  : isHigh
                  ? 'border-l-4 border-l-amber-600 border border-amber-200/80 bg-amber-50/40'
                  : isMedium
                  ? 'border-l-4 border-l-amber-500 border border-amber-200/70 bg-amber-50/20'
                  : 'border-l-4 border-l-slate-300 border border-slate-200 bg-slate-50/80';

                const badgeStyle = isCritical
                  ? 'bg-red-600 text-white'
                  : isHigh
                  ? 'bg-amber-600 text-white'
                  : isMedium
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-400 text-white';

                return (
                  <div
                    key={incident.id}
                    className={`p-3 rounded-r-md shadow-2xs transition hover:shadow-sm ${borderStyle}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold flex items-center gap-1.5 ${isCritical ? 'text-red-700' : 'text-slate-900'}`}>
                        <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${badgeStyle}`}>
                          {incident.priority}
                        </span>
                        {typeDef.cadRadioCode} — {incident.title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {incident.cadNumber}
                      </span>
                    </div>

                    <div className="text-slate-900 font-medium text-xs mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {incident.location.address} {incident.location.venueName ? `(${incident.location.venueName})` : ''}
                    </div>

                    <p className="text-slate-600 text-[11px] mt-1 pl-4">
                      {incident.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 font-sans">
                        {incident.location.sector} • Status: <strong className="capitalize text-slate-700">{incident.status.replace('_', ' ')}</strong>
                      </span>
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono font-medium border border-blue-200">
                        {assignedNames ? `Assigned: ${assignedNames}` : 'Unassigned (Queued)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right: Unit Availability Board */}
        {(!isMobile || mobileTab === 'units') && (
          <div className="md:col-span-5 flex flex-col overflow-hidden bg-slate-50">
            <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-700" />
                Patrol Unit Status
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">{availableOfficers.length} Available</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {officers.map((officer) => {
                const shortName = getOfficerShortName(officer);
                const isAssigned = incidents.some((inc) => inc.assignedOfficerIds.includes(officer.id));

                const statusLabel = isAssigned ? 'On Scene' : officer.dutyStatus === 'on_duty' ? 'Available' : 'On Call';
                const statusCode = isAssigned ? '10-97' : officer.dutyStatus === 'on_duty' ? '10-8' : '10-7';
                const badgeClass = isAssigned
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : officer.dutyStatus === 'on_duty'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200';

                return (
                  <div
                    key={officer.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-md hover:border-slate-300 transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-800 text-xs">
                          {officer.callsign || `UNIT #${officer.badgeNumber}`}
                        </span>
                        <span className="text-slate-800 font-medium text-xs">{shortName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 capitalize">{officer.divisionId.replace('_', ' ')} • {officer.shift.replace('_', ' ')}</div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeClass}`}>
                      {statusLabel} <span className="font-mono font-normal opacity-80 text-[10px]">({statusCode})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Command Input Bar */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <span className="text-slate-400 font-mono font-semibold text-xs pl-1">CAD&gt;</span>
        <input 
          type="text" 
          placeholder="Enter unit or dispatch command (e.g. 401 10-8)..." 
          disabled
          className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none placeholder:text-slate-400"
        />
        <button disabled className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 text-xs rounded font-medium opacity-70">
          Execute
        </button>
      </div>
    </div>
  );
};
