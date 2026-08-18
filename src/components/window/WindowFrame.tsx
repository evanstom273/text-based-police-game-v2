import React, { useRef } from 'react';
import type { WindowInstance, SnapTarget } from '../../types';
import { useWindowManager } from '../../context/WindowManagerContext';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { Minus, Square, Copy, X } from 'lucide-react';
import { getAppById } from '../../config/apps.config';
import { useIsMobile } from '../../hooks/useIsMobile';

interface WindowFrameProps {
  window: WindowInstance;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win }) => {
  const isMobile = useIsMobile(768);
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowRect,
    setWindowDragging,
    applySnap,
  } = useWindowManager();

  const appDef = getAppById(win.appId);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialRect: { x: number; y: number; width: number; height: number };
    currentSnapTarget: SnapTarget;
  } | null>(null);

  const resizeRef = useRef<{
    direction: string;
    startX: number;
    startY: number;
    initialRect: { x: number; y: number; width: number; height: number };
  } | null>(null);

  if (win.state === 'minimised') {
    return null;
  }

  const isMaximized = win.state === 'maximised' || isMobile;
  const isSnappedLeft = !isMobile && win.state === 'snapped-left';
  const isSnappedRight = !isMobile && win.state === 'snapped-right';
  const isFixedState = isMaximized || isSnappedLeft || isSnappedRight;

  // Handle Dragging using Pointer Events (touch & mouse)
  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (isMobile) return;
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;

    focusWindow(win.id);

    let startRect = { ...win.rect };

    if (isFixedState) {
      const normalWidth = win.previousRect?.width || win.minWidth || 800;
      const normalHeight = win.previousRect?.height || win.minHeight || 500;
      const newX = Math.max(10, Math.min(e.clientX - normalWidth / 2, window.innerWidth - normalWidth - 10));
      const newY = Math.max(10, Math.min(e.clientY - 15, window.innerHeight - normalHeight - 50));

      startRect = {
        x: newX,
        y: newY,
        width: normalWidth,
        height: normalHeight,
      };

      updateWindowRect(win.id, startRect);
      restoreWindow(win.id);
    }

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialRect: startRect,
      currentSnapTarget: 'none',
    };

    setWindowDragging(true, 'none');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current) return;

      const deltaX = moveEvent.clientX - dragRef.current.startX;
      const deltaY = moveEvent.clientY - dragRef.current.startY;

      const newX = dragRef.current.initialRect.x + deltaX;
      const newY = Math.max(0, dragRef.current.initialRect.y + deltaY);

      updateWindowRect(win.id, { x: newX, y: newY });

      let snap: SnapTarget = 'none';
      const snapThreshold = 25;

      if (moveEvent.clientY <= snapThreshold) {
        snap = 'top';
      } else if (moveEvent.clientX <= snapThreshold) {
        snap = 'left';
      } else if (moveEvent.clientX >= window.innerWidth - snapThreshold) {
        snap = 'right';
      }

      dragRef.current.currentSnapTarget = snap;
      setWindowDragging(true, snap);
    };

    const handlePointerUp = () => {
      if (dragRef.current) {
        const finalSnap = dragRef.current.currentSnapTarget;
        if (finalSnap !== 'none') {
          applySnap(win.id, finalSnap);
        }
      }
      dragRef.current = null;
      setWindowDragging(false, 'none');
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  };

  // Handle Resizing using Pointer Events
  const handleResizePointerDown = (direction: string, e: React.PointerEvent) => {
    if (e.button !== 0 || isFixedState || isMobile) return;
    e.stopPropagation();
    e.preventDefault();

    focusWindow(win.id);

    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initialRect: { ...win.rect },
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!resizeRef.current) return;

      const deltaX = moveEvent.clientX - resizeRef.current.startX;
      const deltaY = moveEvent.clientY - resizeRef.current.startY;
      const { initialRect, direction: dir } = resizeRef.current;

      let newWidth = initialRect.width;
      let newHeight = initialRect.height;
      let newX = initialRect.x;
      let newY = initialRect.y;

      const minW = win.minWidth || 400;
      const minH = win.minHeight || 300;

      if (dir.includes('e')) {
        newWidth = Math.max(minW, initialRect.width + deltaX);
      }
      if (dir.includes('s')) {
        newHeight = Math.max(minH, initialRect.height + deltaY);
      }
      if (dir.includes('w')) {
        const potentialWidth = initialRect.width - deltaX;
        if (potentialWidth >= minW) {
          newWidth = potentialWidth;
          newX = initialRect.x + deltaX;
        } else {
          newWidth = minW;
          newX = initialRect.x + (initialRect.width - minW);
        }
      }
      if (dir.includes('n')) {
        const potentialHeight = initialRect.height - deltaY;
        if (potentialHeight >= minH) {
          newHeight = potentialHeight;
          newY = Math.max(0, initialRect.y + deltaY);
        } else {
          newHeight = minH;
          newY = initialRect.y + (initialRect.height - minH);
        }
      }

      updateWindowRect(win.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    };

    const handlePointerUp = () => {
      resizeRef.current = null;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  };

  let containerStyle: React.CSSProperties = {};

  if (isMobile) {
    containerStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 44,
      zIndex: win.zIndex,
      borderRadius: 0,
    };
  } else if (isMaximized) {
    containerStyle = {
      position: 'fixed',
      top: 4,
      left: 4,
      right: 4,
      bottom: 48,
      zIndex: win.zIndex,
    };
  } else if (isSnappedLeft) {
    containerStyle = {
      position: 'fixed',
      top: 4,
      left: 4,
      width: 'calc(50vw - 6px)',
      bottom: 48,
      zIndex: win.zIndex,
    };
  } else if (isSnappedRight) {
    containerStyle = {
      position: 'fixed',
      top: 4,
      right: 4,
      width: 'calc(50vw - 6px)',
      bottom: 48,
      zIndex: win.zIndex,
    };
  } else {
    containerStyle = {
      position: 'absolute',
      transform: `translate3d(${win.rect.x}px, ${win.rect.y}px, 0)`,
      width: `${win.rect.width}px`,
      height: `${win.rect.height}px`,
      zIndex: win.zIndex,
    };
  }

  const AppComponent = appDef?.component;

  return (
    <div
      style={containerStyle}
      onPointerDown={() => focusWindow(win.id)}
      className={`flex flex-col bg-white text-slate-900 transition-shadow duration-150 overflow-hidden ${
        isMobile
          ? 'border-b border-slate-300'
          : `rounded-lg border ${
              win.isFocused
                ? 'window-shadow-focused border-blue-500 ring-1 ring-blue-500/40'
                : 'window-shadow border-slate-700/80'
            }`
      }`}
    >
      {/* High-Contrast Distinct Window Header Bar */}
      <div
        onPointerDown={handleHeaderPointerDown}
        onDoubleClick={() => !isMobile && (isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id))}
        className={`flex items-center justify-between px-3.5 py-2 select-none border-b transition-colors ${
          isMobile ? 'cursor-default' : 'cursor-move'
        } ${
          win.isFocused
            ? 'bg-slate-950 text-white border-slate-800'
            : 'bg-slate-900 text-slate-300 border-slate-800/90'
        }`}
      >
        {/* Title & App Identity */}
        <div className="flex items-center gap-2.5 overflow-hidden pr-2">
          <div
            className={`p-1 rounded ${
              win.isFocused ? 'bg-blue-900/70 text-sky-300 border border-blue-600/60' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <AppIconRenderer name={win.icon} className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-baseline gap-2 truncate">
            {appDef?.badgeCode && (
              <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950/90 border border-sky-800/70 px-1.5 py-0.2 rounded shadow-2xs">
                [{appDef.badgeCode}]
              </span>
            )}
            <span className="font-semibold text-xs text-white truncate">{win.title}</span>
            {appDef?.subtitle && !isMobile && (
              <span className="text-[11px] text-slate-400 truncate hidden sm:inline">— {appDef.subtitle}</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(win.id)}
            title="Minimize"
            className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {!isMobile && (
            <button
              onClick={() => (isFixedState ? restoreWindow(win.id) : maximizeWindow(win.id))}
              title={isFixedState ? 'Restore' : 'Maximize'}
              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {isFixedState ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={() => closeWindow(win.id)}
            title="Close"
            className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-700 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clean, High-Legibility Light Application Content Area */}
      <div className="flex-1 overflow-hidden relative bg-white text-slate-900">
        {AppComponent ? (
          <AppComponent windowId={win.id} appId={win.appId} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-mono text-xs">
            APPLICATION MODULE NOT LOADED
          </div>
        )}
      </div>

      {/* 8-Directional Resize Handles (Desktop Only) */}
      {!isFixedState && !isMobile && (
        <>
          <div
            onPointerDown={(e) => handleResizePointerDown('n', e)}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('s', e)}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('e', e)}
            className="absolute right-0 top-2 bottom-2 w-1.5 cursor-ew-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('w', e)}
            className="absolute left-0 top-2 bottom-2 w-1.5 cursor-ew-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('nw', e)}
            className="absolute top-0 left-0 w-2.5 h-2.5 cursor-nwse-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('ne', e)}
            className="absolute top-0 right-0 w-2.5 h-2.5 cursor-nesw-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('sw', e)}
            className="absolute bottom-0 left-0 w-2.5 h-2.5 cursor-nesw-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown('se', e)}
            className="absolute bottom-0 right-0 w-2.5 h-2.5 cursor-nwse-resize z-20"
          />
        </>
      )}
    </div>
  );
};
