import React, { useState, useEffect, useRef } from 'react';
import { APP_LIST } from '../../config/apps.config';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Shield, Search, Lock, RefreshCw, Power, Radio, Users, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowManager();
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        // If not clicking the start button itself
        if (!(e.target as HTMLElement).closest('#start-menu-button')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredApps = APP_LIST.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(APP_LIST.map((a) => a.category)));

  const handleLaunch = (appId: string) => {
    openWindow(appId);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute bottom-12 left-2 w-[440px] max-h-[560px] bg-slate-950/95 border border-sky-900/60 rounded-lg shadow-2xl backdrop-blur-md z-[1000] flex flex-col overflow-hidden text-slate-200 animate-fadeIn"
    >
      {/* Top Precinct Header Banner */}
      <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-sky-900/50 border border-sky-600/60 flex items-center justify-center text-sky-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] font-bold text-sky-400 tracking-wider">
              METRO POLICE DEPARTMENT
            </div>
            <div className="font-semibold text-xs text-white">4th Precinct Command OS</div>
          </div>
        </div>

        <div className="text-right font-mono text-[10px]">
          <div className="text-emerald-400 font-bold">STATION ONLINE</div>
          <div className="text-slate-400">LOGGED: CAPTAIN</div>
        </div>
      </div>

      {/* App Search Bar */}
      <div className="p-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search department applications, records, tools..."
          autoFocus
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 max-h-[360px]">
        {categories.map((cat) => {
          const appsInCat = filteredApps.filter((a) => a.category === cat);
          if (appsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                {cat}
              </div>
              <div className="space-y-1">
                {appsInCat.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunch(app.id)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-800/80 transition group text-left border border-transparent hover:border-slate-700/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:border-sky-700 transition">
                        <AppIconRenderer name={app.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-200 group-hover:text-white flex items-center gap-1.5">
                          {app.name}
                          <span className="text-[9px] font-mono text-sky-400/80 bg-sky-950/60 px-1 py-0.2 rounded border border-sky-900/60">
                            {app.badgeCode}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[280px]">
                          {app.subtitle || app.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Actions */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>RMS-v4.8 // 100% OPERATIONAL</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            title="Lock Workstation"
            className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-slate-300 font-mono"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            LOCK
          </button>
        </div>
      </div>
    </div>
  );
};
