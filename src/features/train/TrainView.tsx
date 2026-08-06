import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Target, 
  Sparkles, 
  Award, 
  Search, 
  Calendar, 
  Edit3, 
  Layers, 
  X,
  FileText,
  Clock,
  ChevronRight,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Exercise, MuscleGroup, PlannedExercise } from '../../types';
import { WorkoutPlannerView } from './WorkoutPlannerView';
import { SwapLiveExerciseModal } from './SwapLiveExerciseModal';

export const TrainView: React.FC = () => {
  const customPlans = useIronPathStore((s) => s.customPlans);
  const activePlanId = useIronPathStore((s) => s.activePlanId);
  const activeWorkout = useIronPathStore((s) => s.activeWorkout);
  const exercisesLibrary = useIronPathStore((s) => s.exercisesLibrary);
  
  const startWorkoutFromPlanDay = useIronPathStore((s) => s.startWorkoutFromPlanDay);
  const toggleSetCompleted = useIronPathStore((s) => s.toggleSetCompleted);
  const updateSetData = useIronPathStore((s) => s.updateSetData);
  const updateExerciseNote = useIronPathStore((s) => s.updateExerciseNote);
  const addSetToExercise = useIronPathStore((s) => s.addSetToExercise);
  const removeSetFromExercise = useIronPathStore((s) => s.removeSetFromExercise);
  const addExerciseToWorkout = useIronPathStore((s) => s.addExerciseToWorkout);
  const removeExerciseFromWorkout = useIronPathStore((s) => s.removeExerciseFromWorkout);

  // Active Plan Object
  const activePlan = customPlans.find((p) => p.id === activePlanId) || 
                     customPlans.find((p) => p.status === 'active') || 
                     customPlans[0];

  // Modals & Sub-views state
  const [isPlanManagerOpen, setIsPlanManagerOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [swapModalExercise, setSwapModalExercise] = useState<PlannedExercise | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');

  // Load first day of active plan if no active exercises exist
  useEffect(() => {
    if ((!activeWorkout.exercises || activeWorkout.exercises.length === 0) && activePlan && activePlan.days.length > 0) {
      startWorkoutFromPlanDay(activePlan.title, activePlan.days[0]);
    }
  }, [activePlan, activeWorkout.exercises, startWorkoutFromPlanDay]);

  // Total volume calculation
  let totalVolumeKg = 0;
  let totalSetsCount = 0;
  let completedSetsCount = 0;

  activeWorkout.exercises?.forEach((pe) => {
    pe.sets?.forEach((s) => {
      totalSetsCount++;
      if (s.completed) {
        completedSetsCount++;
        totalVolumeKg += s.weight * s.reps;
      }
    });
  });

  const filteredLibrary = exercisesLibrary.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || ex.primaryMuscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  // If user clicked "Manage / Edit Plans" button
  if (isPlanManagerOpen) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Plan Builder & Blueprints</h3>
              <p className="text-xs text-zinc-400">Customize days, add exercises, or import new training splits.</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlanManagerOpen(false)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Return to Today's Log
          </Button>
        </div>

        <WorkoutPlannerView />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Active Plan & Day Selector Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="uppercase font-bold text-[10px] tracking-wider">
                {activePlan?.title || 'Active Workout Plan'}
              </Badge>
              {activePlan?.daysPerWeek && (
                <span className="text-xs text-zinc-400 font-medium">{activePlan.daysPerWeek} Days/Wk</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              {activeWorkout.title || 'Today\'s Training Session'}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddExerciseOpen(true)}
              leftIcon={<Plus className="w-4 h-4 text-cyan-400" />}
              className="text-xs font-semibold"
            >
              Add Exercise
            </Button>
            <Button
              variant="zinc"
              size="sm"
              onClick={() => setIsPlanManagerOpen(true)}
              leftIcon={<Edit3 className="w-4 h-4 text-zinc-400" />}
              className="text-xs font-semibold"
            >
              Plans
            </Button>
          </div>
        </div>

        {/* Day Selector Pills */}
        {activePlan && activePlan.days && activePlan.days.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Select Workout Day:</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {activePlan.days.map((day) => {
                const isSelected = activeWorkout.title?.includes(day.name);
                return (
                  <button
                    key={day.id}
                    onClick={() => startWorkoutFromPlanDay(activePlan.title, day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`} />
                    <span>{day.name}</span>
                    <span className="text-[10px] opacity-75">({day.exercises.length} ex)</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Progress & Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5 bg-zinc-900/60 border-zinc-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Logged Sets</div>
            <div className="text-base font-black text-zinc-100">{completedSetsCount} / {totalSetsCount}</div>
          </div>
        </Card>

        <Card className="p-3.5 bg-zinc-900/60 border-zinc-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Volume Lifted</div>
            <div className="text-base font-black text-zinc-100">{totalVolumeKg.toLocaleString()} kg</div>
          </div>
        </Card>

        <Card className="p-3.5 bg-zinc-900/60 border-zinc-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Exercises</div>
            <div className="text-base font-black text-zinc-100">{activeWorkout.exercises?.length || 0} Target</div>
          </div>
        </Card>
      </div>

      {/* Exercises Logger List */}
      <div className="space-y-6">
        {activeWorkout.exercises?.map((pe, exIdx) => {
          const ex = pe.exercise;
          return (
            <Card key={pe.id} className="p-4 sm:p-5 border-zinc-800 bg-zinc-900/90 shadow-lg space-y-4 relative overflow-hidden">
              {/* Exercise Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      EX {exIdx + 1}
                    </span>
                    <Badge variant="emerald" className="uppercase text-[10px] font-bold">
                      {ex.primaryMuscle?.replace('_', ' ')}
                    </Badge>
                    <Badge variant="zinc" className="text-[10px]">
                      {ex.equipment}
                    </Badge>
                    {pe.swappedFrom && (
                      <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
                        🔄 Swapped from {pe.swappedFrom}
                      </span>
                    )}
                    {pe.restSeconds && (
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        ⏱️ Rest: {pe.restSeconds}s
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight">
                    {ex.name}
                  </h3>
                  {ex.instructions && ex.instructions[0] && (
                    <p className="text-xs text-zinc-400 line-clamp-1 italic">
                      💡 {ex.instructions[0]}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSwapModalExercise(pe)}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5 text-purple-400" />}
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold py-1 px-2.5 rounded-lg"
                    title="Swap exercise if machine is busy or for variation"
                  >
                    Swap
                  </Button>
                  <button
                    onClick={() => removeExerciseFromWorkout(pe.id)}
                    className="text-zinc-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Remove exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Exercise Notes Section (Carries over to next sessions & saves in logs) */}
              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/70">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Session & Progression Notes (Carries to Next Sessions):</span>
                </div>
                <textarea
                  value={pe.notes || ''}
                  onChange={(e) => updateExerciseNote(pe.id, e.target.value)}
                  placeholder="e.g. 'last set was superset', 'did partial reps', 'did myoreps with 5 sec pauses', 'seat notch #4'..."
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 resize-none transition-all"
                />
              </div>

              {/* Sets Table */}
              <div className="space-y-2 overflow-x-auto">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 px-1">
                  <span className="col-span-3 sm:col-span-2">Set / Type</span>
                  <span className="col-span-2 sm:col-span-3">Prev Log</span>
                  <span className="col-span-3 sm:col-span-3">Weight (kg)</span>
                  <span className="col-span-2 sm:col-span-2">Reps</span>
                  <span className="col-span-2 sm:col-span-2 text-right">Log (Tick)</span>
                </div>

                {pe.sets?.map((set, sIdx) => {
                  const isWarmup = set.type === 'warmup';
                  return (
                    <div
                      key={set.id}
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-all ${
                        set.completed
                          ? isWarmup
                            ? 'bg-amber-950/30 border-amber-500/60 shadow-sm'
                            : 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                          : isWarmup
                            ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
                            : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700/80'
                      }`}
                    >
                      {/* Set Number & Clickable Type Badge */}
                      <div className="col-span-3 sm:col-span-2 flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-md font-extrabold text-[11px] flex items-center justify-center border ${
                          isWarmup
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-200 border-zinc-700/50'
                        }`}>
                          {sIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateSetData(pe.id, set.id, {
                              type: isWarmup ? 'working' : 'warmup',
                            })
                          }
                          title="Click to toggle between Warmup (W) and Working (Wk) set"
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                            isWarmup
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/60 shadow-sm'
                              : 'bg-zinc-800 text-zinc-400 hover:text-cyan-400 border border-zinc-700'
                          }`}
                        >
                          {isWarmup ? 'WARMUP' : 'Wk'}
                        </button>
                      </div>

                      {/* Previous Log Reference */}
                      <div className="col-span-3 sm:col-span-3 text-xs text-zinc-400 font-mono flex items-center gap-1 truncate">
                        {set.previousWeight ? (
                          <span>{set.previousWeight}kg × {set.previousReps}</span>
                        ) : (
                          <span className="text-zinc-400 font-normal italic">First Log</span>
                        )}
                      </div>

                      {/* Weight Input */}
                      <div className="col-span-3 sm:col-span-3">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weight === 0 ? '' : set.weight}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const valStr = e.target.value;
                            const parsed = valStr === '' ? 0 : parseFloat(valStr);
                            updateSetData(pe.id, set.id, { weight: isNaN(parsed) ? 0 : parsed });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>

                      {/* Reps Input */}
                      <div className="col-span-2 sm:col-span-2">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={set.reps === 0 ? '' : set.reps}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const valStr = e.target.value;
                            const parsed = valStr === '' ? 0 : parseInt(valStr, 10);
                            updateSetData(pe.id, set.id, { reps: isNaN(parsed) ? 0 : parsed });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-2 py-1.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>

                      {/* Tick Button & Set Actions */}
                      <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleSetCompleted(pe.id, set.id)}
                          className={`w-full py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm ${
                            set.completed
                              ? 'bg-emerald-500 text-zinc-950 font-black ring-2 ring-emerald-500/40 shadow-emerald-500/30 scale-102'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                          }`}
                        >
                          <Check className={`w-4 h-4 ${set.completed ? 'text-zinc-950 stroke-[3]' : 'text-zinc-400'}`} />
                          <span className="hidden sm:inline">{set.completed ? 'Done' : 'Log'}</span>
                        </button>
                        <button
                          onClick={() => removeSetFromExercise(pe.id, set.id)}
                          className="text-zinc-400 hover:text-red-400 p-1"
                          title="Delete set"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Set Adder Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                <Button
                  variant="zinc"
                  size="sm"
                  onClick={() => addSetToExercise(pe.id, 'working')}
                  leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-400" />}
                  className="text-xs font-semibold py-1.5"
                >
                  + Working Set
                </Button>
                <Button
                  variant="zinc"
                  size="sm"
                  onClick={() => addSetToExercise(pe.id, 'warmup')}
                  leftIcon={<Plus className="w-3.5 h-3.5 text-amber-400" />}
                  className="text-xs font-semibold py-1.5"
                >
                  + Warmup Set
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Exercise Modal */}
      <BottomSheet isOpen={isAddExerciseOpen} onClose={() => setIsAddExerciseOpen(false)} title="Add Exercise to Today's Plan">
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search exercise library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredLibrary.map((ex) => (
              <div
                key={ex.id}
                onClick={() => {
                  addExerciseToWorkout(ex);
                  setIsAddExerciseOpen(false);
                }}
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 flex items-center justify-between cursor-pointer transition-all hover:bg-zinc-850"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{ex.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="emerald" className="text-[9px] uppercase">{ex.primaryMuscle?.replace('_', ' ')}</Badge>
                    <Badge variant="zinc" className="text-[9px]">{ex.equipment}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="cyan" leftIcon={<Plus className="w-4 h-4" />}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Live Exercise Swap Modal */}
      <SwapLiveExerciseModal
        isOpen={!!swapModalExercise}
        onClose={() => setSwapModalExercise(null)}
        plannedExercise={swapModalExercise}
      />
    </div>
  );
};
