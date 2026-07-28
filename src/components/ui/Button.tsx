import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber' | 'emerald' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.97]";

  const sizeStyles = {
    sm: "text-xs px-3 py-2 gap-1.5 rounded-lg min-h-[44px]",
    md: "text-sm px-4 py-2.5 gap-2 min-h-[44px]",
    lg: "text-base px-6 py-3.5 gap-2.5 rounded-2xl font-semibold min-h-[48px]",
    icon: "p-2.5 rounded-xl text-sm min-h-[44px] min-w-[44px]"
  };

  const variantStyles = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-xl shadow-emerald-500/20",
    purple: "bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-xl shadow-purple-600/20",
    amber: "bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25",
    emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25",
    secondary: "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 backdrop-blur-md",
    ghost: "bg-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100",
    danger: "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="inline-flex shrink-0">{leftIcon}</span>
      ) : null}
      {children && <span className="whitespace-nowrap">{children}</span>}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
