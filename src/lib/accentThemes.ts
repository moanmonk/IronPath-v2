import { AccentColorId } from '../types';

export interface AccentTheme {
  id: AccentColorId;
  name: string;
  hex: string;
  rgb: string;
  hoverHex: string;
  glowRgb: string;
  badgeBg: string;
  badgeText: string;
}

export const ACCENT_THEMES: Record<AccentColorId, AccentTheme> = {
  violet: {
    id: 'violet',
    name: 'Iron Violet',
    hex: '#a855f7',
    rgb: '168, 85, 247',
    hoverHex: '#9333ea',
    glowRgb: 'rgba(168, 85, 247, 0.25)',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeText: '#e9d5ff',
  },
  indigo: {
    id: 'indigo',
    name: 'Cobalt Blue',
    hex: '#6366f1',
    rgb: '99, 102, 241',
    hoverHex: '#4f46e5',
    glowRgb: 'rgba(99, 102, 241, 0.25)',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeText: '#c7d2fe',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Red',
    hex: '#ef4444',
    rgb: '239, 68, 68',
    hoverHex: '#dc2626',
    glowRgb: 'rgba(239, 68, 68, 0.25)',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    badgeText: '#fca5a5',
  },
  cyan: {
    id: 'cyan',
    name: 'Neon Cyan',
    hex: '#06b6d4',
    rgb: '6, 182, 212',
    hoverHex: '#0891b2',
    glowRgb: 'rgba(6, 182, 212, 0.25)',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeText: '#a5f3fc',
  },
  emerald: {
    id: 'emerald',
    name: 'Viper Green',
    hex: '#10b981',
    rgb: '16, 185, 129',
    hoverHex: '#059669',
    glowRgb: 'rgba(16, 185, 129, 0.25)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#a7f3d0',
  },
  amber: {
    id: 'amber',
    name: 'Electric Gold',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    hoverHex: '#d97706',
    glowRgb: 'rgba(245, 158, 11, 0.25)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeText: '#fde68a',
  },
  orange: {
    id: 'orange',
    name: 'Searing Flame',
    hex: '#f97316',
    rgb: '249, 115, 22',
    hoverHex: '#ea580c',
    glowRgb: 'rgba(249, 115, 22, 0.25)',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeText: '#ffedd5',
  },
};

export function applyAccentTheme(colorId: AccentColorId = 'violet') {
  const theme = ACCENT_THEMES[colorId] || ACCENT_THEMES.violet;
  const root = document.documentElement;

  root.style.setProperty('--brand-accent', theme.hex);
  root.style.setProperty('--brand-accent-hover', theme.hoverHex);
  root.style.setProperty('--brand-accent-rgb', theme.rgb);
  root.style.setProperty('--brand-accent-glow', theme.glowRgb);
  root.style.setProperty('--brand-accent-badge-bg', theme.badgeBg);
  root.style.setProperty('--brand-accent-badge-text', theme.badgeText);
}
