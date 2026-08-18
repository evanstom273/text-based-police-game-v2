import React from 'react';

export const BudgetApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-white text-slate-900 text-xs font-sans select-text overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Top Ledger Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            FY2026 Q3 Remaining Balance
          </span>
          <span className="text-xl font-bold font-mono text-emerald-700">$612,450.00</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Allocated: $1,850,000.00</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Monthly Overtime Expenditure
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-amber-800">$48,200.00</span>
            <span className="text-[11px] font-medium text-amber-700">88% of Cap</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cycle resets in 12 days</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Fleet & Tactical Reserve
          </span>
          <span className="text-xl font-bold font-mono text-blue-700">$84,000.00</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Maintenance & requisitions</span>
        </div>
      </div>

      {/* Expense Allocation Table */}
      <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg">
        <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-200">
          <span className="font-semibold text-slate-800 text-xs uppercase tracking-wide">
            Department Expenditure Allocation
          </span>
          <span className="text-slate-500 text-[11px]">Municipal Financial System</span>
        </div>

        <div className="space-y-3">
          {[
            { category: 'Officer Base Salaries & Hazard Pay', spent: '$780,000', total: '$1,100,000', pct: 70, color: 'bg-blue-600' },
            { category: 'Overtime & Emergency Deployments', spent: '$144,600', total: '$165,000', pct: 87, color: 'bg-amber-500' },
            { category: 'Fleet Fuel & Vehicle Maintenance', spent: '$92,400', total: '$140,000', pct: 66, color: 'bg-indigo-600' },
            { category: 'Tactical Equipment & Ballistics Requisitions', spent: '$38,200', total: '$65,000', pct: 58, color: 'bg-emerald-600' },
            { category: 'Community Outreach & Youth Programs', spent: '$18,000', total: '$30,000', pct: 60, color: 'bg-purple-600' },
          ].map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-800 font-medium">{cat.category}</span>
                <span className="font-mono text-slate-600">
                  {cat.spent} / <span className="text-slate-400">{cat.total}</span> ({cat.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Requisition Orders */}
      <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg">
        <div className="flex justify-between items-center pb-2 mb-2.5 border-b border-slate-200">
          <span className="font-semibold text-slate-800 text-xs uppercase tracking-wide">
            Pending Requisitions & Grants
          </span>
          <span className="text-emerald-700 text-[11px] font-semibold">2 Pending Authorization</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md">
            <div>
              <div className="font-medium text-slate-900 text-xs">Requisition #REQ-4091: 6x Body-Camera Upgrades</div>
              <div className="text-slate-500 text-[11px]">Submitted by Tech Officer Chen | Amount: $7,200.00</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-medium text-[10px]">
              Pending Captain Approval
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md">
            <div>
              <div className="font-medium text-slate-900 text-xs">Grant #DOJ-26-88: High-Intensity Drug Trafficking Area (HIDTA) Aid</div>
              <div className="text-slate-500 text-[11px]">Federal Subvention Fund | Amount: +$45,000.00</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-medium text-[10px]">
              City Auditor Review
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
