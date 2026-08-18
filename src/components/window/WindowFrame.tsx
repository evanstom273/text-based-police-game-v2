import React, { useRef } from 'react';
import type { WindowInstance, SnapTarget } from '../../types';
import { useWindowManager } from '../../context/WindowManagerContext';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { Minus, Square, Copy, X } from 'lucide-react';
import { getAppById } from '../../config/apps.config';

interface WindowFrameProps {
  window: WindowInstance;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win }) => {
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

  // If minimised, do not render in the viewport
  if (win.state === 'minimised') {
    return null;
  }

  const isMaximized = win.state === 'maximised';
  const isSnappedLeft = win.state === 'snapped-left';
  const isSnappedRight = win.state === 'snapped-right';
  const isFixedState = isMaximized || isSnappedLeft || isSnappedRight;

  // Handle Dragging
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click and avoid button clicks
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;

    focusWindow(win.id);

    let startRect = { ...win.rect };

    // If window was maximised or snapped, revert to normal geometry centered under cursor
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

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = moveEvent.clientX - dragStartPosDelta(moveEvent.clientX);
      const deltaY = moveEvent.clientY - dragRef.current.startY;

      const newX = dragRef.current.initialRect.x + deltaX;
      const newY = Math.max(0, dragRef.current.initialRect.y + deltaY);

      updateWindowRect(win.id, { x: newX, y: newY });

      // Edge snapping detection
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

    function dragStartPosDelta(clientX: number) {
      return dragRef.current ? dragRef.current.startX : clientX;
    }

    const handleMouseUp = () => {
      if (dragRef.current) {
        const finalSnap = dragRef.current.currentSnapTarget;
        if (finalSnap !== 'none') {
          applySnap(win.id, finalSnap);
        }
      }
      dragRef.current = null;
      setWindowDragging(false, 'none');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Resizing
  const handleResizeMouseDown = (direction: string, e: React.MouseEvent) => {
    if (e.button !== 0 || isFixedState) return;
    e.stopPropagation();
    e.preventDefault();

    focusWindow(win.id);

    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initialRect: { ...win.rect },
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
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

    const handleMouseUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Compute position styling
  let containerStyle: React.CSSProperties = {};

  if (isMaximized) {
    containerStyle = {
      position: 'fixed',
      top: 4,
      left: 4,
      right: 4,
      bottom: 44, // above bottom taskbar
      zIndex: win.zIndex,
    };
  } else if (isSnappedLeft) {
    containerStyle = {
      position: 'fixed',
      top: 4,
      left: 4,
      width: 'calc(50vw - 6px)',
      bottom: 44,
      zIndex: win.zIndex,
    };
  } else if (isSnappedRight) {
    containerStyle = {
      position: 'fixed',
      top: 4,
      right: 4,
      width: 'calc(50vw - 6px)',
      bottom: 44,
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
      onMouseDown={() => focusWindow(win.id)}
      className={`flex flex-col rounded-md overflow-hidden bg-slate-900 transition-shadow duration-150 ${
        win.isFocused ? 'window-shadow-focused ring-1 ring-sky-500/60' : 'window-shadow ring-1 ring-slate-800'
      }`}
    >
      {/* Window Header Bar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => (isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id))}
        className={`flex items-center justify-between px-3 py-1.5 cursor-move select-none border-b transition-colors ${
          win.isFocused
            ? 'bg-slate-950 text-slate-100 border-sky-900/60'
            : 'bg-slate-950/80 text-slate-400 border-slate-800'
        }`}
      >
        {/* Title Area */}
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <div
            className={`p-1 rounded ${
              win.isFocused ? 'bg-sky-950 text-sky-400 border border-sky-800/80' : 'bg-slate-900 text-slate-500'
            }`}
          >
            <AppIconRenderer name={win.icon} className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-baseline gap-2 truncate">
            {appDef?.badgeCode && (
              <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950/60 border border-sky-900 px-1 py-0.2 rounded">
                [{appDef.badgeCode}]
              </span>
            )}
            <span className="font-semibold text-xs text-slate-200 truncate">{win.title}</span>
            {appDef?.subtitle && (
              <span className="text-[11px] text-slate-500 truncate hidden sm:inline">— {appDef.subtitle}</span>
            )}
          </div>
        </div>

        {/* Action Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(win.id)}
            title="Minimize"
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => (isFixedState ? restoreWindow(win.id) : maximizeWindow(win.id))}
            title={isFixedState ? 'Restore' : 'Maximize'}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            {isFixedState ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          </button>

          <button
            onClick={() => closeWindow(win.id)}
            title="Close"
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-300 hover:bg-red-950/80 hover:border hover:border-red-800 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Application Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-900">
        {AppComponent ? (
          <AppComponent windowId={win.id} appId={win.appId} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
            APPLICATION MODULE NOT LOADED
          </div>
        )}
      </div>

      {/* 8-Directional Resize Handles (only active when not maximized or snapped) */}
      {!isFixedState && (
        <>
          {/* North */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('n', e)}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize z-20"
          />
          {/* South */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('s', e)}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize z-20"
          />
          {/* East */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('e', e)}
            className="absolute right-0 top-2 bottom-2 w-1.5 cursor-ew-resize z-20"
          />
          {/* West */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('w', e)}
            className="absolute left-0 top-2 bottom-2 w-1.5 cursor-ew-resize z-20"
          />
          {/* North-West */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('nw', e)}
            className="absolute top-0 left-0 w-2.5 h-2.5 cursor-nwse-resize z-20"
          />
          {/* North-East */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('ne', e)}
            className="absolute top-0 right-0 w-2.5 h-2.5 cursor-nesw-resize z-20"
          />
          {/* South-West */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('sw', e)}
            className="absolute bottom-0 left-0 w-2.5 h-2.5 cursor-nesw-resize z-20"
          />
          {/* South-East */}
          <div
            onMouseDown={(e) => handleResizeMouseDown('se', e)}
            className="absolute bottom-0 right-0 w-2.5 h-2.5 cursor-nwse-resize z-20"
          />
        </>
      )}
    </div>
  );
};
