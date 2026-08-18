export interface UpdateStatusPayload {
  type: 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';
  version?: string;
  percent?: number;
  message?: string;
}

export interface ElectronAPI {
  checkForUpdates: () => void;
  restartAndInstall: () => void;
  onUpdateStatus: (callback: (status: UpdateStatusPayload) => void) => () => void;
  getAppVersion: () => Promise<string>;
  isElectron?: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
