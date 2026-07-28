import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'amber' | 'emerald' | 'blue' | 'purple' | 'zinc' | 'danger' | 'tier' | 'rose';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'purple',
  children,
  className
}) => {
  const variantStyles = {
    amber: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    zinc: "bg-zinc-800/80 text-zinc-300 border-zinc-700/50",
    danger: "bg-red-500/15 text-red-400 border-red-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    tier: "bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide whitespace-nowrap",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
};
