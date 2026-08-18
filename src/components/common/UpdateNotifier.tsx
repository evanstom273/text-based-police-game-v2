import React, { useState, useEffect } from 'react';
import type { UpdateStatusPayload } from '../../types/electron';
import { DownloadCloud, RefreshCw, CheckCircle, AlertCircle, X, ShieldAlert } from 'lucide-react';

export const UpdateNotifier: React.FC = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatusPayload | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!window.electronAPI?.onUpdateStatus) return;

    const cleanup = window.electronAPI.onUpdateStatus((status) => {
      setUpdateStatus(status);
      if (status.type === 'available' || status.type === 'downloaded') {
        setDismissed(false);
      }
    });

    return () => cleanup();
  }, []);

  if (!updateStatus || dismissed || updateStatus.type === 'not-available') {
    return null;
  }

  const handleRestart = () => {
    if (window.electronAPI?.restartAndInstall) {
      window.electronAPI.restartAndInstall();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white border border-blue-400 rounded-lg p-3 shadow-lg backdrop-blur-md text-slate-800 font-sans text-xs select-none animate-fadeIn">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {updateStatus.type === 'downloaded' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : updateStatus.type === 'downloading' ? (
            <DownloadCloud className="w-4 h-4 text-blue-600 shrink-0 animate-bounce" />
          ) : updateStatus.type === 'available' ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 text-slate-500 shrink-0 animate-spin" />
          )}
          <span className="font-semibold text-xs text-slate-900 tracking-tight">
            {updateStatus.type === 'downloaded'
              ? 'System Update Ready'
              : updateStatus.type === 'downloading'
              ? 'Downloading Update'
              : updateStatus.type === 'available'
              ? 'New Update Available'
              : 'Checking for Updates'}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-[11px] text-slate-600 space-y-2">
        {updateStatus.type === 'available' && (
          <p>Version {updateStatus.version} is available. Downloading in background...</p>
        )}

        {updateStatus.type === 'downloading' && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Downloading files...</span>
              <span className="font-mono font-semibold text-blue-700">{updateStatus.percent || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${updateStatus.percent || 0}%` }}
              />
            </div>
          </div>
        )}

        {updateStatus.type === 'downloaded' && (
          <div className="space-y-2">
            <p className="text-slate-700">
              Version {updateStatus.version || ''} has been downloaded. Restart the workstation to apply changes.
            </p>
            <button
              onClick={handleRestart}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restart & Apply
            </button>
          </div>
        )}

        {updateStatus.type === 'error' && (
          <div className="text-red-600 text-[10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Update verification error. Will retry on next launch.</span>
          </div>
        )}
      </div>
    </div>
  );
};
