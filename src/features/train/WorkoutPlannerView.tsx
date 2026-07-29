import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Layers, 
  Save, 
  Search, 
  Check, 
  ArrowUp, 
  ArrowDown,
  Dumbbell,
  FolderPlus,
  Play,
  Edit3,
  ChevronRight,
  ChevronDown,
  X,
  FileJson,
  Printer,
  Zap,
  Tag,
  Archive,
  RotateCcw,
  Star,
  Sparkles,
  Download,
  Upload,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Exercise, MuscleGroup, CustomWorkoutPlan, ALL_MUSCLE_GROUPS } from '../../types';
import { PlanEditorModal } from '../programs/PlanEditorModal';
import { PlanJSONModal } from '../programs/PlanJSONModal';
import { calculateCustomDayDurationMinutes, formatDurationMinutes } from '../../lib/workoutTimeUtils';

export const WorkoutPlannerView: React.FC = () => {
  const customPlans = useIronPathStore((s) => s.customPlans);
  const activePlanId = useIronPathStore((s) => s.activePlanId);
  const exercisesLibrary = useIronPathStore((s) => s.exercisesLibrary);
  const activeWorkout = useIronPathStore((s) => s.activeWorkout);
  
  const createCustomPlan = useIronPathStore((s) => s.createCustomPlan);
  const deleteCustomPlan = useIronPathStore((s) => s.deleteCustomPlan);
  const setActivePlan = useIronPathStore((s) => s.setActivePlan);
  const archivePlan = useIronPathStore((s) => s.archivePlan);
  const unarchivePlan = useIronPathStore((s) => s.unarchivePlan);
  const duplicateCustomPlan = useIronPathStore((s) => s.duplicateCustomPlan);
  
  const addDayToPlan = useIronPathStore((s) => s.addDayToPlan);
  const deletePlanDay = useIronPathStore((s) => s.deletePlanDay);
  const duplicatePlanDay = useIronPathStore((s) => s.duplicatePlanDay);
  const reorderPlanDays = useIronPathStore((s) => s.reorderPlanDays);
  
  const addExerciseToPlanDay = useIronPathStore((s) => s.addExerciseToPlanDay);
  const updatePlanExercise = useIronPathStore((s) => s.updatePlanExercise);
  const deletePlanExercise = useIronPathStore((s) => s.deletePlanExercise);
  const duplicatePlanExercise = useIronPathStore((s) => s.duplicatePlanExercise);
  const reorderPlanExercises = useIronPathStore((s) => s.reorderPlanExercises);
  const startWorkoutFromPlanDay = useIronPathStore((s) => s.startWorkoutFromPlanDay);
  const addCustomExerciseToLibrary = useIronPathStore((s) => s.addCustomExerciseToLibrary);

  const reorderExercises = useIronPathStore((s) => s.reorderExercises);
  const removeExerciseFromWorkout = useIronPathStore((s) => s.removeExerciseFromWorkout);
  const addExerciseToWorkout = useIronPathStore((s) => s.addExerciseToWorkout);

  const [plannerTab, setPlannerTab] = useState<'blueprints' | 'scratchpad'>('blueprints');
  const [filterStatus, setFilterStatus] = useState<'active' | 'saved' | 'all'>('active');

  // Plan Editor Modal State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const editingPlan = customPlans.find((p) => p.id === editingPlanId) || null;

  // New Plan Modal State
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [newPlanGoal, setNewPlanGoal] = useState('Muscle Hypertrophy & Density');
  const [newPlanDaysCount, setNewPlanDaysCount] = useState(5);

  // JSON Export / Import Modal State
  const [jsonModalState, setJsonModalState] = useState<{
    isOpen: boolean;
    mode: 'export' | 'import';
    plan?: CustomWorkoutPlan | null;
  }>({ isOpen: false, mode: 'export' });

  // Add Exercise to Plan Day Modal
  const [isAddExModalOpen, setIsAddExModalOpen] = useState(false);
  const [targetDayIdForEx, setTargetDayIdForEx] = useState<string | null>(null);
  const [targetPlanIdForEx, setTargetPlanIdForEx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');

  // Custom Exercise Drawer Modal
  const [isCreateExModalOpen, setIsCreateExModalOpen] = useState(false);
  const [customExName, setCustomExName] = useState('');
  const [customExMuscle, setCustomExMuscle] = useState<MuscleGroup>('chest');
  const [customExEquipment, setCustomExEquipment] = useState('barbell');
  const [customExCue, setCustomExCue] = useState('');

  // Active Plan Object
  const activePlan = customPlans.find((p) => p.id === activePlanId) || customPlans.find((p) => p.status === 'active') || customPlans[0];

  // Filtered Plans List based on status tab
  const activePlansList = customPlans.filter(p => p.status !== 'archived');
  const filteredPlans = activePlansList.filter((p) => {
    if (filterStatus === 'active') return p.id === activePlan?.id || p.status === 'active';
    if (filterStatus === 'saved') return p.status === 'saved' && p.id !== activePlan?.id;
    return true; // 'all'
  });

  const filteredLibrary = exercisesLibrary.filter((ex) => {
    const matchesQuery = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = muscleFilter === 'all' || ex.primaryMuscle === muscleFilter;
    return matchesQuery && matchesMuscle;
  });

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;
    const plan = createCustomPlan(newPlanTitle, newPlanDescription, newPlanDaysCount, newPlanGoal);
    setNewPlanTitle('');
    setNewPlanDescription('');
    setIsNewPlanModalOpen(false);
    setEditingPlanId(plan.id);
  };

  const handleCreateCustomExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customExName.trim()) return;
    const newEx: Exercise = {
      id: `ex_user_${Date.now()}`,
      name: customExName,
      primaryMuscle: customExMuscle,
      secondaryMuscles: [],
      equipment: (['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'smith_machine'].includes(customExEquipment) ? customExEquipment : 'dumbbell') as any,
      category: 'compound',
      hypertrophyTier: 'A Tier',
      defaultRIR: 1,
      instructions: ['Adjust equipment for optimal leverage.', 'Perform controlled repetition.'],
      setupInstructions: ['Adjust equipment for optimal leverage.'],
      executionInstructions: ['Perform controlled eccentric and concentric phases.'],
      cue: customExCue || 'Focus on deep stretch and hard contraction.',
      alternatives: []
    };
    addCustomExerciseToLibrary(newEx);
    setCustomExName('');
    setCustomExCue('');
    setIsCreateExModalOpen(false);

    if (targetPlanIdForEx && targetDayIdForEx) {
      addExerciseToPlanDay(targetPlanIdForEx, targetDayIdForEx, newEx);
    } else if (activeWorkout) {
      addExerciseToWorkout(newEx);
    }
  };

  // Helper to compute volume breakdown per muscle for a plan
  const getMuscleVolumeBreakdown = (plan: CustomWorkoutPlan) => {
    const counts: Record<string, number> = {};
    plan.days.forEach((day) => {
      day.exercises.forEach((ex) => {
        const m = ex.primaryMuscle || 'other';
        counts[m] = (counts[m] || 0) + (ex.sets || 3);
      });
    });
    return counts;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <Badge variant="emerald" className="mb-1">HYPERTROPHY PLATFORM</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">Workout Plan Management</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Create, customize, organize, and execute your personalized hypertrophy blueprints.
          </p>
        </div>

        {/* View Switcher: Plans vs Session Scratchpad */}
        <div className="p-1 rounded-2xl bg-zinc-900 border border-zinc-800 grid grid-cols-2 gap-1 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setPlannerTab('blueprints')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              plannerTab === 'blueprints'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>My Plans ({customPlans.filter((p) => p.status !== 'archived').length})</span>
          </button>

          <button
            onClick={() => setPlannerTab('scratchpad')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              plannerTab === 'scratchpad'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Live Scratchpad ({activeWorkout.exercises.length})</span>
          </button>
        </div>
      </div>

      {plannerTab === 'blueprints' ? (
        <div className="space-y-6">
          {/* Header Action Bar & Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-2xl">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === 'active'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                <span>Active Routine</span>
              </button>

              <button
                onClick={() => setFilterStatus('saved')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === 'saved'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60'
                }`}
              >
                Saved Plans ({activePlansList.filter((p) => p.status === 'saved').length})
              </button>

              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === 'all'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60'
                }`}
              >
                All ({activePlansList.length})
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJsonModalState({ isOpen: true, mode: 'import' })}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Import JSON
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsNewPlanModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5 text-zinc-950" />}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black"
              >
                Create New Plan
              </Button>
            </div>
          </div>

          {/* Featured Active Routine Card (If viewing active or all) */}
          {activePlan && (filterStatus === 'active' || filterStatus === 'all') && (
            <Card variant="glow" glowColor="rgba(16, 185, 129, 0.18)" className="p-6 space-y-5 border-emerald-500/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="emerald" className="flex items-center gap-1 text-[10px] uppercase font-bold">
                      <Star className="w-3 h-3 fill-current" /> Active Training Routine
                    </Badge>
                    {activePlan.isImportedFromTemplate && (
                      <Badge variant="purple" className="text-[10px]">Evidence-Based Copy</Badge>
                    )}
                    <span className="text-xs text-zinc-500 font-mono">
                      Updated {new Date(activePlan.updatedAt || activePlan.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-100">{activePlan.title}</h3>
                  <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                    {activePlan.description || 'Custom hypertrophy program structured for high mechanical tension and hypertrophy adaptation.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0 w-full lg:w-auto justify-center lg:justify-end">
                  <Button
                    variant="purple"
                    size="md"
                    onClick={() => setEditingPlanId(activePlan.id)}
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    className="font-bold bg-purple-600 hover:bg-purple-500 text-white min-h-[44px] justify-center"
                  >
                    Edit Blueprint
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => duplicateCustomPlan(activePlan.id)}
                    leftIcon={<Copy className="w-4 h-4" />}
                    title="Duplicate Blueprint"
                  >
                    Duplicate
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setJsonModalState({ isOpen: true, mode: 'export', plan: activePlan })}
                    leftIcon={<FileJson className="w-4 h-4" />}
                    title="Export JSON"
                  >
                    Export
                  </Button>
                </div>
              </div>

              {/* Weekly Split Days Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> Weekly Split Days ({activePlan.days.length})
                  </h4>

                  <span className="text-xs text-zinc-500 font-mono">
                    {activePlan.days.reduce((acc, d) => acc + d.exercises.length, 0)} Total Exercises
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activePlan.days.map((day, dIdx) => {
                    const dayEstMins = calculateCustomDayDurationMinutes(day.exercises);
                    return (
                      <div
                        key={day.id}
                        className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-3 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-purple-400 text-[11px] uppercase">
                              Day {dIdx + 1} • {day.scheduledDay}
                            </span>
                            <span className="text-[10px] text-purple-300 font-mono font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-purple-400" />
                              {formatDurationMinutes(dayEstMins)}
                            </span>
                          </div>

                        <h5 className="text-sm font-bold text-zinc-100">{day.name}</h5>

                        {day.exercises.length > 0 ? (
                          <div className="space-y-1 pt-1">
                            {day.exercises.slice(0, 4).map((ex, exIdx) => (
                              <div key={ex.id} className="text-[11px] text-zinc-400 flex items-center justify-between">
                                <span className="truncate">{exIdx + 1}. {ex.name}</span>
                                <span className="font-mono text-zinc-500 text-[10px]">{ex.sets}s × {ex.reps}</span>
                              </div>
                            ))}
                            {day.exercises.length > 4 && (
                              <div className="text-[10px] text-purple-400 font-medium italic">
                                +{day.exercises.length - 4} more exercises...
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-zinc-600 italic">No exercises added yet.</p>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full font-bold text-xs gap-1.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white"
                        onClick={() => startWorkoutFromPlanDay(activePlan.title, day)}
                        leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                      >
                        Start {day.name}
                      </Button>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Muscle Volume Breakdown Pills */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  Target Sets Breakdown:
                </span>
                {Object.entries(getMuscleVolumeBreakdown(activePlan)).map(([muscle, sets]) => (
                  <Badge key={muscle} variant="zinc" className="text-[10px] font-mono capitalize">
                    {muscle.replace('_', ' ')}: <strong className="text-purple-400 ml-1">{sets} sets</strong>
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* List of Saved Plans */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              {filterStatus === 'saved'
                ? 'Saved Custom Plans'
                : filterStatus === 'all'
                ? 'All Plans Library'
                : 'Other Saved Plans'}
            </h4>

            {filteredPlans.length === 0 ? (
              <Card className="p-8 text-center space-y-3 border-dashed border-zinc-800">
                <p className="text-sm font-bold text-zinc-400">No workout plans match the current filter.</p>
                <Button variant="primary" size="sm" onClick={() => setIsNewPlanModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white font-bold">
                  Create New Plan
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPlans.map((plan) => {
                  const isActive = plan.id === activePlan?.id || plan.status === 'active';
                  return (
                    <Card
                      key={plan.id}
                      className={`p-5 space-y-4 flex flex-col justify-between transition-all ${
                        isActive
                          ? 'border-purple-500/50 bg-purple-500/5'
                          : 'bg-zinc-900/80 border-zinc-800'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {isActive ? (
                                <Badge variant="purple" className="text-[10px]">Active Routine</Badge>
                              ) : (
                                <Badge variant="zinc" className="text-[10px]">{plan.goal || 'Custom'}</Badge>
                              )}
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {plan.daysPerWeek || plan.days.length} Days/Wk
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-zinc-100">{plan.title}</h4>
                          </div>

                          {!isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs font-bold shrink-0"
                              onClick={() => setActivePlan(plan.id)}
                            >
                              Set Active
                            </Button>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                          {plan.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500 font-mono">
                          <span>{plan.days.length} Days</span>
                          <span>•</span>
                          <span>{plan.days.reduce((acc, d) => acc + d.exercises.length, 0)} Total Exercises</span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPlanId(plan.id)}
                            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateCustomPlan(plan.id)}
                            leftIcon={<Copy className="w-3.5 h-3.5" />}
                            title="Duplicate Plan"
                          >
                            Duplicate
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setJsonModalState({ isOpen: true, mode: 'export', plan })}
                            leftIcon={<Printer className="w-3.5 h-3.5 text-purple-400" />}
                            title="Export Blueprint (PDF, JSON, Prompt, Note)"
                            className="text-purple-300 font-bold"
                          >
                            Export
                          </Button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteCustomPlan(plan.id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ACTIVE SESSION SCRATCHPAD TAB */
        <div className="space-y-6">
          <Card className="p-4 sm:p-6 bg-zinc-900/60 border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Live Workout Scratchpad</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Dynamically modify movements, reorder exercises, or insert extra work in your current session.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setTargetPlanIdForEx(null);
                  setTargetDayIdForEx(null);
                  setIsAddExModalOpen(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                Add Exercise
              </Button>
            </div>

            {/* Exercise Stack */}
            <div className="space-y-3 pt-2">
              {activeWorkout.exercises.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                  No exercises in active workout scratchpad. Click 'Add Exercise' above.
                </div>
              ) : (
                activeWorkout.exercises.map((pe, index) => (
                  <Card key={pe.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-zinc-800 bg-zinc-950">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col gap-1 text-zinc-400 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => reorderExercises(index, index - 1)}
                          className="p-1 rounded bg-zinc-800 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={index === activeWorkout.exercises.length - 1}
                          onClick={() => reorderExercises(index, index + 1)}
                          className="p-1 rounded bg-zinc-800 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-zinc-100 truncate">{pe.exercise.name}</h4>
                          <Badge variant="tier">{pe.exercise.hypertrophyTier}</Badge>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 font-mono capitalize">
                          {pe.sets.length} Sets • {pe.exercise.primaryMuscle.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addExerciseToWorkout(pe.exercise)}
                        leftIcon={<Copy className="w-3.5 h-3.5" />}
                      >
                        Duplicate
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeExerciseFromWorkout(pe.id)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: Plan Editor Modal */}
      {editingPlan && (
        <PlanEditorModal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlanId(null)}
          plan={editingPlan}
          onOpenExerciseSelector={(dayId) => {
            setTargetPlanIdForEx(editingPlan.id);
            setTargetDayIdForEx(dayId);
            setIsAddExModalOpen(true);
          }}
        />
      )}

      {/* MODAL 2: Create New Plan Modal */}
      <BottomSheet
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        title="Create Hypertrophy Workout Plan"
        subtitle="Specify routine title, goal, and weekly frequency"
      >
        <form onSubmit={handleCreatePlanSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Plan Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 5 Day Upper/Lower Aesthetic Hypertrophy"
              value={newPlanTitle}
              onChange={(e) => setNewPlanTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Primary Goal Focus
              </label>
              <select
                value={newPlanGoal}
                onChange={(e) => setNewPlanGoal(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Muscle Hypertrophy & Density">Muscle Hypertrophy & Density</option>
                <option value="Aesthetic Proportion & V-Taper">Aesthetic Proportion & V-Taper</option>
                <option value="Push / Pull / Legs Split">Push / Pull / Legs Split</option>
                <option value="Upper / Lower High Frequency">Upper / Lower High Frequency</option>
                <option value="Strength & Mass">Strength & Mass</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Days Per Week
              </label>
              <select
                value={newPlanDaysCount}
                onChange={(e) => setNewPlanDaysCount(parseInt(e.target.value))}
                className="w-full px-3 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>{n} Days / Week</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Description & Strategy
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Focus on arm & shoulder hypertrophy with 2x frequency per week."
              value={newPlanDescription}
              onChange={(e) => setNewPlanDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <Button variant="primary" size="lg" type="submit" className="w-full font-bold bg-purple-600 hover:bg-purple-500 text-white">
            Create & Open Plan Editor
          </Button>
        </form>
      </BottomSheet>

      {/* MODAL 3: JSON Import/Export Modal */}
      <PlanJSONModal
        isOpen={jsonModalState.isOpen}
        onClose={() => setJsonModalState({ isOpen: false, mode: 'export' })}
        mode={jsonModalState.mode}
        planToExport={jsonModalState.plan}
      />

      {/* MODAL 4: Select Exercise from Library */}
      <BottomSheet
        isOpen={isAddExModalOpen}
        onClose={() => {
          setIsAddExModalOpen(false);
          setTargetDayIdForEx(null);
          setTargetPlanIdForEx(null);
        }}
        title="Exercise Selector"
        subtitle="Choose an exercise to add to your plan day"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search exercise by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setMuscleFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                muscleFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {ALL_MUSCLE_GROUPS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMuscleFilter(m.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  muscleFilter === m.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateExModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="w-full text-xs font-bold"
          >
            + Create Custom Exercise
          </Button>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {filteredLibrary.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    {ex.name}
                    <Badge variant="tier">{ex.hypertrophyTier}</Badge>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 capitalize">
                    {ex.primaryMuscle.replace('_', ' ')} • {ex.equipment}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (targetPlanIdForEx && targetDayIdForEx) {
                      addExerciseToPlanDay(targetPlanIdForEx, targetDayIdForEx, ex);
                    } else {
                      addExerciseToWorkout(ex);
                    }
                    setIsAddExModalOpen(false);
                  }}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* MODAL 5: Create Custom Exercise */}
      <BottomSheet
        isOpen={isCreateExModalOpen}
        onClose={() => setIsCreateExModalOpen(false)}
        title="Create Custom Exercise"
        subtitle="Add a custom movement or machine to your personal database"
      >
        <form onSubmit={handleCreateCustomExerciseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Exercise Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Incline Dual-Cable Fly (30 Deg)"
              value={customExName}
              onChange={(e) => setCustomExName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Primary Muscle
              </label>
              <select
                value={customExMuscle}
                onChange={(e) => setCustomExMuscle(e.target.value as MuscleGroup)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                {ALL_MUSCLE_GROUPS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Equipment
              </label>
              <input
                type="text"
                placeholder="e.g., cable, dumbbell"
                value={customExEquipment}
                onChange={(e) => setCustomExEquipment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Form Cue / Execution Note
            </label>
            <input
              type="text"
              placeholder="e.g., Keep scapula depressed, wrap elbows across chest."
              value={customExCue}
              onChange={(e) => setCustomExCue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <Button variant="primary" size="lg" type="submit" className="w-full font-bold bg-purple-600 hover:bg-purple-500 text-white">
            Save Custom Exercise
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
};
