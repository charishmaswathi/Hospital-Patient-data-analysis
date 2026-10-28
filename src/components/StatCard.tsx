import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconTextColor,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor} ${iconTextColor}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono tracking-tight mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-500 truncate">{subtitle}</div>
    </div>
  );
};
