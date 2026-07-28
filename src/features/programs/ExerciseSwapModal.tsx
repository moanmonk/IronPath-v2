import React, { useState } from 'react';
import { Search, RefreshCw, Sparkles, Plus, Dumbbell, ShieldCheck } from 'lucide-react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Exercise, CustomWorkoutExercise, MuscleGroup } from '../../types';
import { useIronPathStore } from '../../store/useIronPathStore';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  dayId: string;
  currentExercise: CustomWorkoutExercise;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  isOpen,
  onClose,
  planId,
  dayId,
  currentExercise
}) => {
  const exercisesLibrary = useIronPathStore((s) => s.exercisesLibrary);
  const replacePlanExercise = useIronPathStore((s) => s.replacePlanExercise);

  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>(currentExercise.primaryMuscle || 'all');

  const filteredLibrary = exercisesLibrary.filter((ex) => {
    const matchesQuery = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = muscleFilter === 'all' || ex.primaryMuscle === muscleFilter;
    return matchesQuery && matchesMuscle;
  });

  const handleSelectReplacement = (newEx: Exercise) => {
    replacePlanExercise(planId, dayId, currentExercise.id, newEx);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Swap "${currentExercise.name}"`}
      subtitle="Select an alternative movement with similar biomechanics or stimulus"
    >
      <div className="space-y-4">
        {/* Search & Muscle Filters */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search replacement exercise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Quick Muscle Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setMuscleFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              muscleFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Muscles
          </button>
          {['chest', 'lats', 'side_delts', 'biceps', 'triceps', 'quads', 'hamstrings', 'calves', 'abs'].map((m) => (
            <button
              key={m}
              onClick={() => setMuscleFilter(m)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize whitespace-nowrap ${
                muscleFilter === m
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Library Items Stack */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {filteredLibrary.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No matching exercises found in library.
            </div>
          ) : (
            filteredLibrary.map((ex) => (
              <div
                key={ex.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                  ex.name.toLowerCase() === currentExercise.name.toLowerCase()
                    ? 'bg-purple-500/10 border-purple-500/50'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    {ex.name}
                    <Badge variant="tier">{ex.hypertrophyTier}</Badge>
                    {ex.name.toLowerCase() === currentExercise.name.toLowerCase() && (
                      <span className="text-[10px] text-purple-400 font-bold uppercase">(Current)</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                    {ex.primaryMuscle.replace('_', ' ').toUpperCase()} • {ex.equipment}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSelectReplacement(ex)}
                  disabled={ex.name.toLowerCase() === currentExercise.name.toLowerCase()}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Swap In
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
