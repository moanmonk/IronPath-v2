import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Plus, Minus, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Button } from './Button';
import { formatTime } from '../../lib/utils';

export const RestTimerBanner: React.FC = () => {
  const restTimer = useIronPathStore((s) => s.restTimer);
  const startRestTimer = useIronPathStore((s) => s.startRestTimer);
  const stopRestTimer = useIronPathStore((s) => s.stopRestTimer);
  const tickRestTimer = useIronPathStore((s) => s.tickRestTimer);
  const soundAlerts = useIronPathStore((s) => s.userProfile.soundAlerts);
  const updateUserProfile = useIronPathStore((s) => s.updateUserProfile);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (restTimer.isRunning) {
      tickRestTimer(); // immediate initial tick check
      interval = setInterval(() => {
        tickRestTimer();
      }, 1000);

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          tickRestTimer();
        }
      };

      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);

      return () => {
        if (interval) clearInterval(interval);
        window.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      };
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.isRunning, tickRestTimer]);

  if (!restTimer.isRunning) return null;

  const progressPercent = Math.min(100, Math.max(0, (restTimer.secondsRemaining / restTimer.totalDuration) * 100));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-20 md:bottom-6 left-3 right-16 sm:left-4 sm:right-24 max-w-lg z-40 bg-zinc-900/95 border border-emerald-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
              <Timer className="w-5 h-5 animate-pulse text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Rest Timer Active</div>
              <div className="text-xl font-extrabold text-zinc-100 font-mono tracking-wider">
                {formatTime(restTimer.secondsRemaining)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startRestTimer(restTimer.secondsRemaining + 30)}
            >
              <Plus className="w-3.5 h-3.5" /> 30s
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateUserProfile({ soundAlerts: !soundAlerts })}
            >
              {soundAlerts ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={stopRestTimer}
              rightIcon={<SkipForward className="w-3.5 h-3.5 text-zinc-950" />}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black"
            >
              Skip
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-600 h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
