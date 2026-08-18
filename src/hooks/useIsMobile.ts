import { useState, useEffect } from 'react';

/**
 * Hook to detect narrow portrait mobile viewports vs foldable/tablet/desktop.
 * Uses 640px (Tailwind standard 'sm' breakpoint) so tablets (768px+) & foldables retain floating windows.
 */
export function useIsMobile(breakpoint: number = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
