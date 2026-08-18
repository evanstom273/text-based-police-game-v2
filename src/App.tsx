import React, { useEffect } from 'react';
import { WindowManagerProvider, useWindowManager } from './context/WindowManagerContext';
import { AIProvider } from './context/AIContext';
import { Desktop } from './components/desktop/Desktop';

const DesktopBootloader: React.FC = () => {
  const { openWindow } = useWindowManager();

  // Open Dispatch / CAD as default initial application on first launch
  useEffect(() => {
    openWindow('dispatch');
  }, [openWindow]);

  return <Desktop />;
};

export function App() {
  return (
    <AIProvider>
      <WindowManagerProvider>
        <DesktopBootloader />
      </WindowManagerProvider>
    </AIProvider>
  );
}

export default App;
