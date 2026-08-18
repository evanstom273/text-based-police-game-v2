import React, { useState, useEffect, useRef } from 'react';
import { APP_LIST } from '../../config/apps.config';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Shield, Search, Lock, ChevronRight } from 'lucide-react';

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
      className="absolute bottom-12 left-2 w-[calc(100vw-16px)] sm:w-[420px] max-h-[540px] bg-slate-950/95 border border-slate-700/80 rounded-lg shadow-2xl backdrop-blur-md z-[1000] flex flex-col overflow-hidden text-slate-200 animate-fadeIn"
    >
      {/* Top Banner Header */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-blue-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-900/60 border border-blue-600/60 flex items-center justify-center text-sky-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-sans text-xs font-bold text-white tracking-tight">
              METROPOLITAN POLICE
            </div>
            <div className="font-sans text-[11px] text-sky-300/80">4th Precinct Command Workstation</div>
          </div>
        </div>

        <div className="text-right text-[10px]">
          <div className="text-emerald-400 font-bold flex items-center gap-1 justify-end font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CONNECTED
          </div>
          <div className="text-slate-400">COMMAND / CAPTAIN</div>
        </div>
      </div>

      {/* App Search Bar */}
      <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search applications, records, tools..."
          autoFocus
          className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5 max-h-[340px]">
        {categories.map((cat) => {
          const appsInCat = filteredApps.filter((a) => a.category === cat);
          if (appsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {cat}
              </div>
              <div className="space-y-0.5">
                {appsInCat.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunch(app.id)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-800/90 transition group text-left border border-transparent hover:border-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:border-sky-600 transition">
                        <AppIconRenderer name={app.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-200 group-hover:text-white flex items-center gap-1.5">
                          {app.name}
                          <span className="text-[9px] font-mono font-medium text-sky-400/90 bg-sky-950/80 px-1 py-0.2 rounded border border-sky-900/60">
                            {app.badgeCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[240px] sm:max-w-[280px]">
                          {app.subtitle || app.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Actions */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-sans text-[10px] text-slate-400">
          <span>Precinct RMS 4.8</span>
        </div>

        <button
          onClick={onClose}
          title="Lock Workstation"
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-medium transition"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          LOCK
        </button>
      </div>
    </div>
  );
};
