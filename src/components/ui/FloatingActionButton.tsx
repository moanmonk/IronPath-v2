import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Dumbbell, Target, Sparkles, RefreshCw } from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const startWorkout = useIronPathStore((s) => s.startWorkout);
  const isWorkoutInProgress = useIronPathStore((s) => s.isWorkoutInProgress);
  const setActiveTab = useIronPathStore((s) => s.setActiveTab);
  const triggerSync = useIronPathStore((s) => s.triggerSync);

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="flex flex-col gap-2 items-end mb-2"
          >
            <button
              onClick={() => {
                setIsOpen(false);
                if (!isWorkoutInProgress) {
                  startWorkout();
                }
                setActiveTab('train');
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm shadow-2xl min-h-[44px] transition-all ${
                isWorkoutInProgress
                  ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-400 shadow-red-600/50'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>{isWorkoutInProgress ? '🔴 Resume Live Workout' : 'Start Live Workout'}</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setActiveTab('train');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 text-zinc-100 font-semibold text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800 transition-colors min-h-[44px]"
            >
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Open Workout Planner</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                triggerSync();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 text-zinc-100 font-semibold text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800 transition-colors min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Sync Offline Data</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3.5 rounded-2xl shadow-2xl active:scale-95 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center ${
          isWorkoutInProgress
            ? 'bg-red-600 text-white shadow-red-600/60 ring-2 ring-red-400/80 animate-pulse'
            : 'bg-zinc-100 text-zinc-950 shadow-indigo-500/20 hover:bg-white'
        }`}
      >
        <Plus className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
};
