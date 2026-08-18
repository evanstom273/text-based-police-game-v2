import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { StartMenu } from './StartMenu';
import { SystemTray } from './SystemTray';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { Shield } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { windows, toggleMinimizeWindow } = useWindowManager();

  return (
    <>
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
      />

      <header
        className="fixed bottom-0 left-0 right-0 h-11 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md z-[500] flex items-center justify-between px-2.5 select-none shadow-2xl text-slate-200"
      >
        {/* Left Side: Start Menu Button + Active Windows */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
          {/* Department Start Button */}
          <button
            id="start-menu-button"
            onClick={() => setIsStartMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-1 rounded font-sans font-bold text-xs transition border ${
              isStartMenuOpen
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-100 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span className="tracking-wide">PRECINCT 4</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0 mx-1"></div>

          {/* Open Applications Taskbar Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1">
            {windows.map((win) => {
              const isFocused = win.isFocused && win.state !== 'minimised';
              const isMinimised = win.state === 'minimised';

              return (
                <button
                  key={win.id}
                  onClick={() => toggleMinimizeWindow(win.id)}
                  title={`${win.title} (${isMinimised ? 'Minimised' : 'Active'})`}
                  className={`group relative flex items-center gap-2 px-2.5 py-1 rounded text-xs transition border max-w-[190px] shrink-0 ${
                    isFocused
                      ? 'bg-slate-900 text-white border-blue-500/80 shadow-md shadow-blue-500/10 font-semibold'
                      : isMinimised
                      ? 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200 opacity-75'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div
                    className={`w-4 h-4 flex items-center justify-center rounded shrink-0 ${
                      isFocused ? 'text-sky-400' : 'text-slate-400'
                    }`}
                  >
                    <AppIconRenderer name={win.icon} className="w-3.5 h-3.5" />
                  </div>

                  <span className="truncate text-[11px] text-left">
                    {win.title}
                  </span>

                  {/* Active Indicator Bar */}
                  <div
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-t transition-all ${
                      isFocused
                        ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                        : isMinimised
                        ? 'bg-slate-600'
                        : 'bg-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: System Tray */}
        <SystemTray />
      </header>
    </>
  );
};
