import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, ChevronRight, Clock, User, Shield, FolderPlus, Dumbbell } from 'lucide-react';
import { FEATURED_PROGRAMS } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Program } from '../../types';
import { useIronPathStore } from '../../store/useIronPathStore';

export const ProgramsView: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const importProgramAsEditablePlan = useIronPathStore((s) => s.importProgramAsEditablePlan);
  const setActiveTab = useIronPathStore((s) => s.setActiveTab);

  const handleImportProgram = (program: Program) => {
    importProgramAsEditablePlan(program);
    setSelectedProgram(null);
    setActiveTab('train');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <Badge variant="emerald" className="mb-1">HYPERTROPHY ARCHITECTURE</Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">Evidence-Based Hypertrophy Programs</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Curated training splits optimized for maximum mechanical tension, systemic recovery, and specific physique targets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURED_PROGRAMS.map((program) => (
          <Card key={program.id} variant="glow" glowColor="rgba(16, 185, 129, 0.12)" className="p-6 space-y-4 flex flex-col justify-between border-emerald-500/20">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="purple" className="mb-2">{program.level}</Badge>
                  <h3 className="text-xl font-black text-zinc-100">{program.title}</h3>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{program.tagline}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs shrink-0">
                  {program.daysPerWeek} Days/Wk
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {program.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {program.tags.map((tag) => (
                  <Badge key={tag} variant="zinc" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500 font-medium truncate">By {program.author}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedProgram(program)}
                  rightIcon={<ChevronRight className="w-4 h-4 text-zinc-950" />}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black"
                >
                  Inspect Split
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Program Inspector Modal */}
      {selectedProgram && (
        <BottomSheet
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          title={selectedProgram.title}
          subtitle={selectedProgram.tagline}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
              <strong>Level:</strong> {selectedProgram.level} • <strong>Frequency:</strong> {selectedProgram.daysPerWeek} Days/Week
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Weekly Split Architecture</h5>
              {selectedProgram.weeklyStructure.map((day, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-400">{day.dayName}</span>
                    <span className="text-zinc-500">{day.focus}</span>
                  </div>
                  {day.exercises.length > 0 && (
                    <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                      {day.exercises.map((ex, i) => (
                        <li key={i}>
                          <span className="text-zinc-200 font-semibold">{ex.name}</span> — {ex.sets} sets ({ex.targetReps} reps)
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4 font-bold gap-2 bg-purple-600 hover:bg-purple-500 text-white"
              onClick={() => handleImportProgram(selectedProgram)}
              leftIcon={<FolderPlus className="w-4 h-4" />}
            >
              Import as Personal Editable Blueprint
            </Button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

