import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'interactive' | 'outline' | 'glow';
  glowColor?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  glowColor = 'rgba(168, 85, 247, 0.15)', // subtle purple glow
  className,
  children,
  ...props
}) => {
  const baseStyles = "relative rounded-[28px] overflow-hidden transition-all duration-300";

  const variants = {
    glass: "bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/50 shadow-xl",
    solid: "bg-zinc-900 border border-zinc-800/80 shadow-md",
    interactive: "bg-zinc-900/90 border border-zinc-800/80 hover:border-indigo-500/40 hover:shadow-2xl cursor-pointer active:scale-[0.99]",
    outline: "bg-transparent border border-zinc-800/80",
    glow: "bg-gradient-to-br from-indigo-600/20 to-zinc-900 border border-indigo-500/30 shadow-2xl rounded-[32px]"
  };

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], className)}
      style={variant === 'glow' ? { boxShadow: `0 0 25px ${glowColor}` } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};
