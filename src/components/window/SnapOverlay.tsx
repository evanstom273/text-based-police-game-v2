import React from 'react';
import type { SnapTarget } from '../../types';

interface SnapOverlayProps {
  snapTarget: SnapTarget;
}

export const SnapOverlay: React.FC<SnapOverlayProps> = ({ snapTarget }) => {
  if (snapTarget === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] transition-all duration-150 ease-out">
      {snapTarget === 'left' && (
        <div 
          className="absolute top-2 bottom-12 left-2 w-[calc(50vw-12px)] bg-sky-500/10 border-2 border-sky-400/80 rounded-lg backdrop-blur-[2px] shadow-[0_0_30px_rgba(56,189,248,0.25)] flex items-center justify-center animate-fadeIn"
        >
          <div className="px-3 py-1.5 bg-slate-950/80 border border-sky-400/60 rounded font-mono text-xs text-sky-300 font-bold uppercase tracking-wider">
            Snap Left [50%]
          </div>
        </div>
      )}

      {snapTarget === 'right' && (
        <div 
          className="absolute top-2 bottom-12 right-2 w-[calc(50vw-12px)] bg-sky-500/10 border-2 border-sky-400/80 rounded-lg backdrop-blur-[2px] shadow-[0_0_30px_rgba(56,189,248,0.25)] flex items-center justify-center animate-fadeIn"
        >
          <div className="px-3 py-1.5 bg-slate-950/80 border border-sky-400/60 rounded font-mono text-xs text-sky-300 font-bold uppercase tracking-wider">
            Snap Right [50%]
          </div>
        </div>
      )}

      {snapTarget === 'top' && (
        <div 
          className="absolute top-2 bottom-12 left-2 right-2 bg-sky-500/10 border-2 border-sky-400/80 rounded-lg backdrop-blur-[2px] shadow-[0_0_30px_rgba(56,189,248,0.25)] flex items-center justify-center animate-fadeIn"
        >
          <div className="px-3 py-1.5 bg-slate-950/80 border border-sky-400/60 rounded font-mono text-xs text-sky-300 font-bold uppercase tracking-wider">
            Maximize Screen [100%]
          </div>
        </div>
      )}
    </div>
  );
};
