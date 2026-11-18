import React, { useState, useEffect } from 'react';

interface ColdStartAlertProps {
  isLoading: boolean;
  delayMs?: number;
  message?: string;
}

const DEFAULT_DELAY_MS = Number(import.meta.env.VITE_COLD_START_DELAY_MS) || 3000;
const DEFAULT_MESSAGE =
  import.meta.env.VITE_COLD_START_MESSAGE ||
  'Server is waking up, this may take a moment on initial startup...';

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
    <div
      role="status"
      aria-live="polite"
      className="mb-6 flex items-center justify-center gap-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/25 px-4 py-2.5 text-xs font-medium text-amber-800 dark:text-amber-300 shadow-xs transition-all duration-200"
    >
      <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-amber-600/30 border-t-amber-600 dark:border-amber-400/30 dark:border-t-amber-400" />
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
