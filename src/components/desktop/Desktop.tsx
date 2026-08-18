import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { DesktopIconGrid } from './DesktopIconGrid';
import { WindowFrame } from '../window/WindowFrame';
import { SnapOverlay } from '../window/SnapOverlay';
import { Taskbar } from '../taskbar/Taskbar';
import { UpdateNotifier } from '../common/UpdateNotifier';
import { Shield } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { windows, snapTarget } = useWindowManager();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-workstation-pattern select-none flex flex-col text-slate-100">
      {/* Background Police Department Watermark & Security Classification */}
      <UpdateNotifier />

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none">
        {/* Top-Right Station ID Stamp */}
        <div className="self-end text-right font-mono text-[11px] text-slate-400/80 tracking-wider space-y-0.5">
          <div className="flex items-center justify-end gap-1.5 text-sky-400 font-semibold text-xs">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>METROPOLITAN POLICE // 4TH PRECINCT</span>
          </div>
          <div className="text-slate-400">COMMAND WORKSTATION: WS-04-A</div>
        </div>

        {/* Center Department Watermark Seal */}
        <div className="self-center flex flex-col items-center justify-center text-slate-400/15 pointer-events-none">
          <div className="relative flex items-center justify-center mb-3">
            <Shield className="w-48 h-48 stroke-[1]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-2xl font-black tracking-widest text-slate-400/25">MPD</span>
            </div>
          </div>
          <span className="font-sans text-sm tracking-[0.3em] font-bold text-slate-400/30 uppercase">
            Metropolitan Police Department
          </span>
          <span className="font-mono text-[10px] tracking-widest text-slate-400/25 mt-1">
            PUBLIC SAFETY INFORMATION SYSTEM
          </span>
        </div>

        {/* Bottom-Left Government Notice */}
        <div className="font-sans text-[11px] text-slate-400/60 tracking-normal">
          Authorized Command Terminal — Restricted Access
        </div>
      </div>

      {/* Desktop Icons Grid */}
      <DesktopIconGrid />

      {/* Application Windows */}
      <div className="absolute inset-0 pointer-events-none">
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
            <WindowFrame window={win} />
          </div>
        ))}
      </div>

      {/* Window Snapping Preview */}
      <SnapOverlay snapTarget={snapTarget} />

      {/* Bottom Workstation Taskbar */}
      <Taskbar />
    </div>
  );
};
