import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Save, 
  Check, 
  Dumbbell, 
  Target, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CustomWorkoutPlan, CustomWorkoutDay, CustomWorkoutExercise } from '../../types';
import { useIronPathStore } from '../../store/useIronPathStore';
import { ExerciseSwapModal } from './ExerciseSwapModal';

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CustomWorkoutPlan;
  onOpenExerciseSelector: (dayId: string) => void;
}

export const PlanEditorModal: React.FC<PlanEditorModalProps> = ({
  isOpen,
  onClose,
  plan,
  onOpenExerciseSelector
}) => {
  const updateCustomPlan = useIronPathStore((s) => s.updateCustomPlan);
  const addDayToPlan = useIronPathStore((s) => s.addDayToPlan);
  const updatePlanDay = useIronPathStore((s) => s.updatePlanDay);
  const deletePlanDay = useIronPathStore((s) => s.deletePlanDay);
  const duplicatePlanDay = useIronPathStore((s) => s.duplicatePlanDay);
  const reorderPlanDays = useIronPathStore((s) => s.reorderPlanDays);
  
  const updatePlanExercise = useIronPathStore((s) => s.updatePlanExercise);
  const deletePlanExercise = useIronPathStore((s) => s.deletePlanExercise);
  const duplicatePlanExercise = useIronPathStore((s) => s.duplicatePlanExercise);
  const reorderPlanExercises = useIronPathStore((s) => s.reorderPlanExercises);

  // Form State
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description || '');
  const [goal, setGoal] = useState(plan.goal || 'Muscle Hypertrophy & Density');
  const [notes, setNotes] = useState(plan.notes || '');
  const [daysPerWeek, setDaysPerWeek] = useState(plan.daysPerWeek || plan.days.length || 3);

  // New Day Inline
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayScheduled, setNewDayScheduled] = useState('Monday');

  // Exercise Swap Modal State
  const [swapTarget, setSwapTarget] = useState<{ dayId: string; ex: CustomWorkoutExercise } | null>(null);

  // Expanded Day Accordion State
  const [expandedDayId, setExpandedDayId] = useState<string | null>(plan.days[0]?.id || null);

  const handleSaveOverview = () => {
    updateCustomPlan(plan.id, {
      title,
      description,
      goal,
      notes,
      daysPerWeek
    });
  };

  const handleAddDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayTitle.trim()) return;
    addDayToPlan(plan.id, newDayTitle, newDayScheduled);
    setNewDayTitle('');
    setIsAddingDay(false);
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={`Custom Blueprint Builder`}
        subtitle={`Managing plan structure, training days, and exercises`}
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1 scrollbar-thin">
          {/* Plan Overview Inputs */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Plan Overview
              </span>
              <Button variant="ghost" size="sm" onClick={handleSaveOverview} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Info
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSaveOverview}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => {
                      setGoal(e.target.value);
                      updateCustomPlan(plan.id, { goal: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Muscle Hypertrophy & Density">Muscle Hypertrophy & Density</option>
                    <option value="Aesthetic Proportion & V-Taper">Aesthetic Proportion & V-Taper</option>
                    <option value="Push / Pull / Legs Hypertrophy">Push / Pull / Legs Hypertrophy</option>
                    <option value="Upper / Lower High Frequency">Upper / Lower High Frequency</option>
                    <option value="Strength & Powerbuilding">Strength & Powerbuilding</option>
                    <option value="Custom Specialty Focus">Custom Specialty Focus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Target Frequency
                  </label>
                  <select
                    value={daysPerWeek}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDaysPerWeek(val);
                      updateCustomPlan(plan.id, { daysPerWeek: val });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>
                        {num} Days / Week
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description / Strategy Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSaveOverview}
                  placeholder="Notes on volume progression, deload frequency, or specific muscle priorities..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Days Accordion Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-purple-400" /> Training Days ({plan.days.length})
              </h4>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddingDay(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                Add Training Day
              </Button>
            </div>

            {/* Inline Form to Add Day */}
            {isAddingDay && (
              <form onSubmit={handleAddDaySubmit} className="p-4 rounded-2xl bg-zinc-950 border border-purple-500/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Day Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Day 4: Quads & Side Delts"
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Scheduled Day</label>
                    <select
                      value={newDayScheduled}
                      onChange={(e) => setNewDayScheduled(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Unscheduled'].map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingDay(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold">
                    Add Day
                  </Button>
                </div>
              </form>
            )}

            {/* List of Days */}
            <div className="space-y-3">
              {plan.days.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                  No training days in this plan yet. Click "Add Training Day" above.
                </div>
              ) : (
                plan.days.map((day, dIdx) => {
                  const isExpanded = expandedDayId === day.id;
                  return (
                    <div
                      key={day.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden transition-all"
                    >
                      {/* Day Bar Header */}
                      <div
                        onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            D{dIdx + 1}
                          </span>
                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-zinc-100 truncate">{day.name}</h5>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              {day.scheduledDay} • {day.exercises.length} Exercises
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={dIdx === 0}
                            onClick={() => reorderPlanDays(plan.id, dIdx, dIdx - 1)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-20 transition-colors"
                            title="Move Day Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            disabled={dIdx === plan.days.length - 1}
                            onClick={() => reorderPlanDays(plan.id, dIdx, dIdx + 1)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-20 transition-colors"
                            title="Move Day Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => duplicatePlanDay(plan.id, day.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            title="Duplicate Day"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deletePlanDay(plan.id, day.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400 ml-1" /> : <ChevronDown className="w-4 h-4 text-zinc-400 ml-1" />}
                        </div>
                      </div>

                      {/* Day Expanded Details */}
                      {isExpanded && (
                        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 space-y-4">
                          {/* Inline Day Settings */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Rename Day</label>
                              <input
                                type="text"
                                value={day.name}
                                onChange={(e) => updatePlanDay(plan.id, day.id, { name: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Scheduled Day</label>
                              <select
                                value={day.scheduledDay}
                                onChange={(e) => updatePlanDay(plan.id, day.id, { scheduledDay: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                              >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Unscheduled'].map((sd) => (
                                  <option key={sd} value={sd}>{sd}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Day Exercises List */}
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                Exercises Sequence
                              </span>

                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => onOpenExerciseSelector(day.id)}
                                leftIcon={<Plus className="w-3.5 h-3.5" />}
                              >
                                Add Exercise
                              </Button>
                            </div>

                            {day.exercises.length === 0 ? (
                              <div className="p-4 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                                No exercises added yet. Click "+ Add Exercise" to choose from exercise library.
                              </div>
                            ) : (
                              day.exercises.map((cEx, eIdx) => (
                                <div
                                  key={cEx.id}
                                  className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-3"
                                >
                                  {/* Exercise Header */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center font-mono font-bold text-[10px] text-purple-400 shrink-0">
                                        {eIdx + 1}
                                      </span>
                                      <div className="min-w-0">
                                        <h6 className="text-xs font-bold text-zinc-100 truncate">{cEx.name}</h6>
                                        <p className="text-[10px] text-zinc-400 font-mono capitalize">
                                          {cEx.primaryMuscle.replace('_', ' ')} • {cEx.equipment}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => setSwapTarget({ dayId: day.id, ex: cEx })}
                                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-400 transition-colors"
                                        title="Swap Exercise"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                      </button>

                                      <button
                                        onClick={() => duplicatePlanExercise(plan.id, day.id, cEx.id)}
                                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                        title="Duplicate Exercise"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>

                                      <button
                                        disabled={eIdx === 0}
                                        onClick={() => reorderPlanExercises(plan.id, day.id, eIdx, eIdx - 1)}
                                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-20 transition-colors"
                                        title="Move Up"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>

                                      <button
                                        disabled={eIdx === day.exercises.length - 1}
                                        onClick={() => reorderPlanExercises(plan.id, day.id, eIdx, eIdx + 1)}
                                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-20 transition-colors"
                                        title="Move Down"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>

                                      <button
                                        onClick={() => deletePlanExercise(plan.id, day.id, cEx.id)}
                                        className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Delete Exercise"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Exercise Prescription Parameters Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-zinc-800/60">
                                    <div>
                                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-0.5">Sets</label>
                                      <input
                                        type="number"
                                        min={1}
                                        max={15}
                                        value={cEx.sets}
                                        onChange={(e) => updatePlanExercise(plan.id, day.id, cEx.id, { sets: Math.max(1, parseInt(e.target.value) || 1) })}
                                        className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-purple-400 focus:outline-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-0.5">Rep Target</label>
                                      <input
                                        type="text"
                                        value={cEx.reps}
                                        onChange={(e) => updatePlanExercise(plan.id, day.id, cEx.id, { reps: e.target.value })}
                                        className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-100 focus:outline-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-0.5">Rest (sec)</label>
                                      <input
                                        type="number"
                                        step={15}
                                        value={cEx.restSeconds}
                                        onChange={(e) => updatePlanExercise(plan.id, day.id, cEx.id, { restSeconds: parseInt(e.target.value) || 90 })}
                                        className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-0.5">Target RIR</label>
                                      <input
                                        type="number"
                                        min={0}
                                        max={4}
                                        value={cEx.targetRIR ?? 1}
                                        onChange={(e) => updatePlanExercise(plan.id, day.id, cEx.id, { targetRIR: parseInt(e.target.value) ?? 1 })}
                                        className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-100 focus:outline-none"
                                      />
                                    </div>
                                  </div>

                                  {/* Cues / Execution Note Input */}
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Custom execution cue (e.g., Pause 2s at peak stretch)..."
                                      value={cEx.notes || ''}
                                      onChange={(e) => updatePlanExercise(plan.id, day.id, cEx.id, { notes: e.target.value })}
                                      className="w-full px-2.5 py-1 rounded bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-300 focus:outline-none focus:border-purple-500"
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="w-full font-bold gap-2 mt-4 bg-purple-600 hover:bg-purple-500 text-white"
            leftIcon={<Check className="w-4 h-4" />}
          >
            Done Editing Blueprint
          </Button>
        </div>
      </BottomSheet>

      {/* Exercise Swap Sub-Modal */}
      {swapTarget && (
        <ExerciseSwapModal
          isOpen={!!swapTarget}
          onClose={() => setSwapTarget(null)}
          planId={plan.id}
          dayId={swapTarget.dayId}
          currentExercise={swapTarget.ex}
        />
      )}
    </>
  );
};
