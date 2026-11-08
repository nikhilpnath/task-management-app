import React, { useState, useEffect } from 'react';

interface ColdStartAlertProps {
  isLoading: boolean;
  delayMs?: number;
  message?: string;
}

const DEFAULT_DELAY_MS = Number(import.meta.env.VITE_COLD_START_DELAY_MS) || 3000;
const DEFAULT_MESSAGE =
  import.meta.env.VITE_COLD_START_MESSAGE ||
  'Starting up server, this may take a moment on first load...';

const DelayedAlertContent: React.FC<{ delayMs: number; message: string }> = ({
  delayMs,
  message,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!visible) return null;

  return (
    <div className="my-3 flex items-center justify-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 px-4 py-2.5 text-xs text-zinc-600 dark:text-zinc-400 backdrop-blur-sm transition-all duration-300">
      <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-indigo-600/30 border-t-indigo-600 dark:border-indigo-400/30 dark:border-t-indigo-400" />
      <span>{message}</span>
    </div>
  );
};

export const ColdStartAlert: React.FC<ColdStartAlertProps> = ({
  isLoading,
  delayMs = DEFAULT_DELAY_MS,
  message = DEFAULT_MESSAGE,
}) => {
  if (!isLoading) return null;

  return <DelayedAlertContent delayMs={delayMs} message={message} />;
};

export default ColdStartAlert;
