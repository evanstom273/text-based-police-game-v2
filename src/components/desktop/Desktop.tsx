import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { DesktopIconGrid } from './DesktopIconGrid';
import { WindowFrame } from '../window/WindowFrame';
import { SnapOverlay } from '../window/SnapOverlay';
import { Taskbar } from '../taskbar/Taskbar';
import { Shield } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { windows, snapTarget } = useWindowManager();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-workstation-pattern select-none flex flex-col">
      {/* Background Police Department Watermark & Security Classification */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 opacity-25">
        {/* Top-Right Station ID Stamp */}
        <div className="self-end text-right font-mono text-[10px] text-slate-500 tracking-wider space-y-0.5">
          <div className="flex items-center justify-end gap-1 text-slate-400 font-bold">
            <Shield className="w-3 h-3 text-sky-500/60" />
            <span>METRO POLICE // DIVISION 4</span>
          </div>
          <div>TERMINAL ID: PC-CMD-04-A</div>
          <div>CLEARANCE LEVEL: COMMAND / CAPTAIN</div>
        </div>

        {/* Center Department Watermark Seal */}
        <div className="self-center flex flex-col items-center justify-center text-slate-600/30">
          <Shield className="w-40 h-40 stroke-[1]" />
          <span className="font-mono text-sm tracking-[0.3em] font-bold mt-2 text-slate-600/40">
            PRECINCT COMMAND WORKSTATION
          </span>
          <span className="font-mono text-[10px] tracking-widest text-slate-600/30 mt-0.5">
            PUBLIC SAFETY INFORMATION MANAGEMENT SYSTEM
          </span>
        </div>

        {/* Bottom-Left Government Notice */}
        <div className="font-mono text-[9px] text-slate-600 tracking-wider space-y-0.5">
          <div>RESTRICTED SYSTEM — FOR OFFICIAL LAW ENFORCEMENT USE ONLY</div>
          <div>UNAUTHORIZED ACCESS IS PROHIBITED UNDER MUNICIPAL CODE 18-A</div>
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

      {/* Window Snapping Hologram Preview */}
      <SnapOverlay snapTarget={snapTarget} />

      {/* Bottom Workstation Taskbar */}
      <Taskbar />
    </div>
  );
};
