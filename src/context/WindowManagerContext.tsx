import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { WindowInstance, WindowRect, WindowState, SnapTarget } from '../types';
import { getAppById } from '../config/apps.config';

interface WindowManagerContextType {
  windows: WindowInstance[];
  activeWindowId: string | null;
  snapTarget: SnapTarget;
  openWindow: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  toggleMinimizeWindow: (windowId: string) => void;
  updateWindowRect: (windowId: string, rect: Partial<WindowRect>) => void;
  setWindowDragging: (isDragging: boolean, target?: SnapTarget) => void;
  applySnap: (windowId: string, target: SnapTarget) => void;
  isAppOpen: (appId: string) => boolean;
  getOpenWindowByAppId: (appId: string) => WindowInstance | undefined;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [snapTarget, setSnapTarget] = useState<SnapTarget>('none');
  const zIndexCounter = useRef<number>(100);

  // Focus a window
  const focusWindow = useCallback((windowId: string) => {
    setActiveWindowId(windowId);
    zIndexCounter.current += 1;
    const newZ = zIndexCounter.current;

    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === windowId) {
          return {
            ...win,
            zIndex: newZ,
            isFocused: true,
            state: win.state === 'minimised' ? 'normal' : win.state,
          };
        }
        return {
          ...win,
          isFocused: false,
        };
      })
    );
  }, []);

  // Open an application window
  const openWindow = useCallback((appId: string) => {
    const appDef = getAppById(appId);
    if (!appDef) return;

    setWindows((prev) => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      // Check if this app window already exists
      const existing = prev.find((w) => w.appId === appId);
      if (existing) {
        zIndexCounter.current += 1;
        const newZ = zIndexCounter.current;
        setActiveWindowId(existing.id);

        return prev.map((w) => {
          if (w.id === existing.id) {
            return {
              ...w,
              state: isMobile ? 'maximised' : (w.state === 'minimised' ? 'normal' : w.state),
              zIndex: newZ,
              isFocused: true,
            };
          }
          return { ...w, isFocused: false };
        });
      }

      // Calculate initial cascading position
      const offset = (prev.length % 6) * 32;
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

      const initialWidth = Math.min(appDef.defaultSize.width, screenW - 60);
      const initialHeight = Math.min(appDef.defaultSize.height, screenH - 120);

      const initialX = Math.max(20, Math.min((screenW - initialWidth) / 2 + offset - 40, screenW - initialWidth - 20));
      const initialY = Math.max(30, Math.min((screenH - initialHeight) / 2 + offset - 40, screenH - initialHeight - 60));

      zIndexCounter.current += 1;
      const newZ = zIndexCounter.current;
      const windowId = `win-${appId}-${Date.now()}`;

      setActiveWindowId(windowId);

      const newWindow: WindowInstance = {
        id: windowId,
        appId: appDef.id,
        title: appDef.name,
        icon: appDef.icon,
        state: isMobile ? 'maximised' : 'normal',
        rect: {
          x: initialX,
          y: initialY,
          width: initialWidth,
          height: initialHeight,
        },
        zIndex: newZ,
        minWidth: appDef.minSize.width,
        minHeight: appDef.minSize.height,
        isFocused: true,
      };

      return [
        ...prev.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ];
    });
  }, []);

  // Close a window
  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== windowId);
      if (remaining.length === 0) {
        setActiveWindowId(null);
      } else {
        const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
        const top = sorted.find((w) => w.state !== 'minimised') || sorted[0];
        if (top) {
          setActiveWindowId(top.id);
          return remaining.map((w) => ({
            ...w,
            isFocused: w.id === top.id,
          }));
        }
      }
      return remaining;
    });
  }, []);

  // Minimize a window
  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const updated = prev.map((w) => {
        if (w.id === windowId) {
          return { ...w, state: 'minimised' as WindowState, isFocused: false };
        }
        return w;
      });

      const visible = updated.filter((w) => w.state !== 'minimised').sort((a, b) => b.zIndex - a.zIndex);
      if (visible.length > 0) {
        const top = visible[0];
        setActiveWindowId(top.id);
        return updated.map((w) => ({
          ...w,
          isFocused: w.id === top.id,
        }));
      } else {
        setActiveWindowId(null);
      }
      return updated;
    });
  }, []);

  // Maximize a window
  const maximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === windowId) {
          return {
            ...w,
            previousRect: w.state === 'normal' ? { ...w.rect } : w.previousRect,
            state: 'maximised' as WindowState,
          };
        }
        return w;
      })
    );
    focusWindow(windowId);
  }, [focusWindow]);

  // Restore a window to normal
  const restoreWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === windowId) {
          return {
            ...w,
            rect: w.previousRect ? { ...w.previousRect } : w.rect,
            state: 'normal' as WindowState,
          };
        }
        return w;
      })
    );
    focusWindow(windowId);
  }, [focusWindow]);

  // Toggle minimize / restore from taskbar
  const toggleMinimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const win = prev.find((w) => w.id === windowId);
      if (!win) return prev;

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      if (win.state === 'minimised') {
        zIndexCounter.current += 1;
        const newZ = zIndexCounter.current;
        setActiveWindowId(win.id);
        return prev.map((w) => ({
          ...w,
          state: (w.id === windowId) ? (isMobile ? 'maximised' : 'normal') : w.state,
          zIndex: w.id === windowId ? newZ : w.zIndex,
          isFocused: w.id === windowId,
        }));
      } else if (win.isFocused) {
        const updated = prev.map((w) => (w.id === windowId ? { ...w, state: 'minimised' as WindowState, isFocused: false } : w));
        const visible = updated.filter((w) => w.state !== 'minimised').sort((a, b) => b.zIndex - a.zIndex);
        if (visible.length > 0) {
          const top = visible[0];
          setActiveWindowId(top.id);
          return updated.map((w) => ({ ...w, isFocused: w.id === top.id }));
        } else {
          setActiveWindowId(null);
        }
        return updated;
      } else {
        zIndexCounter.current += 1;
        const newZ = zIndexCounter.current;
        setActiveWindowId(win.id);
        return prev.map((w) => ({
          ...w,
          state: (w.id === windowId && isMobile) ? 'maximised' : w.state,
          zIndex: w.id === windowId ? newZ : w.zIndex,
          isFocused: w.id === windowId,
        }));
      }
    });
  }, []);

  // Update window geometry during drag / resize
  const updateWindowRect = useCallback((windowId: string, newRect: Partial<WindowRect>) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === windowId) {
          return {
            ...w,
            rect: {
              ...w.rect,
              ...newRect,
            },
          };
        }
        return w;
      })
    );
  }, []);

  const setWindowDragging = useCallback((_isDragging: boolean, target: SnapTarget = 'none') => {
    setSnapTarget(target);
  }, []);

  // Apply snapping
  const applySnap = useCallback((windowId: string, target: SnapTarget) => {
    setSnapTarget('none');
    if (target === 'none') return;

    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== windowId) return w;

        const prevRect = (w.state === 'normal') ? { ...w.rect } : (w.previousRect || { ...w.rect });

        if (target === 'top') {
          return {
            ...w,
            previousRect: prevRect,
            state: 'maximised' as WindowState,
          };
        } else if (target === 'left') {
          return {
            ...w,
            previousRect: prevRect,
            state: 'snapped-left' as WindowState,
          };
        } else if (target === 'right') {
          return {
            ...w,
            previousRect: prevRect,
            state: 'snapped-right' as WindowState,
          };
        }
        return w;
      })
    );
    focusWindow(windowId);
  }, [focusWindow]);

  const isAppOpen = useCallback((appId: string) => {
    return windows.some((w) => w.appId === appId);
  }, [windows]);

  const getOpenWindowByAppId = useCallback((appId: string) => {
    return windows.find((w) => w.appId === appId);
  }, [windows]);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        snapTarget,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        toggleMinimizeWindow,
        updateWindowRect,
        setWindowDragging,
        applySnap,
        isAppOpen,
        getOpenWindowByAppId,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = (): WindowManagerContextType => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};
