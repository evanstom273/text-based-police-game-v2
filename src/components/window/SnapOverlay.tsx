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
          className="absolute top-2 bottom-14 left-2 w-[calc(50vw-12px)] bg-blue-500/10 border-2 border-blue-600/70 rounded-lg backdrop-blur-[1px] shadow-[0_4px_20px_rgba(37,99,235,0.15)] flex items-center justify-center animate-fadeIn"
        >
          <div className="px-3 py-1.5 bg-white/95 border border-blue-300 shadow-sm rounded font-sans text-xs text-blue-800 font-semibold uppercase tracking-wide">
            Snap Left [50%]
          </div>
        </div>
      )}

      {snapTarget === 'right' && (
        <div 
          className="absolute top-2 bottom-14 right-2 w-[calc(50vw-12px)] bg-blue-500/10 border-2 border-blue-600/70 rounded-lg backdrop-blur-[1px] shadow-[0_4px_20px_rgba(37,99,235,0.15)] flex items-center justify-center animate-fadeIn"
        >
          <div className="px-3 py-1.5 bg-white/95 border border-blue-300 shadow-sm rounded font-sans text-xs text-blue-800 font-semibold uppercase tracking-wide">
            Snap Right [50%]
          </div>
        </div>
      )}

      {snapTarget === 'top' && (
        <div 
          className="absolute top-2 bottom-14 left-2 right-2 bg-blue-500/10 border-2 border-blue-600/70 rounded-lg backdrop-blur-[1px] shadow-[0_4px_20px_rgba(37,99,235,0.15)] flex items-center justify-center animate-fadeIn"
        >
          <div className="px-3 py-1.5 bg-white/95 border border-blue-300 shadow-sm rounded font-sans text-xs text-blue-800 font-semibold uppercase tracking-wide">
            Maximize Screen [100%]
          </div>
        </div>
      )}
    </div>
  );
};
