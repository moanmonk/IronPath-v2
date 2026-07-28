import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Activity, 
  Sparkles, 
  Shield, 
  Wifi, 
  WifiOff, 
  ChevronRight, 
  Menu, 
  X,
  Flame,
  Zap
} from 'lucide-react';
import { useIronPathStore } from '../store/useIronPathStore';
import { NavigationTab, PhysiqueTargetId } from '../types';
import { PHYSIQUE_TARGET_CARDS } from '../data/mockData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RestTimerBanner } from '../components/ui/RestTimerBanner';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Card } from '../components/ui/Card';
import { IronPathLogo } from '../components/ui/IronPathLogo';

import { applyAccentTheme } from '../lib/accentThemes';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const activeTab = useIronPathStore((s) => s.activeTab);
  const setActiveTab = useIronPathStore((s) => s.setActiveTab);
  const userProfile = useIronPathStore((s) => s.userProfile);
  const setPhysiqueTarget = useIronPathStore((s) => s.setPhysiqueTarget);
  const updateUserProfile = useIronPathStore((s) => s.updateUserProfile);
  const isWorkoutInProgress = useIronPathStore((s) => s.isWorkoutInProgress);
  const isOffline = useIronPathStore((s) => s.isOffline);
  const lastSyncedAt = useIronPathStore((s) => s.lastSyncedAt);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPhysiqueModalOpen, setIsPhysiqueModalOpen] = useState(false);

  // Enforce stealth dark mode and apply selected accent color
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');

    applyAccentTheme(userProfile.accentColor || 'cyan');
  }, [userProfile.accentColor]);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'train', label: 'Train & Log', icon: <Dumbbell className="w-5 h-5" />, badge: isWorkoutInProgress ? 'LIVE' : undefined },
    { id: 'programs', label: 'Plans & Programs', icon: <Layers className="w-5 h-5" /> },
    { id: 'exercises', label: 'Exercise Library', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'progress', label: 'History & PRs', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> }
  ];

  const currentPhysique = PHYSIQUE_TARGET_CARDS.find((p) => p.id === userProfile.physiqueTarget) || PHYSIQUE_TARGET_CARDS[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-zinc-800/50 bg-[#0c0c0e] p-6 sticky top-0 h-screen justify-between z-30">
        <div>
          {/* IronPath Logo */}
          <div className="flex items-center justify-between mb-8 px-1">
            <IronPathLogo size="md" subtitle="Hypertrophy OS" />
            {isWorkoutInProgress && (
              <button
                onClick={() => setActiveTab('train')}
                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-red-600/30 active:scale-95 transition-all cursor-pointer shrink-0 animate-pulse"
                title="Go to Live Workout"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                <span>LIVE</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-accent-badge text-brand-accent border border-brand-accent-glow font-bold shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-brand-accent' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="rose" className="text-[10px] px-2 py-0.5 animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="mt-auto pt-4 border-t border-zinc-800/50">
          {/* Goal Physique */}
          <div 
            onClick={() => setIsPhysiqueModalOpen(true)}
            className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 mb-4 cursor-pointer hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Goal Physique</p>
              <Badge variant="emerald" className="text-[9px]">Target</Badge>
            </div>
            <p className="text-sm font-semibold text-zinc-100">{currentPhysique.name}</p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-purple-600 w-[64%] h-full shadow-emerald-500/20"></div>
            </div>
          </div>

          {/* Profile & Sync Info */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 rounded-full border border-brand-accent-glow flex items-center justify-center font-bold text-xs text-brand-accent">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate">{userProfile.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">{userProfile.experience}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3 flex items-center justify-between">
        <IronPathLogo size="sm" subtitle={currentPhysique.name} />

        <div className="flex items-center gap-2">
          {isWorkoutInProgress && (
            <button
              onClick={() => setActiveTab('train')}
              className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 active:scale-95 transition-all shrink-0 min-h-[36px] animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0" />
              <span>LIVE</span>
            </button>
          )}
          <button
            onClick={() => setIsPhysiqueModalOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-brand-accent-glow text-brand-accent text-xs font-bold min-h-[36px]"
          >
            Physique
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 lg:p-10 max-w-7xl mx-auto pb-28 md:pb-12 overflow-x-hidden sm:overflow-x-visible">
        {/* Top-Right Desktop LIVE Button if session is live */}
        {isWorkoutInProgress && (
          <div className="hidden md:flex justify-end mb-4">
            <button
              onClick={() => setActiveTab('train')}
              className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md shadow-red-600/30 active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>🔴 LIVE SESSION IN PROGRESS</span>
            </button>
          </div>
        )}
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-zinc-800/80 px-1 py-1.5 flex items-center justify-around">
        {[
          { id: 'train', label: 'Train', icon: <Dumbbell className="w-5 h-5" />, badge: isWorkoutInProgress },
          { id: 'programs', label: 'Plans', icon: <Layers className="w-5 h-5" /> },
          { id: 'exercises', label: 'Exercises', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'progress', label: 'History', icon: <TrendingUp className="w-5 h-5" /> },
          { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavigationTab)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-medium transition-all relative ${
                isActive ? (isWorkoutInProgress && item.id === 'train' ? 'text-red-500 font-extrabold scale-105' : 'text-brand-accent font-bold scale-105') : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-1 right-2 animate-ping shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile More Drawer Sheet */}
      <BottomSheet
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Navigation & Preferences"
        subtitle="Access programs, exercise library, hypertrophy insights, and app settings."
      >
        <div className="grid grid-cols-2 gap-3 py-2">
          {[
            { id: 'insights', label: 'Insights', icon: <Sparkles className="w-5 h-5 text-purple-400" />, desc: 'Volume & overload analytics' },
            { id: 'programs', label: 'Programs', icon: <Layers className="w-5 h-5 text-indigo-400" />, desc: 'Curated split templates' },
            { id: 'exercises', label: 'Exercises', icon: <BookOpen className="w-5 h-5 text-emerald-400" />, desc: 'Biomechanics library' },
            { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5 text-zinc-400" />, desc: 'Units & profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as NavigationTab);
                setIsMobileMenuOpen(false);
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all min-h-[80px] ${
                activeTab === item.id
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {item.icon}
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <span className="font-bold text-sm block">{item.label}</span>
                <span className="text-[10px] text-zinc-500 block">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-zinc-800/80">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsPhysiqueModalOpen(true);
            }}
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-left flex items-center justify-between min-h-[44px]"
          >
            <div>
              <span className="text-[10px] uppercase text-zinc-500 font-bold block">Goal Physique</span>
              <span className="text-xs font-bold text-zinc-200">{currentPhysique.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </BottomSheet>

      {/* Rest Timer Floating Banner */}
      <RestTimerBanner />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Physique Target Selector BottomSheet */}
      <BottomSheet
        isOpen={isPhysiqueModalOpen}
        onClose={() => setIsPhysiqueModalOpen(false)}
        title="Choose Desired Physique Target"
        subtitle="IronPath customizes workout volume, muscle frequency & coaching around this goal."
      >
        <div className="space-y-3 mt-2">
          {PHYSIQUE_TARGET_CARDS.map((target) => {
            const isSelected = userProfile.physiqueTarget === target.id;
            return (
              <Card
                key={target.id}
                variant={isSelected ? 'glow' : 'interactive'}
                onClick={() => {
                  setPhysiqueTarget(target.id as any);
                  setIsPhysiqueModalOpen(false);
                }}
                className={`p-4 cursor-pointer transition-all border ${
                  isSelected ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                      {target.name}
                      {isSelected && <Badge variant="purple">Active Focus</Badge>}
                    </h4>
                    <p className="text-xs text-purple-400 font-semibold mt-0.5">{target.tagline}</p>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{target.description}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Priority Muscles:</span>
                  {target.emphasizedMuscles.map((m) => (
                    <Badge key={m} variant="purple" className="text-[10px] uppercase">
                      {m}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
};
