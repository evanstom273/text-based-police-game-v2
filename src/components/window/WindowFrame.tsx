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
  const isMobile = useIsMobile(640);
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
  const windowRef = useRef<HTMLDivElement>(null);

  // If minimised, do not render in the viewport
  if (win.state === 'minimised') {
    return null;
  }

  const isMaximized = win.state === 'maximised' || isMobile;
  const isSnappedLeft = !isMobile && win.state === 'snapped-left';
  const isSnappedRight = !isMobile && win.state === 'snapped-right';
  const isFixedState = isMaximized || isSnappedLeft || isSnappedRight;

  // Touch & Mouse Window Dragging with Pointer Capture and Zero React Re-render Lag
  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile) return;
    // Only primary button / single touch point
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;

    focusWindow(win.id);

    const dragHandle = e.currentTarget;
    try {
      dragHandle.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    let startRect = { ...win.rect };

    // If window was maximised or snapped, revert to normal geometry centered under pointer
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

      if (windowRef.current) {
        windowRef.current.style.width = `${normalWidth}px`;
        windowRef.current.style.height = `${normalHeight}px`;
        windowRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      }

      restoreWindow(win.id);
    }

    const startX = e.clientX;
    const startY = e.clientY;
    let currentX = startRect.x;
    let currentY = startRect.y;
    let currentSnap: SnapTarget = 'none';

    setWindowDragging(true, 'none');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      currentX = startRect.x + deltaX;
      currentY = Math.max(0, startRect.y + deltaY);

      // Direct DOM update for instantaneous 60-120fps tracking with no React re-rendering
      if (windowRef.current) {
        windowRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

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

      if (snap !== currentSnap) {
        currentSnap = snap;
        setWindowDragging(true, snap);
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        if (dragHandle.hasPointerCapture(upEvent.pointerId)) {
          dragHandle.releasePointerCapture(upEvent.pointerId);
        }
      } catch {
        // Safe fallback
      }

      dragHandle.removeEventListener('pointermove', handlePointerMove);
      dragHandle.removeEventListener('pointerup', handlePointerUp);
      dragHandle.removeEventListener('pointercancel', handlePointerUp);

      setWindowDragging(false, 'none');

      if (currentSnap !== 'none') {
        applySnap(win.id, currentSnap);
      } else {
        // Commit final coordinates to state
        updateWindowRect(win.id, { x: currentX, y: currentY });
      }
    };

    dragHandle.addEventListener('pointermove', handlePointerMove);
    dragHandle.addEventListener('pointerup', handlePointerUp);
    dragHandle.addEventListener('pointercancel', handlePointerUp);
  };

  // Direct Resizing with Pointer Capture
  const handleResizePointerDown = (direction: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isFixedState || isMobile) return;
    e.stopPropagation();
    e.preventDefault();

    focusWindow(win.id);

    const resizeHandle = e.currentTarget;
    try {
      resizeHandle.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialRect = { ...win.rect };

    let newWidth = initialRect.width;
    let newHeight = initialRect.height;
    let newX = initialRect.x;
    let newY = initialRect.y;

    const minW = win.minWidth || 400;
    const minH = win.minHeight || 300;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (direction.includes('e')) {
        newWidth = Math.max(minW, initialRect.width + deltaX);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(minH, initialRect.height + deltaY);
      }
      if (direction.includes('w')) {
        const potentialWidth = initialRect.width - deltaX;
        if (potentialWidth >= minW) {
          newWidth = potentialWidth;
          newX = initialRect.x + deltaX;
        } else {
          newWidth = minW;
          newX = initialRect.x + (initialRect.width - minW);
        }
      }
      if (direction.includes('n')) {
        const potentialHeight = initialRect.height - deltaY;
        if (potentialHeight >= minH) {
          newHeight = potentialHeight;
          newY = Math.max(0, initialRect.y + deltaY);
        } else {
          newHeight = minH;
          newY = initialRect.y + (initialRect.height - minH);
        }
      }

      if (windowRef.current) {
        windowRef.current.style.width = `${newWidth}px`;
        windowRef.current.style.height = `${newHeight}px`;
        windowRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        if (resizeHandle.hasPointerCapture(upEvent.pointerId)) {
          resizeHandle.releasePointerCapture(upEvent.pointerId);
        }
      } catch {
        // Safe fallback
      }

      resizeHandle.removeEventListener('pointermove', handlePointerMove);
      resizeHandle.removeEventListener('pointerup', handlePointerUp);
      resizeHandle.removeEventListener('pointercancel', handlePointerUp);

      updateWindowRect(win.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    };

    resizeHandle.addEventListener('pointermove', handlePointerMove);
    resizeHandle.addEventListener('pointerup', handlePointerUp);
    resizeHandle.addEventListener('pointercancel', handlePointerUp);
  };

  // Compute layout & position styling
  let containerStyle: React.CSSProperties = {};

  if (isMobile) {
    containerStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 44, // above taskbar
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
      ref={windowRef}
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
      {/* High-Contrast Window Header Bar (Draggable with touch-action: none) */}
      <div
        onPointerDown={handleHeaderPointerDown}
        onDoubleClick={() => !isMobile && (isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id))}
        style={{ touchAction: 'none' }}
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
      <div 
        style={{ touchAction: 'auto' }}
        className="flex-1 overflow-hidden relative bg-white text-slate-900"
      >
        {AppComponent ? (
          <AppComponent windowId={win.id} appId={win.appId} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-mono text-xs">
            APPLICATION MODULE NOT LOADED
          </div>
        )}
      </div>

      {/* 8-Directional Resize Handles (Desktop & Tablet Only) */}
      {!isFixedState && !isMobile && (
        <>
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('n', e)}
            className="absolute top-0 left-2 right-2 h-2 cursor-ns-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('s', e)}
            className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('e', e)}
            className="absolute right-0 top-2 bottom-2 w-2 cursor-ew-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('w', e)}
            className="absolute left-0 top-2 bottom-2 w-2 cursor-ew-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('nw', e)}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('ne', e)}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('sw', e)}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20"
          />
          <div
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => handleResizePointerDown('se', e)}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20"
          />
        </>
      )}
    </div>
  );
};
