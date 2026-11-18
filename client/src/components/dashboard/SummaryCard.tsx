import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon?: React.ReactNode;
  textColor?: string;
  borderColor?: string;
  bgColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtext,
  icon,
  textColor = 'text-slate-900 dark:text-white',
  borderColor = 'border-slate-200 dark:border-slate-800',
  bgColor = 'bg-white dark:bg-slate-900',
}) => {
  return (
    <div
      className={`rounded-xl border transition-colors duration-150 ${borderColor} ${bgColor} p-5 shadow-xs flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className={`text-3xl font-bold font-tabular tracking-tight ${textColor}`}>
          {value}
        </p>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
