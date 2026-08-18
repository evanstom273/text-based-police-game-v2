import React, { useState } from 'react';
import { Search, User, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export const CaseFilesApp: React.FC<{ windowId: string; appId: string }> = () => {
  const isMobile = useIsMobile(768);
  const [selectedCase, setSelectedCase] = useState<string>('26-0841');
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const cases = [
    {
      id: '26-0841',
      title: 'Homicide: Waterfront Warehouse Pier 14',
      lead: 'Det. E. Velez',
      status: 'Active',
      priority: 'High',
      date: '2026-08-14',
      type: 'Violent Crime',
      summary: 'Victim identified as local union rep. Found with gunshot wounds. Shell casings recovered: 9mm Luger. Ballistics match pending with IA database.',
      evidenceCount: 7,
      suspects: ['Marcus "Snake" Vance', 'V. Geller (Person of Interest)']
    },
    {
      id: '26-0799',
      title: 'Grand Larceny: Midtown Diamond Exchange',
      lead: 'Det. D. Sterling',
      status: 'Investigation',
      priority: 'Medium',
      date: '2026-08-09',
      type: 'Property Crime',
      summary: 'Alarm bypassed cleanly without trip. Safe opened via thermal lance. Estimated retail value $420,000 in uncut stones.',
      evidenceCount: 4,
      suspects: ['Unknown Crew (Professional)']
    },
    {
      id: '26-0752',
      title: 'Narcotics Ring: River District Distribution Hub',
      lead: 'Det. D. Sterling',
      status: 'Active',
      priority: 'High',
      date: '2026-07-28',
      type: 'Organized Crime',
      summary: 'Inter-state fentanyl trafficking syndicate. Surveillance ongoing on St. Jude trucking warehouse.',
      evidenceCount: 19,
      suspects: ['R. "Chemist" Thorne', 'Driver #4']
    },
    {
      id: '25-9921',
      title: 'Cold Case: 2025 Riverside Armored Van Ambush',
      lead: 'Unassigned',
      status: 'Cold',
      priority: 'Low',
      date: '2025-11-04',
      type: 'Robbery / Cold',
      summary: 'Guard killed during transport heist. Unresolved ballistics lead from state police.',
      evidenceCount: 12,
      suspects: ['Unidentified']
    }
  ];

  const current = cases.find(c => c.id === selectedCase) || cases[0];

  const handleSelectCase = (id: string) => {
    setSelectedCase(id);
    if (isMobile) {
      setMobileShowDetail(true);
    }
  };

  return (
    <div className="flex h-full bg-slate-50 text-slate-900 text-xs font-sans select-text">
      {/* Left List of Cases */}
      {(!isMobile || !mobileShowDetail) && (
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-3 border-b border-slate-200 bg-white flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search case #, victim, or lead..." 
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCase(c.id)}
                className={`p-3 cursor-pointer transition ${
                  selectedCase === c.id 
                    ? 'bg-blue-50/80 border-l-4 border-l-blue-600' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-800 text-xs">CASE #{c.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                    c.status === 'Active'
                      ? 'bg-red-50 text-red-800 border-red-200' 
                      : c.status === 'Cold' 
                      ? 'bg-slate-100 text-slate-600 border-slate-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h4 className="font-medium text-slate-900 line-clamp-1 mb-1">{c.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{c.lead}</span>
                  <span className="font-mono">{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Case Dossier Detail View */}
      {(!isMobile || mobileShowDetail) && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={() => setMobileShowDetail(false)}
                  className="p-1 rounded hover:bg-slate-200 text-slate-600 mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-700 font-bold text-xs">CASE #{current.id}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 font-medium text-xs">{current.type}</span>
                </div>
                <h2 className="text-sm font-semibold text-slate-900 mt-0.5">{current.title}</h2>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium text-xs shadow-2xs">
                Print Case
              </button>
              <button className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white rounded font-medium text-xs shadow-2xs">
                + Add Note
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Case Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-md">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block mb-1">
                  Lead Investigator
                </span>
                <span className="font-semibold text-slate-900">{current.lead}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-md">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block mb-1">
                  Date Filed
                </span>
                <span className="font-mono font-medium text-slate-800">{current.date}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-md">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block mb-1">
                  Evidence Log
                </span>
                <span className="font-medium text-blue-700">{current.evidenceCount} Items Cataloged</span>
              </div>
            </div>

            {/* Synopsis Section */}
            <div className="p-3.5 bg-slate-50/60 border border-slate-200/80 rounded-md space-y-1.5">
              <span className="text-xs font-semibold text-slate-800 block">Incident Synopsis</span>
              <p className="text-slate-700 leading-relaxed font-sans text-xs">{current.summary}</p>
            </div>

            {/* Suspects & Persons of Interest */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">Persons of Interest & Suspects</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.suspects.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-800 font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 font-sans flex justify-between">
            <span>Precinct Record Management System</span>
            <span>Record Status: Verified</span>
          </div>
        </div>
      )}
    </div>
  );
};
