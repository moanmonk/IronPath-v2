import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Trophy, 
  Scale, 
  Activity, 
  Plus, 
  Ruler, 
  Trash2, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  Flame,
  Info,
  History,
  Dumbbell,
  Clock,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Zap,
  Check,
  AlertTriangle,
  Layers,
  HeartPulse,
  Award,
  BarChart2
} from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { BodyMeasurementEntry, PersonalRecord, ALL_MUSCLE_GROUPS, MuscleGroup } from '../../types';
import { ProgressCharts } from './ProgressCharts';

export const ProgressView: React.FC = () => {
  const personalRecords = useIronPathStore((s) => s.personalRecords);
  const recoveryList = useIronPathStore((s) => s.recoveryList);
  const bodyMeasurements = useIronPathStore((s) => s.bodyMeasurements);
  const workoutHistory = useIronPathStore((s) => s.workoutHistory);
  const exercisesLibrary = useIronPathStore((s) => s.exercisesLibrary);
  const customPlans = useIronPathStore((s) => s.customPlans);
  const activePlanId = useIronPathStore((s) => s.activePlanId);

  const activePlan = customPlans.find((p) => p.id === activePlanId) || customPlans[0];
  
  const addBodyMeasurement = useIronPathStore((s) => s.addBodyMeasurement);
  const deleteBodyMeasurement = useIronPathStore((s) => s.deleteBodyMeasurement);
  const clearWorkoutHistory = useIronPathStore((s) => s.clearWorkoutHistory);
  const deleteWorkoutSession = useIronPathStore((s) => s.deleteWorkoutSession);
  const clearPersonalRecords = useIronPathStore((s) => s.clearPersonalRecords);
  const deletePersonalRecord = useIronPathStore((s) => s.deletePersonalRecord);
  const addPersonalRecord = useIronPathStore((s) => s.addPersonalRecord);
  const resetAllHistoryAndPRs = useIronPathStore((s) => s.resetAllHistoryAndPRs);
  const setActiveMainTab = useIronPathStore((s) => s.setActiveTab);

  const [activeSubTab, setActiveSubTab] = useState<'history' | 'prs' | 'measurements' | 'analytics'>('history');
  const [volumeFilter, setVolumeFilter] = useState<'all' | 'optimal' | 'maintenance' | 'excessive' | 'neglected'>('all');
  
  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddPRModalOpen, setIsAddPRModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Measurement Form State
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formWeight, setFormWeight] = useState<string>('');
  const [formChest, setFormChest] = useState<string>('');
  const [formWaist, setFormWaist] = useState<string>('');
  const [formArms, setFormArms] = useState<string>('');
  const [formShoulders, setFormShoulders] = useState<string>('');
  const [formHips, setFormHips] = useState<string>('');
  const [formThighs, setFormThighs] = useState<string>('');
  const [formBodyFat, setFormBodyFat] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  // PR Form State
  const [prExerciseId, setPrExerciseId] = useState<string>(exercisesLibrary[0]?.id || '');
  const [prWeight, setPrWeight] = useState<string>('');
  const [prReps, setPrReps] = useState<string>('');
  const [prDate, setPrDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const latestMeasurement = bodyMeasurements.length > 0 ? bodyMeasurements[0] : null;
  const previousMeasurement = bodyMeasurements.length > 1 ? bodyMeasurements[1] : null;

  // Active Plan Volume Calculation per Muscle Group
  const activePlanVolumeMap = useMemo(() => {
    const map: Record<MuscleGroup, { totalSets: number; exercises: { name: string; sets: number; dayName: string }[] }> = {
      chest: { totalSets: 0, exercises: [] },
      side_delts: { totalSets: 0, exercises: [] },
      front_delts: { totalSets: 0, exercises: [] },
      rear_delts: { totalSets: 0, exercises: [] },
      lats: { totalSets: 0, exercises: [] },
      upper_back: { totalSets: 0, exercises: [] },
      biceps: { totalSets: 0, exercises: [] },
      triceps: { totalSets: 0, exercises: [] },
      forearms: { totalSets: 0, exercises: [] },
      quads: { totalSets: 0, exercises: [] },
      hamstrings: { totalSets: 0, exercises: [] },
      glutes: { totalSets: 0, exercises: [] },
      calves: { totalSets: 0, exercises: [] },
      abs: { totalSets: 0, exercises: [] },
    };

    if (activePlan?.days) {
      activePlan.days.forEach((day) => {
        day.exercises.forEach((ex) => {
          const m = ex.primaryMuscle || 'chest';
          if (map[m]) {
            map[m].totalSets += ex.sets;
            map[m].exercises.push({
              name: ex.name,
              sets: ex.sets,
              dayName: day.name,
            });
          }
        });
      });
    }

    return map;
  }, [activePlan]);

  // Active Plan Muscle Analysis (Recovery & Volume Level)
  const activePlanMuscleAnalysis = useMemo(() => {
    return ALL_MUSCLE_GROUPS.map((m) => {
      const vol = activePlanVolumeMap[m.id];
      const totalSets = vol ? vol.totalSets : 0;

      // Find the latest completed workout session that trained this muscle group
      let lastTrainedDate: Date | null = null;

      for (const session of workoutHistory) {
        if (session.date) {
          const sessDate = new Date(session.date);
          const hasMuscle =
            session.exercises?.some((e) => e.exercise.primaryMuscle === m.id) ||
            session.focusMuscles?.some((f) => f.toLowerCase().includes(m.label.toLowerCase()) || f.toLowerCase().includes(m.id.replace('_', ' ')));
          if (hasMuscle) {
            if (!lastTrainedDate || sessDate > lastTrainedDate) {
              lastTrainedDate = sessDate;
            }
          }
        }
      }

      let hoursSince = 96; // Default fully recovered
      let daysAgoStr = 'Ready / Rested';

      if (lastTrainedDate) {
        const diffMs = Date.now() - lastTrainedDate.getTime();
        hoursSince = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
        const days = Math.floor(hoursSince / 24);
        daysAgoStr = days === 0 ? `${hoursSince}h ago` : `${days}d ago (${hoursSince}h)`;
      }

      // Determine recovery status & percentage based on hoursSince
      let recoveryPct = 100;
      let recoveryStatus: 'optimal' | 'recovering' | 'fatigued' = 'optimal';

      if (hoursSince < 24) {
        recoveryPct = Math.min(60, Math.max(30, Math.round(hoursSince * 2.5)));
        recoveryStatus = 'fatigued';
      } else if (hoursSince < 48) {
        recoveryPct = Math.min(88, Math.round(60 + (hoursSince - 24) * 1.15));
        recoveryStatus = 'recovering';
      } else {
        recoveryPct = 100;
        recoveryStatus = 'optimal';
      }

      // Classify Volume Level
      let volumeLevel: 'neglected' | 'maintenance' | 'optimal' | 'excessive' = 'optimal';
      let volumeBadgeLabel = 'Optimal Volume';
      let volumeBadgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      let recommendation = 'Great stimulus! Programmed volume is in the MAV sweet spot (7–18 sets/week).';

      if (totalSets === 0) {
        volumeLevel = 'neglected';
        volumeBadgeLabel = '0 Sets (Neglected)';
        volumeBadgeStyle = 'bg-zinc-800/80 text-zinc-400 border-zinc-700/80';
        recommendation = 'No direct exercises in active plan. Consider adding 4-8 sets for balanced muscle growth.';
      } else if (totalSets <= 6) {
        volumeLevel = 'maintenance';
        volumeBadgeLabel = 'Maintenance Level';
        volumeBadgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        recommendation = 'Preserves current muscle mass, but below optimal adaptive volume (7+ sets/wk) for hypertrophy.';
      } else if (totalSets <= 18) {
        volumeLevel = 'optimal';
        volumeBadgeLabel = 'Optimal Volume';
        volumeBadgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        recommendation = 'Ideal volume (7–18 sets/wk). Drives strong muscle growth with manageable recovery demands.';
      } else {
        volumeLevel = 'excessive';
        volumeBadgeLabel = 'Excessive Volume';
        volumeBadgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        recommendation = 'Exceeds 18-set MRV threshold. High systemic fatigue risk; consider lowering sets to avoid overtraining.';
      }

      return {
        id: m.id,
        label: m.label,
        totalWeeklySets: totalSets,
        exercises: vol ? vol.exercises : [],
        hoursSinceLastTrained: hoursSince,
        daysAgoStr,
        recoveryPercentage: recoveryPct,
        recoveryStatus,
        volumeLevel,
        volumeBadgeLabel,
        volumeBadgeStyle,
        recommendation,
      };
    });
  }, [activePlanVolumeMap, workoutHistory]);

  const volumeCounts = useMemo(() => {
    let optimal = 0;
    let maintenance = 0;
    let excessive = 0;
    let neglected = 0;

    activePlanMuscleAnalysis.forEach((m) => {
      if (m.volumeLevel === 'optimal') optimal++;
      else if (m.volumeLevel === 'maintenance') maintenance++;
      else if (m.volumeLevel === 'excessive') excessive++;
      else if (m.volumeLevel === 'neglected') neglected++;
    });

    return { optimal, maintenance, excessive, neglected, total: activePlanMuscleAnalysis.length };
  }, [activePlanMuscleAnalysis]);

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWeight && !formChest && !formWaist && !formArms && !formShoulders) {
      alert('Please enter at least one measurement or weight value.');
      return;
    }

    addBodyMeasurement({
      date: formDate || new Date().toISOString().split('T')[0],
      weightKg: formWeight ? parseFloat(formWeight) : undefined,
      chestCm: formChest ? parseFloat(formChest) : undefined,
      waistCm: formWaist ? parseFloat(formWaist) : undefined,
      armsCm: formArms ? parseFloat(formArms) : undefined,
      shouldersCm: formShoulders ? parseFloat(formShoulders) : undefined,
      hipsCm: formHips ? parseFloat(formHips) : undefined,
      thighsCm: formThighs ? parseFloat(formThighs) : undefined,
      bodyFatPercentage: formBodyFat ? parseFloat(formBodyFat) : undefined,
      notes: formNotes ? formNotes.trim() : undefined
    });

    // Reset Form
    setFormWeight('');
    setFormChest('');
    setFormWaist('');
    setFormArms('');
    setFormShoulders('');
    setFormHips('');
    setFormThighs('');
    setFormBodyFat('');
    setFormNotes('');
    setIsLogModalOpen(false);
  };

  const handleSavePR = (e: React.FormEvent) => {
    e.preventDefault();
    const selEx = exercisesLibrary.find((e) => e.id === prExerciseId) || exercisesLibrary[0];
    if (!selEx || !prWeight || !prReps) {
      alert('Please select an exercise, weight, and reps.');
      return;
    }

    const w = parseFloat(prWeight);
    const r = parseInt(prReps);
    const e1rm = Math.round((w * (1 + r / 30)) * 10) / 10;

    addPersonalRecord({
      exerciseName: selEx.name,
      muscle: selEx.primaryMuscle,
      weight: w,
      reps: r,
      estimated1RM: e1rm,
      date: prDate || new Date().toISOString().split('T')[0],
      isRecent: true
    });

    setPrWeight('');
    setPrReps('');
    setIsAddPRModalOpen(false);
  };

  // Calculate stats
  const totalVolumeInHistory = workoutHistory.reduce((sum, session) => sum + (session.totalVolumeKg || 0), 0);
  const totalDurationSeconds = workoutHistory.reduce((sum, session) => sum + (session.durationSeconds || 0), 0);
  const totalDurationMinutes = Math.round(totalDurationSeconds / 60);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" className="mb-1">PROGRESSION & HISTORY</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">Workout History & Body Stats</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track your workout logs, personal records, body measurements, weight, and muscle group volume overload.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              setActiveSubTab('measurements');
              setIsLogModalOpen(true);
            }}
            leftIcon={<Ruler className="w-4 h-4 shrink-0 text-blue-400" />}
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm"
          >
            Log Body Stats
          </Button>

          {activeSubTab === 'prs' && (
            <Button
              variant="primary"
              onClick={() => setIsAddPRModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4 shrink-0 text-zinc-950" />}
              className="bg-purple-500 hover:bg-purple-400 text-zinc-950 font-black shadow-lg shadow-purple-500/20 px-4 py-2 rounded-xl text-xs sm:text-sm"
            >
              Log PR Manually
            </Button>
          )}

          {(workoutHistory.length > 0 || personalRecords.length > 0) && (
            <Button
              variant="outline"
              onClick={() => setIsResetConfirmOpen(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 shrink-0 text-rose-400" />}
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs px-3 py-2 rounded-xl"
            >
              Clear History & PRs
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-zinc-800/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'history'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <History className="w-4 h-4 text-emerald-400" />
          Workout History ({workoutHistory.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('prs')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'prs'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Trophy className="w-4 h-4 text-purple-400" />
          Personal Records ({personalRecords.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('measurements')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'measurements'
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Ruler className="w-4 h-4 text-blue-400" />
          Body Stats & Measurements ({bodyMeasurements.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('analytics')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'analytics'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          Active Plan Recovery & Volume Level
        </button>
      </div>

      {/* SUB-TAB 1: WORKOUT HISTORY LOGS */}
      {activeSubTab === 'history' && (
        <div className="space-y-5">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 bg-zinc-900/80 border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Sessions Logged</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">{workoutHistory.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <History className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Volume Logged</span>
                <div className="text-2xl font-black text-purple-400 mt-0.5">{totalVolumeInHistory.toLocaleString()} kg</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Dumbbell className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Most Recent Session</span>
                <div className="text-sm font-black text-zinc-100 truncate mt-1">
                  {workoutHistory.length > 0 ? workoutHistory[0].title : 'No sessions logged'}
                </div>
                <div className="text-[10px] text-zinc-500">{workoutHistory.length > 0 ? workoutHistory[0].date : 'Log your first workout'}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {workoutHistory.length === 0 ? (
            <Card className="p-8 text-center space-y-4 bg-zinc-900/80 border-zinc-800">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <History className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-black text-zinc-100">No Workout Logs Yet</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every exercise set you log in Today's Workout will immediately show up here in real time.
                </p>
              </div>
              <div>
                <Button
                  onClick={() => setActiveMainTab('train')}
                  variant="primary"
                  leftIcon={<Dumbbell className="w-4 h-4 text-zinc-950" />}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-md shadow-emerald-500/20 px-5 py-2 rounded-xl text-xs"
                >
                  Go to Today's Workout
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Logged Workout Sessions ({workoutHistory.length})
                </h3>
                <button
                  type="button"
                  onClick={clearWorkoutHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear History
                </button>
              </div>

              <div className="space-y-3">
                {workoutHistory.map((session) => (
                  <Card key={session.id} className="p-4 bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-zinc-100 text-base">{session.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                            {session.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-black text-emerald-400 font-mono">
                            {(session.totalVolumeKg || 0).toLocaleString()} kg
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {session.exercises?.length || 0} exercises
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteWorkoutSession(session.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer"
                          title="Delete session log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Exercises Performed */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {session.exercises?.map((pe, idx) => {
                        const completedSets = pe.sets?.filter((s) => s.completed) || [];
                        const warmupSets = completedSets.filter((s) => s.type === 'warmup');
                        const workingSets = completedSets.filter((s) => s.type !== 'warmup');

                        return (
                          <div key={pe.id || idx} className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/60 text-xs space-y-1.5">
                            <div className="flex items-center justify-between font-bold text-zinc-200">
                              <span className="truncate">{pe.exercise.name}</span>
                              <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                                {workingSets.length} working set{workingSets.length === 1 ? '' : 's'}
                              </span>
                            </div>

                            {pe.swappedFrom && (
                              <div className="text-[10px] font-mono font-bold text-purple-400">
                                🔄 Swapped from {pe.swappedFrom}
                              </div>
                            )}

                            {/* Warmup Sets Section */}
                            {warmupSets.length > 0 && (
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                                  Warmup Sets ({warmupSets.length}):
                                </span>
                                <div className="text-[10px] text-amber-200 font-mono flex flex-wrap gap-1">
                                  {warmupSets.map((s) => (
                                    <span key={s.id} className="bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
                                      {s.weight}kg × {s.reps}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Working Sets Section */}
                            {workingSets.length > 0 && (
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                                  Working Sets ({workingSets.length}):
                                </span>
                                <div className="text-[11px] text-zinc-300 font-mono flex flex-wrap gap-1">
                                  {workingSets.map((s) => (
                                    <span key={s.id} className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 font-bold text-zinc-200">
                                      {s.weight}kg × {s.reps}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {completedSets.length === 0 && (
                              <span className="text-zinc-600 italic text-[10px] block">No sets logged</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PERSONAL RECORDS (PRS) */}
      {activeSubTab === 'prs' && (
        <div className="space-y-5">
          {/* PR Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 bg-zinc-900/80 border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total PRs</span>
                <div className="text-2xl font-black text-purple-400 mt-0.5">{personalRecords.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Trophy className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Max Working Weight</span>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  {personalRecords.length > 0 ? `${Math.max(...personalRecords.map((p) => p.weight))} kg` : '--'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Flame className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Highest Est. 1RM</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  {personalRecords.length > 0 ? `${Math.max(...personalRecords.map((p) => p.estimated1RM))} kg` : '--'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {personalRecords.length === 0 ? (
            <Card className="p-8 text-center space-y-4 bg-zinc-900/80 border-zinc-800">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-black text-zinc-100">No Personal Records Logged</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  As you log completed working sets, any new max weight or 1RM automatically records here. You can also manually add your PRs below.
                </p>
              </div>
              <div>
                <Button
                  onClick={() => setIsAddPRModalOpen(true)}
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4 text-zinc-950" />}
                  className="bg-purple-500 hover:bg-purple-400 text-zinc-950 font-black shadow-md shadow-purple-500/20 px-4 py-2 rounded-xl text-xs"
                >
                  Log PR Manually
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  Personal Records List ({personalRecords.length})
                </h3>
                <button
                  type="button"
                  onClick={clearPersonalRecords}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear PRs
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {personalRecords.map((pr) => (
                  <Card key={pr.id} className="p-3.5 bg-zinc-900/90 border-zinc-800/80 hover:border-purple-500/40 transition-all space-y-2.5">
                    <div className="flex items-start justify-between gap-2 border-b border-zinc-800/60 pb-2">
                      <div>
                        <Badge variant="purple" className="text-[9px] font-mono uppercase px-1.5 py-0.5">
                          {pr.muscle.replace('_', ' ')}
                        </Badge>
                        <h4 className="font-black text-zinc-100 text-sm mt-0.5 leading-snug">{pr.exerciseName}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => deletePersonalRecord(pr.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-all cursor-pointer"
                        title="Delete PR"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-zinc-950/70 p-2 rounded-xl border border-zinc-800/60 font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-zinc-500 block uppercase font-sans">Max Weight</span>
                        <span className="text-base font-black text-purple-300">{pr.weight} kg</span>
                        <span className="text-[10px] text-zinc-400 block">{pr.reps} reps</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block uppercase font-sans">Est. 1RM</span>
                        <span className="text-base font-black text-emerald-400">{pr.estimated1RM} kg</span>
                        <span className="text-[10px] text-zinc-500 block">{pr.date}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: BODY MEASUREMENTS & WEIGHT */}
      {activeSubTab === 'measurements' && (
        <div className="space-y-6">
          {/* Key Latest Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-purple-400" /> Body Weight
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.weightKg ? `${latestMeasurement.weightKg} kg` : '--'}
              </div>
              {previousMeasurement?.weightKg && latestMeasurement?.weightKg && (
                <p className="text-[11px] text-zinc-400 font-mono">
                  {latestMeasurement.weightKg - previousMeasurement.weightKg > 0 ? '+' : ''}
                  {(latestMeasurement.weightKg - previousMeasurement.weightKg).toFixed(1)} kg vs prev
                </p>
              )}
            </Card>

            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-purple-400" /> Chest
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.chestCm ? `${latestMeasurement.chestCm} cm` : '--'}
              </div>
              {previousMeasurement?.chestCm && latestMeasurement?.chestCm && (
                <p className="text-[11px] text-zinc-400 font-mono">
                  {latestMeasurement.chestCm - previousMeasurement.chestCm > 0 ? '+' : ''}
                  {(latestMeasurement.chestCm - previousMeasurement.chestCm).toFixed(1)} cm
                </p>
              )}
            </Card>

            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-purple-400" /> Waist
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.waistCm ? `${latestMeasurement.waistCm} cm` : '--'}
              </div>
              {previousMeasurement?.waistCm && latestMeasurement?.waistCm && (
                <p className="text-[11px] text-zinc-400 font-mono">
                  {latestMeasurement.waistCm - previousMeasurement.waistCm > 0 ? '+' : ''}
                  {(latestMeasurement.waistCm - previousMeasurement.waistCm).toFixed(1)} cm
                </p>
              )}
            </Card>

            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-purple-400" /> Arms
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.armsCm ? `${latestMeasurement.armsCm} cm` : '--'}
              </div>
              {previousMeasurement?.armsCm && latestMeasurement?.armsCm && (
                <p className="text-[11px] text-zinc-400 font-mono">
                  {latestMeasurement.armsCm - previousMeasurement.armsCm > 0 ? '+' : ''}
                  {(latestMeasurement.armsCm - previousMeasurement.armsCm).toFixed(1)} cm
                </p>
              )}
            </Card>
          </div>

          {/* Body Measurements Log Table / Cards */}
          <Card className="p-4 sm:p-6 space-y-4 bg-zinc-900/90 border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-100 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-purple-400 shrink-0" />
                  Body Circumferences & Weight History
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Consistent bi-weekly measurements provide clear feedback on muscular hypertrophy vs fat mass changes.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsLogModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5 text-purple-400" />}
                className="text-xs self-start sm:self-auto border-zinc-700 text-zinc-200 hover:bg-zinc-800"
              >
                New Entry
              </Button>
            </div>

            {bodyMeasurements.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 space-y-2">
                <p className="text-sm font-bold">No body measurement logs recorded yet.</p>
                <p className="text-xs">Click "Log Measurements" to start tracking your physique circumferences!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bodyMeasurements.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-zinc-800/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-bold text-zinc-200">{entry.date}</span>
                      </div>
                      <button
                        onClick={() => deleteBodyMeasurement(entry.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs font-mono">
                      {entry.weightKg && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Weight</span>
                          <span className="font-bold text-emerald-400">{entry.weightKg} kg</span>
                        </div>
                      )}
                      {entry.bodyFatPercentage && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Body Fat</span>
                          <span className="font-bold text-purple-300">{entry.bodyFatPercentage}%</span>
                        </div>
                      )}
                      {entry.chestCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Chest</span>
                          <span className="font-bold text-zinc-200">{entry.chestCm} cm</span>
                        </div>
                      )}
                      {entry.waistCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Waist</span>
                          <span className="font-bold text-zinc-200">{entry.waistCm} cm</span>
                        </div>
                      )}
                      {entry.armsCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Arms</span>
                          <span className="font-bold text-zinc-200">{entry.armsCm} cm</span>
                        </div>
                      )}
                      {entry.shouldersCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Shoulders</span>
                          <span className="font-bold text-zinc-200">{entry.shouldersCm} cm</span>
                        </div>
                      )}
                      {entry.hipsCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Hips</span>
                          <span className="font-bold text-zinc-200">{entry.hipsCm} cm</span>
                        </div>
                      )}
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/30 italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* SUB-TAB 4: HYPERTROPHY ANALYTICS & ACTIVE PLAN VOLUME */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Interactive Progress & Body Stats Charts */}
          <ProgressCharts
            bodyMeasurements={bodyMeasurements}
            personalRecords={personalRecords}
            recoveryList={recoveryList}
            workoutHistory={workoutHistory}
          />

          {/* SECTION 1: Active Plan Volume Level Analysis (Optimal, Maintenance, Excessive) */}
          <Card className="p-4 sm:p-6 space-y-6 bg-zinc-900/90 border-purple-500/30 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="purple" className="text-[10px] uppercase font-bold">
                    HYPERTROPHY VOLUME LANDMARKS
                  </Badge>
                  <span className="text-xs text-purple-400 font-mono font-bold">
                    Active Plan: {activePlan?.title || 'Custom Workout Plan'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-zinc-100 mt-1 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-400 shrink-0" />
                  Active Plan Weekly Volume Analysis (14 Muscle Groups)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Evaluates your active plan's programmed weekly sets against scientific hypertrophy thresholds: <strong>Optimal (7–18 sets)</strong>, <strong>Maintenance (1–6 sets)</strong>, and <strong>Excessive (19+ sets)</strong>.
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  🟢 {volumeCounts.optimal} Optimal
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  🟡 {volumeCounts.maintenance} Maintenance
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  🔴 {volumeCounts.excessive} Excessive
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-400 border border-zinc-700/80">
                  ⚪ {volumeCounts.neglected} Neglected
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setVolumeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  volumeFilter === 'all'
                    ? 'bg-purple-500 text-zinc-950 font-black shadow-md shadow-purple-500/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All Muscles (14)
              </button>
              <button
                type="button"
                onClick={() => setVolumeFilter('optimal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  volumeFilter === 'optimal'
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                🟢 Optimal ({volumeCounts.optimal})
              </button>
              <button
                type="button"
                onClick={() => setVolumeFilter('maintenance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  volumeFilter === 'maintenance'
                    ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                🟡 Maintenance ({volumeCounts.maintenance})
              </button>
              <button
                type="button"
                onClick={() => setVolumeFilter('excessive')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  volumeFilter === 'excessive'
                    ? 'bg-rose-500 text-zinc-950 font-black shadow-md shadow-rose-500/20'
                    : 'text-rose-400 hover:text-rose-300'
                }`}
              >
                🔴 Excessive ({volumeCounts.excessive})
              </button>
              <button
                type="button"
                onClick={() => setVolumeFilter('neglected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  volumeFilter === 'neglected'
                    ? 'bg-zinc-700 text-zinc-100 font-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ⚪ 0 Sets ({volumeCounts.neglected})
              </button>
            </div>

            {/* Muscle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePlanMuscleAnalysis
                .filter((item) => volumeFilter === 'all' || item.volumeLevel === volumeFilter)
                .map((m) => {
                  const setBarPercent = Math.min(100, Math.round((m.totalWeeklySets / 20) * 100));
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-zinc-100 text-base">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                            {m.totalWeeklySets} Sets/Wk
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${m.volumeBadgeStyle}`}>
                            {m.volumeBadgeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Sets Visual Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              m.volumeLevel === 'optimal'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : m.volumeLevel === 'maintenance'
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                : m.volumeLevel === 'excessive'
                                ? 'bg-gradient-to-r from-rose-500 to-red-400'
                                : 'bg-zinc-700'
                            }`}
                            style={{ width: `${m.totalWeeklySets === 0 ? 3 : setBarPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span>0 Sets (Min)</span>
                          <span className="text-emerald-400 font-bold">7-18 MAV Sweet Spot</span>
                          <span>20+ Sets (MRV)</span>
                        </div>
                      </div>

                      {/* Contributing Exercises in Active Plan */}
                      {m.exercises.length > 0 ? (
                        <div className="text-xs text-zinc-400 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/50 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-zinc-500 font-mono">
                            Programmed Exercises in Plan:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {m.exercises.map((ex, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-zinc-800/80 px-2 py-0.5 rounded-md text-zinc-300 font-medium"
                              >
                                {ex.name} ({ex.sets}s • {ex.dayName})
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-500 bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/30 italic">
                          No direct exercises programmed for {m.label} in active plan.
                        </div>
                      )}

                      {/* Recommendation */}
                      <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/30 p-2 rounded-xl border border-zinc-800/30">
                        💡 <strong className="text-zinc-300">Coach Note:</strong> {m.recommendation}
                      </p>
                    </div>
                  );
                })}
            </div>
          </Card>

          {/* SECTION 2: Active Plan Muscle Recovery Tracker */}
          <Card className="p-4 sm:p-6 space-y-5 bg-zinc-900/90 border-emerald-500/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" className="text-[10px] uppercase font-bold">
                    RECOVERY ENGINE
                  </Badge>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    Based on Active Plan & Logged Workouts
                  </span>
                </div>
                <h3 className="text-xl font-black text-zinc-100 mt-1 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-emerald-400 shrink-0" />
                  Muscle Recovery Readiness Tracker
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Calculates muscle fatigue and recovery readiness based on time elapsed since your last workout session.
                </p>
              </div>
              <Badge variant="emerald" className="self-start sm:self-auto text-[10px] font-bold">
                14 Muscle Groups
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePlanMuscleAnalysis.map((rec) => {
                return (
                  <div key={rec.id} className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-bold text-zinc-100 text-sm">{rec.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400">
                          {rec.daysAgoStr}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            rec.recoveryStatus === 'optimal'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : rec.recoveryStatus === 'recovering'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {rec.recoveryStatus === 'optimal' ? 'Ready to Train' : rec.recoveryStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            rec.recoveryPercentage >= 90
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : rec.recoveryPercentage >= 60
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-rose-500 to-red-400'
                          }`}
                          style={{ width: `${rec.recoveryPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Recovery: {rec.recoveryPercentage}%</span>
                        <span>{rec.totalWeeklySets} Sets in Active Plan</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Modal 1: Log Body Measurements */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg space-y-5 animate-scaleIn my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-zinc-100">Log Body Measurements</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 82.5"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 14.5"
                    value={formBodyFat}
                    onChange={(e) => setFormBodyFat(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 108"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 81"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 41.5"
                    value={formArms}
                    onChange={(e) => setFormArms(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Shoulders (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 124"
                    value={formShoulders}
                    onChange={(e) => setFormShoulders(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Thighs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 62"
                    value={formThighs}
                    onChange={(e) => setFormThighs(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Notes</label>
                <textarea
                  placeholder="e.g. Morning fasted measurement"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLogModalOpen(false)}
                  className="border-zinc-800 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold"
                >
                  Save Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log PR Manually */}
      {isAddPRModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-5 animate-scaleIn my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-zinc-100">Log Personal Record (PR)</h3>
              </div>
              <button
                onClick={() => setIsAddPRModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePR} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Exercise</label>
                <select
                  value={prExerciseId}
                  onChange={(e) => setPrExerciseId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                >
                  {exercisesLibrary.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.primaryMuscle.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 40"
                    value={prWeight}
                    onChange={(e) => setPrWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Reps Performed</label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    value={prReps}
                    onChange={(e) => setPrReps(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Date Achieved</label>
                <input
                  type="date"
                  value={prDate}
                  onChange={(e) => setPrDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddPRModalOpen(false)}
                  className="border-zinc-800 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold"
                >
                  Save PR
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Clear History & PRs */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 animate-scaleIn">
            <div className="flex items-center gap-3 text-rose-400">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black text-zinc-100">Clear History & PRs?</h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              This will wipe all completed workout history logs and saved personal records, giving you a completely fresh slate to track your workouts from scratch.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsResetConfirmOpen(false)}
                className="border-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  resetAllHistoryAndPRs();
                  setIsResetConfirmOpen(false);
                }}
                className="bg-rose-500 hover:bg-rose-400 text-zinc-950 font-black text-xs"
              >
                Yes, Wipe & Start Fresh
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
