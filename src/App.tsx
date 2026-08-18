import React, { useEffect } from 'react';
import { WindowManagerProvider, useWindowManager } from './context/WindowManagerContext';
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
    <WindowManagerProvider>
      <DesktopBootloader />
    </WindowManagerProvider>
  );
}

export default App;
