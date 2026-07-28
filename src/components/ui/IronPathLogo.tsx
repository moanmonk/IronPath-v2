import React from 'react';

interface IronPathLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export const IronPathLogo: React.FC<IronPathLogoProps> = ({ 
  size = 'md', 
  showText = true,
  subtitle,
  className = ''
}) => {
  const containerClasses = {
    sm: 'w-9 h-9 p-2 rounded-xl',
    md: 'w-11 h-11 p-2.5 rounded-xl',
    lg: 'w-14 h-14 p-3 rounded-2xl'
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Clean, Bold Gym Dumbbell & Iron Plate Emblem without background glow */}
      <div 
        className={`${containerClasses[size]} bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 relative`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400 fill-current">
          {/* Heavy Steel Barbell Shaft */}
          <rect x="8" y="44" width="84" height="12" rx="4" fill="#e4e4e7" />
          
          {/* Outer Heavy 45lb Plate - Left */}
          <rect x="20" y="18" width="12" height="64" rx="4" fill="#a855f7" />
          {/* Inner Plate - Left */}
          <rect x="34" y="26" width="8" height="48" rx="3" fill="#6366f1" />
          
          {/* Outer Heavy 45lb Plate - Right */}
          <rect x="68" y="18" width="12" height="64" rx="4" fill="#a855f7" />
          {/* Inner Plate - Right */}
          <rect x="58" y="26" width="8" height="48" rx="3" fill="#6366f1" />
          
          {/* Center Precision Collar */}
          <circle cx="50" cy="50" r="10" fill="#09090b" stroke="#e4e4e7" strokeWidth="3" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-0.5">
            <span className={`font-black tracking-tight text-zinc-100 ${textClasses[size]} font-mono uppercase`}>
              IRON<span className="text-purple-400">PATH</span>
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block -mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
