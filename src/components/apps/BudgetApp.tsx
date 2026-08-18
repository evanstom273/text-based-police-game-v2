import React from 'react';

export const BudgetApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 text-xs select-text overflow-y-auto p-4 space-y-4">
      {/* Top Ledger Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            FY2026 Q3 Remaining Balance
          </span>
          <span className="text-xl font-mono font-bold text-emerald-400">$612,450.00</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Allocated: $1,850,000.00</span>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Monthly Overtime Burn Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-amber-400">$48,200.00</span>
            <span className="text-[11px] font-mono text-amber-400">88% of Cap</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Overtime cap resets in 12 days</span>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Fleet & Tactical Contingency
          </span>
          <span className="text-xl font-mono font-bold text-sky-400">$84,000.00</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Cruiser repairs + ammunition reserves</span>
        </div>
      </div>

      {/* Expense Allocation Table */}
      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded">
        <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-800 font-mono text-[11px]">
          <span className="font-semibold text-slate-200 uppercase">Department Expenditure Breakdown</span>
          <span className="text-slate-400">MUNICIPAL FISCAL SYSTEM</span>
        </div>

        <div className="space-y-3">
          {[
            { category: 'Officer Base Salaries & Hazard Pay', spent: '$780,000', total: '$1,100,000', pct: 70, color: 'bg-sky-500' },
            { category: 'Overtime & Emergency Deployments', spent: '$144,600', total: '$165,000', pct: 87, color: 'bg-amber-500' },
            { category: 'Fleet Fuel & Vehicle Maintenance', spent: '$92,400', total: '$140,000', pct: 66, color: 'bg-indigo-500' },
            { category: 'Tactical Equipment & Ballistics Requisitions', spent: '$38,200', total: '$65,000', pct: 58, color: 'bg-emerald-500' },
            { category: 'Community Outreach & Youth Programs', spent: '$18,000', total: '$30,000', pct: 60, color: 'bg-purple-500' },
          ].map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-200 font-medium">{cat.category}</span>
                <span className="font-mono text-slate-400">
                  {cat.spent} / <span className="text-slate-500">{cat.total}</span> ({cat.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Requisition Orders */}
      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded">
        <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 font-mono text-[11px]">
          <span className="font-semibold text-slate-200 uppercase">Pending Requisitions & Grants</span>
          <span className="text-emerald-400 font-mono">2 Awaiting Approval</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-900/80 border border-slate-800 rounded text-[11px]">
            <div>
              <div className="font-semibold text-slate-200">Requisition #REQ-4091: 6x Axon Body-Cam 4 Upgrades</div>
              <div className="text-slate-400 text-[10px]">Submitted by: Tech Officer Chen | Amount: $7,200.00</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-400 font-mono font-bold text-[10px]">
              PENDING CAPTAIN APPROVAL
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-900/80 border border-slate-800 rounded text-[11px]">
            <div>
              <div className="font-semibold text-slate-200">Grant #DOJ-26-88: High-Intensity Drug Trafficking Area (HIDTA) Aid</div>
              <div className="text-slate-400 text-[10px]">Federal Subvention Fund | Amount: +$45,000.00</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 text-sky-400 font-mono font-bold text-[10px]">
              IN REVIEW (CITY AUDITOR)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
