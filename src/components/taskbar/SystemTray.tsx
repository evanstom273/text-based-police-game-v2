import React, { useState, useEffect } from 'react';
import { Wifi, Volume2, ShieldCheck } from 'lucide-react';

export const SystemTray: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      const options: Intl.DateTimeFormatOptions = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      };
      setDateStr(now.toLocaleDateString('en-US', options).toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2.5 text-slate-300 font-sans text-xs select-none">
      {/* CAD Network Status */}
      <div 
        title="Secure Department CAD Network"
        className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <Wifi className="w-3 h-3 text-emerald-400" />
        <span className="text-slate-200 font-bold">CAD-NET</span>
      </div>

      {/* Threat Level */}
      <div 
        title="Precinct Threat Assessment Level"
        className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/70 border border-sky-800/60 text-[10px]"
      >
        <ShieldCheck className="w-3 h-3 text-sky-400" />
        <span className="text-sky-300 font-semibold">THREAT: NORMAL</span>
      </div>

      {/* Shift Indicator */}
      <div 
        title="Station Shift: Shift 2 (Night)"
        className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium"
      >
        <span>SHIFT 2</span>
      </div>

      {/* Audio / Radio Comm Volume */}
      <button 
        title="Radio Audio Level: 100%"
        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
      >
        <Volume2 className="w-3.5 h-3.5" />
      </button>

      {/* System Clock & Date */}
      <div className="flex flex-col items-end px-2 py-0.5 bg-slate-900 border border-slate-800 rounded leading-tight">
        <span className="font-bold text-slate-100 tracking-tight font-mono text-[11px]">{timeStr || '00:00:00'}</span>
        <span className="text-[9px] text-slate-400 font-sans font-medium">{dateStr || '18 AUG 2026'}</span>
      </div>
    </div>
  );
};
