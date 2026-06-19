import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  textColor?: string;
  borderColor?: string;
  bgColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  textColor = 'text-zinc-900 dark:text-white',
  borderColor = 'border-zinc-200 dark:border-zinc-800',
  bgColor = 'bg-white dark:bg-zinc-900/50',
}) => {
  return (
    <div className={`rounded-2xl border transition-colors duration-200 ${borderColor} ${bgColor} p-6 backdrop-blur-xl`}>
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
    </div>
  );
};

export default SummaryCard;
