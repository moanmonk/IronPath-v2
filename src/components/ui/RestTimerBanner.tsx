import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Plus, SkipForward, Volume2, VolumeX, Smartphone, Zap } from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Button } from './Button';
import { formatTime } from '../../lib/utils';
import { triggerHaptic, playSetCompletionSound } from '../../lib/audioUtils';

export const RestTimerBanner: React.FC = () => {
  const restTimer = useIronPathStore((s) => s.restTimer);
  const startRestTimer = useIronPathStore((s) => s.startRestTimer);
  const stopRestTimer = useIronPathStore((s) => s.stopRestTimer);
  const tickRestTimer = useIronPathStore((s) => s.tickRestTimer);
  const soundAlerts = useIronPathStore((s) => s.userProfile.soundAlerts);
  const hapticAlerts = useIronPathStore((s) => s.userProfile.hapticAlerts !== false);
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
  const isFinalCountdown = restTimer.secondsRemaining > 0 && restTimer.secondsRemaining <= 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`fixed bottom-[70px] md:bottom-6 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-2 transition-all ${
          isFinalCountdown
            ? 'bg-amber-950/95 border-2 border-amber-400 shadow-amber-500/30 animate-pulse'
            : 'bg-zinc-900/95 border border-emerald-500/40'
        }`}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl font-bold shrink-0 ${
              isFinalCountdown ? 'bg-amber-500 text-zinc-950' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Timer className={`w-4 h-4 sm:w-5 sm:h-5 ${isFinalCountdown ? 'animate-bounce' : 'animate-pulse'}`} />
            </div>
            <div className="min-w-0">
              <div className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate ${
                isFinalCountdown ? 'text-amber-300' : 'text-emerald-400'
              }`}>
                {isFinalCountdown ? '⚡ Get Ready!' : 'Rest Timer'}
              </div>
              <div className={`text-lg sm:text-xl font-extrabold font-mono tracking-wider ${
                isFinalCountdown ? 'text-amber-300 scale-105 origin-left transition-transform' : 'text-zinc-100'
              }`}>
                {formatTime(restTimer.secondsRemaining)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startRestTimer(restTimer.secondsRemaining + 30)}
              className="text-[11px] sm:text-xs px-1.5 sm:px-2 py-1 min-h-[34px] sm:min-h-[38px]"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 30s
            </Button>

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="icon"
              title={soundAlerts ? "Sound Cues: ON (Click to Mute)" : "Sound Cues: OFF (Click to Enable)"}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0 flex items-center justify-center shrink-0"
              onClick={() => {
                const next = !soundAlerts;
                updateUserProfile({ soundAlerts: next });
                if (next) playSetCompletionSound(true, hapticAlerts);
              }}
            >
              {soundAlerts ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />}
            </Button>

            {/* Haptic Toggle */}
            <Button
              variant="ghost"
              size="icon"
              title={hapticAlerts ? "Haptic Vibration: ON (Click to Mute)" : "Haptic Vibration: OFF (Click to Enable)"}
              className="w-8 h-8 sm:w-9 sm:h-9 p-0 flex items-center justify-center shrink-0"
              onClick={() => {
                const next = !hapticAlerts;
                updateUserProfile({ hapticAlerts: next });
                if (next) triggerHaptic('setComplete', true);
              }}
            >
              <Smartphone className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${hapticAlerts ? 'text-purple-400' : 'text-zinc-500'}`} />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={stopRestTimer}
              rightIcon={<SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-950" />}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-[11px] sm:text-xs px-2 sm:px-3 py-1 min-h-[34px] sm:min-h-[38px] shrink-0"
            >
              Skip
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isFinalCountdown
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
