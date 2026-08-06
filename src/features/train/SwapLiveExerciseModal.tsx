import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Sparkles, Dumbbell, ShieldCheck, Filter, AlertCircle, Zap } from 'lucide-react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Exercise, PlannedExercise, ALL_MUSCLE_GROUPS, MuscleGroup } from '../../types';
import { useIronPathStore } from '../../store/useIronPathStore';

interface SwapLiveExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plannedExercise: PlannedExercise | null;
}

const PRESET_REASONS = [
  'Machine Busy / In Use',
  'Equipment Missing / Taken',
  'Prefer Unilateral Alternative',
  'Joint Discomfort / Fatigue',
  'Better Mind-Muscle Connection',
];

export const SwapLiveExerciseModal: React.FC<SwapLiveExerciseModalProps> = ({
  isOpen,
  onClose,
  plannedExercise,
}) => {
  const exercisesLibrary = useIronPathStore((s) => s.exercisesLibrary);
  const swapActiveWorkoutExercise = useIronPathStore((s) => s.swapActiveWorkoutExercise);

  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [lateralFilter, setLateralFilter] = useState<'all' | 'unilateral' | 'bilateral'>('all');
  const [selectedReason, setSelectedReason] = useState<string>('Machine Busy / In Use');

  const currentExercise = plannedExercise?.exercise;

  // Set default muscle filter when planned exercise changes
  React.useEffect(() => {
    if (currentExercise) {
      setMuscleFilter(currentExercise.primaryMuscle || 'all');
    }
  }, [currentExercise]);

  // Helper to detect if an exercise is unilateral
  const isUnilateral = (ex: Exercise): boolean => {
    if (ex.isUnilateral !== undefined) return ex.isUnilateral;
    const nameLower = ex.name.toLowerCase();
    return (
      nameLower.includes('single') ||
      nameLower.includes('one-arm') ||
      nameLower.includes('one arm') ||
      nameLower.includes('unilateral') ||
      nameLower.includes('lunge') ||
      nameLower.includes('step-up') ||
      nameLower.includes('split squat') ||
      nameLower.includes('alternating')
    );
  };

  // Compute recommendations specifically matching the current exercise
  const recommendations = useMemo(() => {
    if (!currentExercise) return [];
    
    return exercisesLibrary
      .filter((ex) => ex.id !== currentExercise.id)
      .map((ex) => {
        let score = 0;
        let matchReason = '';

        if (ex.primaryMuscle === currentExercise.primaryMuscle) {
          score += 10;
          matchReason = 'Direct Target Muscle Match';
        } else if (ex.secondaryMuscles?.includes(currentExercise.primaryMuscle)) {
          score += 5;
          matchReason = 'Secondary Muscle Synergy';
        }

        if (ex.category === currentExercise.category) {
          score += 3;
        }

        const isExUni = isUnilateral(ex);
        const isCurrentUni = isUnilateral(currentExercise);

        if (!isCurrentUni && isExUni) {
          score += 2;
          matchReason = 'Unilateral Equalizer';
        } else if (ex.equipment !== currentExercise.equipment) {
          score += 2;
          matchReason = `${ex.equipment.replace('_', ' ')} Alternative`;
        }

        return { exercise: ex, score, matchReason };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [currentExercise, exercisesLibrary]);

  // Filter main library list
  const filteredLibrary = useMemo(() => {
    return exercisesLibrary.filter((ex) => {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = ex.name.toLowerCase().includes(q);
      const muscleMatch =
        ex.primaryMuscle.toLowerCase().includes(q) ||
        ex.secondaryMuscles.some((m) => m.toLowerCase().includes(q));
      const equipMatchStr = ex.equipment.toLowerCase().includes(q);
      const keywordMatch = ex.keywords?.some((k) => k.toLowerCase().includes(q));

      const matchesSearch = !q || nameMatch || muscleMatch || equipMatchStr || keywordMatch;
      const matchesMuscle = muscleFilter === 'all' || ex.primaryMuscle === muscleFilter;
      const matchesEquipment = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
      
      const exIsUni = isUnilateral(ex);
      const matchesLateral =
        lateralFilter === 'all' ||
        (lateralFilter === 'unilateral' && exIsUni) ||
        (lateralFilter === 'bilateral' && !exIsUni);

      return matchesSearch && matchesMuscle && matchesEquipment && matchesLateral;
    });
  }, [exercisesLibrary, searchQuery, muscleFilter, equipmentFilter, lateralFilter]);

  if (!plannedExercise || !currentExercise) return null;

  const handleSwap = (newEx: Exercise) => {
    swapActiveWorkoutExercise(plannedExercise.id, newEx, selectedReason);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Swap "${currentExercise.name}"`}
      subtitle="Select a recommended alternative when equipment is busy or for variation"
    >
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1 scrollbar-thin">
        {/* Current Exercise Banner */}
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Replacing Currently Logged</span>
            <div className="text-sm font-black text-zinc-100">{currentExercise.name}</div>
            <div className="text-[11px] text-purple-400 font-mono">
              {currentExercise.primaryMuscle.toUpperCase()} • {currentExercise.equipment} •{' '}
              {isUnilateral(currentExercise) ? 'Unilateral' : 'Bilateral'}
            </div>
          </div>
          <Badge variant="purple" className="text-xs">
            {currentExercise.hypertrophyTier}
          </Badge>
        </div>

        {/* Swap Reason Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Reason for Swap (Saved in Notes):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedReason(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedReason === r
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Exercises Carousel/Grid */}
        {recommendations.length > 0 && !searchQuery && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Substitutes for {currentExercise.primaryMuscle.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recommendations.map(({ exercise: recEx, matchReason }) => (
                <div
                  key={recEx.id}
                  className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold truncate">
                        {matchReason}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {isUnilateral(recEx) ? 'Unilateral' : 'Bilateral'}
                      </span>
                    </div>
                    <h5 className="font-bold text-zinc-100 text-xs mt-1 leading-snug">{recEx.name}</h5>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      {recEx.equipment} • {recEx.hypertrophyTier}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleSwap(recEx)}
                    leftIcon={<RefreshCw className="w-3 h-3" />}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs py-1.5 rounded-lg shadow-sm"
                  >
                    Swap to This
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by exercise name, muscle, equipment, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Unilateral / Bilateral Filter */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
              {(['all', 'unilateral', 'bilateral'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLateralFilter(mode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                    lateralFilter === mode
                      ? 'bg-cyan-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Equipment Filter */}
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Equipment</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="barbell">Barbell</option>
              <option value="cable">Cable</option>
              <option value="machine">Machine</option>
              <option value="smith_machine">Smith Machine</option>
              <option value="bodyweight">Bodyweight</option>
            </select>

            {/* Muscle Group Quick Filter */}
            <select
              value={muscleFilter}
              onChange={(e) => setMuscleFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Muscle Groups</option>
              {ALL_MUSCLE_GROUPS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises Library Full Listing */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            All Compatible Movements ({filteredLibrary.length})
          </span>
          {filteredLibrary.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No matching exercises found for these filter criteria.
            </div>
          ) : (
            filteredLibrary.map((ex) => {
              const exUni = isUnilateral(ex);
              const isCurrent = ex.id === currentExercise.id;
              return (
                <div
                  key={ex.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isCurrent
                      ? 'bg-purple-950/20 border-purple-500/50'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                      {ex.name}
                      <Badge variant="tier" className="text-[9px]">
                        {ex.hypertrophyTier}
                      </Badge>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                        exUni
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {exUni ? 'UNILATERAL' : 'BILATERAL'}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                      {ex.primaryMuscle.replace('_', ' ').toUpperCase()} • {ex.equipment}
                    </div>
                  </div>

                  <Button
                    variant={isCurrent ? 'ghost' : 'primary'}
                    size="sm"
                    disabled={isCurrent}
                    onClick={() => handleSwap(ex)}
                    leftIcon={<RefreshCw className="w-3 h-3" />}
                    className={
                      isCurrent
                        ? 'text-zinc-500 text-xs'
                        : 'bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-1 px-2.5 rounded-lg'
                    }
                  >
                    {isCurrent ? 'Current' : 'Swap In'}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
