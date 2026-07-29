import React, { useState } from 'react';
import { Search, Filter, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { EXERCISES_LIBRARY } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Exercise, MuscleGroup, ALL_MUSCLE_GROUPS } from '../../types';

export const ExercisesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const muscleList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Muscles' },
    ...ALL_MUSCLE_GROUPS
  ];

  const equipmentList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'cable', label: 'Cable & Attachments' },
    { id: 'dumbbell', label: 'Dumbbell' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'ez_bar', label: 'EZ-Bar' },
    { id: 'smith_machine', label: 'Smith Machine' },
    { id: 'machine', label: 'Machine' }
  ];

  const filtered = EXERCISES_LIBRARY.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.cue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = muscleFilter === 'all' || ex.primaryMuscle === muscleFilter;
    const matchesEquipment = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <Badge variant="emerald" className="mb-1">HYPERTROPHY ENCYCLOPEDIA</Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">Exercise Library & Biomechanics</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          S-Tier biomechanically vetted movements selected for maximum target muscle isolation and hyper-efficient mechanical tension.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search exercises by name, cable, machine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Muscle Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
          {muscleList.map((m) => (
            <button
              key={m.id}
              onClick={() => setMuscleFilter(m.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center ${
                muscleFilter === m.id
                  ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Equipment & Attachment Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 w-full sm:w-auto mr-1">Attachment / Method:</span>
          {equipmentList.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setEquipmentFilter(eq.id)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all min-h-[38px] flex items-center justify-center whitespace-nowrap ${
                equipmentFilter === eq.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30'
                  : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {eq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <Card
            key={ex.id}
            variant="interactive"
            onClick={() => setSelectedExercise(ex)}
            className="p-5 flex flex-col justify-between border-zinc-800/80 hover:border-emerald-500/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="emerald">{ex.primaryMuscle.replace('_', ' ').toUpperCase()}</Badge>
                <Badge variant="purple">{ex.hypertrophyTier}</Badge>
              </div>

              <h4 className="text-base font-bold text-zinc-100">{ex.name}</h4>
              <p className="text-xs text-emerald-400 font-medium mt-1 italic line-clamp-2">
                "{ex.cue}"
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span className="capitalize">{ex.equipment} • {ex.category}</span>
              <span className="text-purple-400 font-bold flex items-center gap-1">
                Instructions <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <BottomSheet
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          title={selectedExercise.name}
          subtitle={`${selectedExercise.hypertrophyTier} • ${selectedExercise.primaryMuscle.replace('_', ' ').toUpperCase()} • ${selectedExercise.equipment}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 font-medium">
              💡 <strong>Biomechanical Cue:</strong> {selectedExercise.cue}
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Execution Steps</h5>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-zinc-300">
                {selectedExercise.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full mt-4"
              onClick={() => setSelectedExercise(null)}
            >
              Close
            </Button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};
