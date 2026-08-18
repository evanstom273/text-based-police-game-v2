import React, { useState, useRef } from 'react';
import type { DesktopIconItem } from '../../types';
import { APP_LIST } from '../../config/apps.config';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const GRID_CELL_WIDTH = 104;
const GRID_CELL_HEIGHT = 112;
const PADDING_TOP = 24;
const PADDING_LEFT = 24;

export const DesktopIconGrid: React.FC = () => {
  const { openWindow } = useWindowManager();
  const isMobile = useIsMobile(768);

  const [icons, setIcons] = useState<DesktopIconItem[]>(() => {
    return APP_LIST.map((app) => ({
      id: `icon-${app.id}`,
      appId: app.id,
      title: app.name,
      badgeCode: app.badgeCode,
      icon: app.icon,
      gridCol: app.defaultGridPos.col,
      gridRow: app.defaultGridPos.row,
    }));
  });

  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const [draggingIcon, setDraggingIcon] = useState<{
    id: string;
    currentX: number;
    currentY: number;
  } | null>(null);

  const dragStartPos = useRef<{
    iconId: string;
    startX: number;
    startY: number;
    origCol: number;
    origRow: number;
    hasMoved: boolean;
    lastTapTime: number;
  } | null>(null);

  const getFreeCell = (targetCol: number, targetRow: number, currentIconId: string, currentIcons: DesktopIconItem[]) => {
    const occupied = new Set(
      currentIcons
        .filter((i) => i.id !== currentIconId)
        .map((i) => `${i.gridCol},${i.gridRow}`)
    );

    if (!occupied.has(`${targetCol},${targetRow}`)) {
      return { col: targetCol, row: targetRow };
    }

    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        if (!occupied.has(`${c},${r}`)) {
          return { col: c, row: r };
        }
      }
    }
    return { col: targetCol, row: targetRow };
  };

  const handleIconPointerDown = (e: React.PointerEvent, icon: DesktopIconItem) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const now = Date.now();
    const isDoubleTap = dragStartPos.current && dragStartPos.current.iconId === icon.id && (now - dragStartPos.current.lastTapTime < 350);

    if (isDoubleTap || isMobile) {
      openWindow(icon.appId);
      setSelectedIconId(icon.id);
      return;
    }

    setSelectedIconId(icon.id);

    dragStartPos.current = {
      iconId: icon.id,
      startX: e.clientX,
      startY: e.clientY,
      origCol: icon.gridCol,
      origRow: icon.gridRow,
      hasMoved: false,
      lastTapTime: now,
    };

    const initialX = PADDING_LEFT + icon.gridCol * GRID_CELL_WIDTH;
    const initialY = PADDING_TOP + icon.gridRow * GRID_CELL_HEIGHT;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartPos.current) return;

      const deltaX = moveEvent.clientX - dragStartPos.current.startX;
      const deltaY = moveEvent.clientY - dragStartPos.current.startY;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        dragStartPos.current.hasMoved = true;
        setDraggingIcon({
          id: icon.id,
          currentX: initialX + deltaX,
          currentY: initialY + deltaY,
        });
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      if (dragStartPos.current && dragStartPos.current.hasMoved) {
        const deltaX = upEvent.clientX - dragStartPos.current.startX;
        const deltaY = upEvent.clientY - dragStartPos.current.startY;

        const finalX = initialX + deltaX;
        const finalY = initialY + deltaY;

        const rawCol = Math.max(0, Math.round((finalX - PADDING_LEFT) / GRID_CELL_WIDTH));
        const rawRow = Math.max(0, Math.round((finalY - PADDING_TOP) / GRID_CELL_HEIGHT));

        setIcons((prev) => {
          const free = getFreeCell(rawCol, rawRow, icon.id, prev);
          return prev.map((item) =>
            item.id === icon.id
              ? { ...item, gridCol: free.col, gridRow: free.row }
              : item
          );
        });
      }

      setDraggingIcon(null);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  };

  const handleDoubleClick = (appId: string) => {
    openWindow(appId);
  };

  return (
    <div
      onClick={() => setSelectedIconId(null)}
      className="absolute inset-0 bottom-14 overflow-hidden pointer-events-auto select-none"
    >
      {icons.map((icon, index) => {
        const isDragging = draggingIcon?.id === icon.id;
        const isSelected = selectedIconId === icon.id;

        const col = isMobile ? index % 3 : icon.gridCol;
        const row = isMobile ? Math.floor(index / 3) : icon.gridRow;

        const posX = isDragging
          ? draggingIcon.currentX
          : PADDING_LEFT + col * (isMobile ? 104 : GRID_CELL_WIDTH);
        const posY = isDragging
          ? draggingIcon.currentY
          : PADDING_TOP + row * (isMobile ? 112 : GRID_CELL_HEIGHT);

        return (
          <div
            key={icon.id}
            onPointerDown={(e) => handleIconPointerDown(e, icon)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleClick(icon.appId);
            }}
            style={{
              position: 'absolute',
              transform: `translate3d(${posX}px, ${posY}px, 0)`,
              width: `${(isMobile ? 100 : GRID_CELL_WIDTH) - 6}px`,
              height: `${(isMobile ? 108 : GRID_CELL_HEIGHT) - 6}px`,
              zIndex: isDragging ? 50 : 10,
              touchAction: 'none',
            }}
            className={`group flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-pointer select-none ${
              isDragging ? 'opacity-75 scale-105 shadow-2xl' : ''
            } ${
              isSelected
                ? 'bg-blue-600/30 border border-sky-400 shadow-lg shadow-sky-500/20'
                : 'hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            {/* Subtle Badge Tag */}
            <div className="text-[9px] font-mono font-bold text-sky-300/90 bg-slate-900/90 border border-sky-900/60 px-1.5 py-0.2 rounded mb-1 shadow-sm">
              {icon.badgeCode}
            </div>

            {/* Icon Box */}
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-sky-300'
                  : 'bg-slate-900/80 text-sky-400 border border-slate-700/80 shadow-md group-hover:border-sky-500/70 group-hover:bg-slate-800 group-hover:text-white'
              }`}
            >
              <AppIconRenderer name={icon.icon} className="w-5 h-5" />
            </div>

            {/* App Title */}
            <span
              className={`mt-1.5 text-[11px] font-medium text-center leading-tight tracking-tight px-1 rounded line-clamp-2 icon-text-shadow ${
                isSelected
                  ? 'text-white font-bold bg-blue-950/80'
                  : 'text-slate-200 group-hover:text-white font-medium'
              }`}
            >
              {icon.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};
