import React from 'react';
import { motion } from 'motion/react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentGradient?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentGradient = 'from-purple-500/10 to-transparent',
  className
}) => {
  return (
    <Card className={cn('p-5 flex flex-col justify-between relative group', className)}>
      {/* Background Accent Glow */}
      <div className={cn('absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity group-hover:opacity-100 pointer-events-none', accentGradient)} />
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</span>
        {icon && (
          <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-indigo-400">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 flex items-baseline gap-2">
          {value}
          {trend && (
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full border",
              trend.isPositive 
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                : "bg-red-500/15 text-red-400 border-red-500/30"
            )}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
