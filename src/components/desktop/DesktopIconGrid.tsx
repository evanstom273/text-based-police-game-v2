import React, { useState, useRef } from 'react';
import type { DesktopIconItem } from '../../types';
import { APP_LIST } from '../../config/apps.config';
import { AppIconRenderer } from '../common/AppIconRenderer';
import { useWindowManager } from '../../context/WindowManagerContext';

const GRID_CELL_WIDTH = 96;
const GRID_CELL_HEIGHT = 100;
const PADDING_TOP = 20;
const PADDING_LEFT = 20;

export const DesktopIconGrid: React.FC = () => {
  const { openWindow } = useWindowManager();

  // Initialize icon positions from app list definitions
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
  } | null>(null);

  // Helper to find nearest available cell if occupied
  const getFreeCell = (targetCol: number, targetRow: number, currentIconId: string, currentIcons: DesktopIconItem[]) => {
    const occupied = new Set(
      currentIcons
        .filter((i) => i.id !== currentIconId)
        .map((i) => `${i.gridCol},${i.gridRow}`)
    );

    if (!occupied.has(`${targetCol},${targetRow}`)) {
      return { col: targetCol, row: targetRow };
    }

    // Find nearest free cell in adjacent rows/cols
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        if (!occupied.has(`${c},${r}`)) {
          return { col: c, row: r };
        }
      }
    }
    return { col: targetCol, row: targetRow };
  };

  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIconItem) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    setSelectedIconId(icon.id);

    dragStartPos.current = {
      iconId: icon.id,
      startX: e.clientX,
      startY: e.clientY,
      origCol: icon.gridCol,
      origRow: icon.gridRow,
      hasMoved: false,
    };

    const initialX = PADDING_LEFT + icon.gridCol * GRID_CELL_WIDTH;
    const initialY = PADDING_TOP + icon.gridRow * GRID_CELL_HEIGHT;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartPos.current) return;

      const deltaX = moveEvent.clientX - dragStartPos.current.startX;
      const deltaY = moveEvent.clientY - dragStartPos.current.startY;

      // Start drag threshold to avoid accidental micro-drags during click
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragStartPos.current.hasMoved = true;
        setDraggingIcon({
          id: icon.id,
          currentX: initialX + deltaX,
          currentY: initialY + deltaY,
        });
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
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

      dragStartPos.current = null;
      setDraggingIcon(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (appId: string) => {
    openWindow(appId);
  };

  return (
    <div
      onClick={() => setSelectedIconId(null)}
      className="absolute inset-0 bottom-12 overflow-hidden pointer-events-auto"
    >
      {icons.map((icon) => {
        const isDragging = draggingIcon?.id === icon.id;
        const isSelected = selectedIconId === icon.id;

        const posX = isDragging
          ? draggingIcon.currentX
          : PADDING_LEFT + icon.gridCol * GRID_CELL_WIDTH;
        const posY = isDragging
          ? draggingIcon.currentY
          : PADDING_TOP + icon.gridRow * GRID_CELL_HEIGHT;

        return (
          <div
            key={icon.id}
            onMouseDown={(e) => handleIconMouseDown(e, icon)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleDoubleClick(icon.appId);
            }}
            style={{
              position: 'absolute',
              transform: `translate3d(${posX}px, ${posY}px, 0)`,
              width: `${GRID_CELL_WIDTH - 8}px`,
              height: `${GRID_CELL_HEIGHT - 8}px`,
              zIndex: isDragging ? 50 : 10,
            }}
            className={`group flex flex-col items-center justify-center p-2 rounded-md transition-all cursor-pointer select-none ${
              isDragging ? 'opacity-80 scale-105 shadow-2xl' : ''
            } ${
              isSelected
                ? 'bg-sky-500/20 border border-sky-400/60 shadow-lg shadow-sky-500/10'
                : 'hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            {/* Badge Code Tag */}
            <div className="text-[9px] font-mono font-bold text-sky-400/80 bg-slate-950/80 border border-sky-900/50 px-1 py-0.2 rounded mb-1 tracking-tight">
              {icon.badgeCode}
            </div>

            {/* Icon Box */}
            <div
              className={`w-10 h-10 rounded flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-sky-600/30 text-sky-300 border border-sky-400/80 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 group-hover:border-slate-500 group-hover:text-white'
              }`}
            >
              <AppIconRenderer name={icon.icon} className="w-5 h-5" />
            </div>

            {/* App Title */}
            <span
              className={`mt-1.5 text-[11px] font-medium text-center leading-tight tracking-tight px-1 rounded line-clamp-2 ${
                isSelected
                  ? 'text-sky-200 font-semibold bg-slate-950/90'
                  : 'text-slate-300 group-hover:text-white'
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
