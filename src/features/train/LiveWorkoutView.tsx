import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  Timer, 
  Clock,
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Award, 
  HelpCircle,
  X,
  AlertCircle,
  Flame,
  Volume2,
  Trash2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { ExerciseSet } from '../../types';
import { calculateActiveWorkoutDurationMinutes, formatDurationMinutes } from '../../lib/workoutTimeUtils';

interface LiveWorkoutViewProps {
  onFinishAndReturnToPlanner?: () => void;
}

export const LiveWorkoutView: React.FC<LiveWorkoutViewProps> = ({ onFinishAndReturnToPlanner }) => {
  const activeWorkout = useIronPathStore((s) => s.activeWorkout);
  const isWorkoutInProgress = useIronPathStore((s) => s.isWorkoutInProgress);
  const toggleSetCompleted = useIronPathStore((s) => s.toggleSetCompleted);
  const updateSetData = useIronPathStore((s) => s.updateSetData);
  const addSetToExercise = useIronPathStore((s) => s.addSetToExercise);
  const removeSetFromExercise = useIronPathStore((s) => s.removeSetFromExercise);
  const finishWorkout = useIronPathStore((s) => s.finishWorkout);
  const setWorkoutNote = useIronPathStore((s) => s.setWorkoutNote);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Active Live Elapsed Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(activeWorkout.durationSeconds || 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const estimatedMinutes = calculateActiveWorkoutDurationMinutes(activeWorkout.exercises);
  const totalSetsCount = activeWorkout.exercises.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0);

  const currentExercise = activeWorkout.exercises[currentExerciseIndex];
  const nextExercise = activeWorkout.exercises[currentExerciseIndex + 1];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (activeWorkout.completed || !isWorkoutInProgress || !currentExercise) {
    return (
      <Card className="p-8 text-center space-y-6 max-w-xl mx-auto border-emerald-500/30 bg-zinc-900/95 backdrop-blur-xl animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="emerald" className="uppercase tracking-widest text-[10px] font-bold">Workout Completed</Badge>
          <h3 className="text-2xl font-black text-zinc-100">{activeWorkout.title || 'Live Session'}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Session data and exercise volume have been logged in your profile history. Select a training day below to start your next live session.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
          <Button
            variant="emerald"
            size="lg"
            onClick={() => onFinishAndReturnToPlanner?.()}
            leftIcon={<Calendar className="w-5 h-5 text-zinc-950" />}
            className="w-full font-black py-3.5 shadow-xl shadow-emerald-500/20 text-sm"
          >
            Start Next Training Day / View Days
          </Button>
        </div>
      </Card>
    );
  }

  const completedSetsInExercise = currentExercise.sets.filter((s) => s.completed).length;
  const isExerciseFinished = completedSetsInExercise === currentExercise.sets.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Distraction-Free Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-zinc-900/90 border border-zinc-800 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Live Training Session</span>
            <Badge variant="purple" className="flex items-center gap-1 text-[11px] font-mono py-0.5 px-2 shrink-0">
              <Clock className="w-3 h-3 text-purple-300" />
              <span>Est. {formatDurationMinutes(estimatedMinutes)}</span>
            </Badge>
            <Badge variant="emerald" className="flex items-center gap-1 text-[11px] font-mono py-0.5 px-2 shrink-0">
              <Timer className="w-3 h-3 text-emerald-300" />
              <span>Live: {formatElapsed(elapsedSeconds)}</span>
            </Badge>
          </div>
          <h2 className="text-base sm:text-lg font-black text-zinc-100 truncate">{activeWorkout.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 sm:flex-none min-h-[44px]"
            onClick={() => setIsNoteDrawerOpen(true)}
            leftIcon={<FileText className="w-4 h-4 text-zinc-400" />}
          >
            Notes
          </Button>

          <Button
            variant="emerald"
            size="sm"
            className="flex-1 sm:flex-none min-h-[44px]"
            onClick={() => {
              triggerConfetti();
              finishWorkout();
              onFinishAndReturnToPlanner?.();
            }}
          >
            Finish Workout
          </Button>
        </div>
      </div>

      {/* Exercise Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {activeWorkout.exercises.map((pe, idx) => {
          const isCurrent = idx === currentExerciseIndex;
          const allDone = pe.sets.every((s) => s.completed);
          return (
            <button
              key={pe.id}
              onClick={() => setCurrentExerciseIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : allDone
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span className="truncate max-w-[130px] sm:max-w-none">{idx + 1}. {pe.exercise.name}</span>
              {allDone && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Focused Main Exercise Card */}
      <Card variant="glow" glowColor="rgba(16, 185, 129, 0.15)" className="p-4 sm:p-8 space-y-5 sm:space-y-6 border-emerald-500/30">
        {/* Exercise Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <Badge variant="emerald">{currentExercise.exercise.primaryMuscle.replace('_', ' ').toUpperCase()}</Badge>
              <Badge variant="purple">{currentExercise.exercise.hypertrophyTier}</Badge>
              <Badge variant="zinc" className="text-[10px]">{currentExercise.exercise.equipment}</Badge>
              <Badge variant="zinc" className="text-[10px] text-amber-300 bg-amber-500/10 border-amber-500/30">
                ⏱️ Rest: {currentExercise.restSeconds || 120}s
              </Badge>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-zinc-100 tracking-tight leading-snug break-words">
              {currentExercise.exercise.name}
            </h3>
            <p className="text-xs text-emerald-400 font-medium mt-1 leading-relaxed">
              💡 Cue: {currentExercise.exercise.cue}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsGuideOpen(true)}
            title="View Form Instructions"
            className="shrink-0"
          >
            <HelpCircle className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>

        {/* Exercise Plan Notes / Custom Cues Banner */}
        {(currentExercise.notes || currentExercise.exercise.notes) && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 shadow-inner">
            <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block">Exercise Plan Notes / Setup Cues</span>
              <p className="leading-relaxed font-medium text-amber-100 whitespace-pre-wrap">{currentExercise.notes || currentExercise.exercise.notes}</p>
            </div>
          </div>
        )}

        {/* Set Logger Cards */}
        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-zinc-500 px-3">
            <span className="col-span-2">Set</span>
            <span className="col-span-3">Previous</span>
            <span className="col-span-3">Weight (kg)</span>
            <span className="col-span-2">Reps</span>
            <span className="col-span-2 text-right">Complete</span>
          </div>

          <div className="space-y-3">
            {currentExercise.sets.map((set) => {
              const isDone = set.completed;
              const isWarmup = set.type === 'warmup';

              return (
                <motion.div
                  key={set.id}
                  whileTap={{ scale: 0.99 }}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isWarmup
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-100'
                      : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
                  }`}
                >
                  {/* MOBILE VIEW (< sm) */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDone 
                            ? 'bg-emerald-500 text-zinc-950' 
                            : isWarmup
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {set.setNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-200 capitalize">{set.type} Set</span>
                            {isWarmup && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] uppercase">
                                Warmup
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            Prev: {set.previousWeight ? `${set.previousWeight}kg × ${set.previousReps}` : '—'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => removeSetFromExercise(currentExercise.id, set.id)}
                          className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                          title="Delete set"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleSetCompleted(currentExercise.id, set.id)}
                          className={`px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md text-xs font-bold shrink-0 min-h-[40px] ${
                            isDone
                              ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          <Check className="w-4 h-4 font-black" />
                          <span>{isDone ? 'Done' : 'Complete'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60">
                      {/* Weight Control */}
                      <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Weight (kg)</span>
                        <div className="flex items-center justify-between w-full gap-1">
                          <button
                            onClick={() => updateSetData(currentExercise.id, set.id, { weight: Math.max(0, parseFloat((set.weight - 2.5).toFixed(2))) })}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                            title="Decrease Weight"
                          >
                            <Minus className="w-3.5 h-3.5 font-bold" />
                          </button>
                          <input
                            type="number"
                            step="any"
                            value={set.weight}
                            onChange={(e) => updateSetData(currentExercise.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                            className="w-full min-w-0 px-0.5 text-center font-mono font-bold text-sm sm:text-base bg-transparent text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateSetData(currentExercise.id, set.id, { weight: parseFloat((set.weight + 2.5).toFixed(2)) })}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                            title="Increase Weight"
                          >
                            <Plus className="w-3.5 h-3.5 font-bold" />
                          </button>
                        </div>
                      </div>

                      {/* Reps Control */}
                      <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reps</span>
                        <div className="flex items-center justify-between w-full gap-1">
                          <button
                            onClick={() => updateSetData(currentExercise.id, set.id, { reps: Math.max(0, set.reps - 1) })}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                            title="Decrease Reps"
                          >
                            <Minus className="w-3.5 h-3.5 font-bold" />
                          </button>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSetData(currentExercise.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                            className="w-full min-w-0 px-0.5 text-center font-mono font-bold text-sm sm:text-base bg-transparent text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateSetData(currentExercise.id, set.id, { reps: set.reps + 1 })}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                            title="Increase Reps"
                          >
                            <Plus className="w-3.5 h-3.5 font-bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP VIEW (>= sm) */}
                  <div className="hidden sm:grid sm:grid-cols-12 sm:items-center gap-2">
                    {/* Set Number */}
                    <div className="col-span-2 flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isDone 
                          ? 'bg-emerald-500 text-zinc-950' 
                          : isWarmup
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {set.setNumber}
                      </span>
                      <span className={`text-[10px] uppercase font-bold ${isWarmup ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {set.type}
                      </span>
                    </div>

                    {/* Previous Performance */}
                    <div className="col-span-3 text-xs text-zinc-400 font-mono">
                      {set.previousWeight ? `${set.previousWeight}kg × ${set.previousReps}` : '—'}
                    </div>

                    {/* Weight Input */}
                    <div className="col-span-3 flex items-center gap-1">
                      <button
                        onClick={() => updateSetData(currentExercise.id, set.id, { weight: Math.max(0, parseFloat((set.weight - 2.5).toFixed(2))) })}
                        className="p-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        title="Decrease Weight"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        step="any"
                        value={set.weight}
                        onChange={(e) => updateSetData(currentExercise.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                        className="w-full min-w-[64px] px-1 text-center font-mono font-bold text-sm bg-zinc-950 border border-zinc-800 rounded-lg py-1 text-zinc-100 focus:outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => updateSetData(currentExercise.id, set.id, { weight: parseFloat((set.weight + 2.5).toFixed(2)) })}
                        className="p-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        title="Increase Weight"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-2 flex items-center gap-1">
                      <button
                        onClick={() => updateSetData(currentExercise.id, set.id, { reps: Math.max(0, set.reps - 1) })}
                        className="p-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        title="Decrease Reps"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSetData(currentExercise.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                        className="w-full min-w-[48px] text-center font-mono font-bold text-sm bg-zinc-950 border border-zinc-800 rounded-lg py-1 text-zinc-100 focus:outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => updateSetData(currentExercise.id, set.id, { reps: set.reps + 1 })}
                        className="p-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        title="Increase Reps"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Complete Checkbox & Delete Buttons */}
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <button
                        onClick={() => removeSetFromExercise(currentExercise.id, set.id)}
                        className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        title="Delete set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleSetCompleted(currentExercise.id, set.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-md ${
                          isDone
                            ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20 scale-105'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-purple-500/20 hover:text-purple-400'
                        }`}
                      >
                        <Check className="w-4 h-4 font-black" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dual Add Set Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="border border-dashed border-amber-500/30 hover:bg-amber-500/10 text-xs text-amber-300 font-bold"
              onClick={() => addSetToExercise(currentExercise.id, 'warmup')}
              leftIcon={<Plus className="w-3.5 h-3.5 text-amber-400" />}
            >
              + Warmup Set
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-dashed border-purple-500/30 hover:bg-purple-500/10 text-xs text-purple-300 font-bold"
              onClick={() => addSetToExercise(currentExercise.id, 'working')}
              leftIcon={<Plus className="w-3.5 h-3.5 text-purple-400" />}
            >
              + Working Set
            </Button>
          </div>
        </div>

        {/* Footer Navigation within Workout */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex(currentExerciseIndex - 1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Previous Exercise
          </Button>

          {nextExercise ? (
            <div className="text-right w-full sm:w-auto">
              <span className="text-[10px] uppercase text-zinc-500 font-bold block text-center sm:text-right mb-1 sm:mb-0">Next Up</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="w-full sm:w-auto min-h-[44px] bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                <span className="truncate max-w-[200px] sm:max-w-none">{nextExercise.exercise.name}</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                triggerConfetti();
                finishWorkout();
                onFinishAndReturnToPlanner?.();
              }}
              rightIcon={<Award className="w-4 h-4" />}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Complete Workout
            </Button>
          )}
        </div>
      </Card>

      {/* Form Instructions Modal */}
      <BottomSheet
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title={currentExercise.exercise.name}
        subtitle="S-Tier Hypertrophy Technique Guide"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300">
            <strong>Key Execution Cue:</strong> {currentExercise.exercise.cue}
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Step-by-Step Biomechanics</h5>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
              {currentExercise.exercise.instructions.map((inst, i) => (
                <li key={i} className="leading-relaxed">{inst}</li>
              ))}
            </ol>
          </div>
        </div>
      </BottomSheet>

      {/* Quick Notes BottomSheet */}
      <BottomSheet
        isOpen={isNoteDrawerOpen}
        onClose={() => setIsNoteDrawerOpen(false)}
        title="Workout Notes & Observations"
        subtitle="Log pump quality, joint feel, or energy levels for coaching analytics."
      >
        <div className="space-y-4">
          <textarea
            rows={4}
            value={activeWorkout.notes || ''}
            onChange={(e) => setWorkoutNote(e.target.value)}
            placeholder="e.g., Unbelievable lat stretch today on Bayesian Cable Curls. Right shoulder felt 100% stable."
            className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 text-sm"
          />
          <Button variant="primary" size="md" className="w-full" onClick={() => setIsNoteDrawerOpen(false)}>
            Save Notes
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
