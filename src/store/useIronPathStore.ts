import { create } from 'zustand';
import { 
  NavigationTab, 
  UserProfile, 
  WorkoutSession, 
  PhysiqueTargetId, 
  MuscleRecovery, 
  PersonalRecord, 
  ExerciseSet, 
  PlannedExercise, 
  Exercise,
  CustomWorkoutPlan,
  CustomWorkoutDay,
  CustomWorkoutExercise,
  Program,
  BodyMeasurementEntry
} from '../types';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_TODAY_WORKOUT, 
  RECOVERY_STATUS, 
  RECENT_PRS, 
  PHYSIQUE_TARGET_CARDS,
  EXERCISES_LIBRARY,
  INITIAL_BODY_MEASUREMENTS
} from '../data/mockData';
import { normalizeMuscleGroup } from '../lib/muscleUtils';
import { 
  playTimerCompletionBeep, 
  playCountdownTick, 
  playSetCompletionSound, 
  playWorkoutFinishedSound, 
  triggerHaptic 
} from '../lib/audioUtils';

export const getOrBuildExercise = (
  library: Exercise[],
  cEx: { exerciseId?: string; name: string; equipment?: string; primaryMuscle?: any; notes?: string }
): Exercise => {
  const nameTrim = (cEx.name || '').trim().toLowerCase();

  // 1. Exact ID match
  if (cEx.exerciseId) {
    const byId = library.find((e) => e.id === cEx.exerciseId);
    if (byId) {
      return {
        ...byId,
        primaryMuscle: normalizeMuscleGroup(byId.primaryMuscle, byId.name)
      };
    }
  }

  // 2. Exact name match
  if (nameTrim) {
    const byName = library.find((e) => e.name.trim().toLowerCase() === nameTrim);
    if (byName) {
      return {
        ...byName,
        primaryMuscle: normalizeMuscleGroup(byName.primaryMuscle, byName.name)
      };
    }
  }

  // 3. Clean name match (ignoring parenthetical details)
  if (nameTrim) {
    const cleanNameTrim = nameTrim.replace(/\([^)]*\)/g, '').trim();
    if (cleanNameTrim) {
      const byClean = library.find((e) => {
        const eClean = e.name.trim().toLowerCase().replace(/\([^)]*\)/g, '').trim();
        return eClean === cleanNameTrim || eClean.includes(cleanNameTrim) || cleanNameTrim.includes(eClean);
      });
      if (byClean) {
        return {
          ...byClean,
          primaryMuscle: normalizeMuscleGroup(byClean.primaryMuscle, byClean.name)
        };
      }
    }
  }

  // 4. Partial / includes name match
  if (nameTrim) {
    const byPartial = library.find((e) => {
      const eName = e.name.trim().toLowerCase();
      return eName.includes(nameTrim) || nameTrim.includes(eName);
    });
    if (byPartial) {
      return {
        ...byPartial,
        primaryMuscle: normalizeMuscleGroup(byPartial.primaryMuscle, byPartial.name)
      };
    }
  }

  // 5. Fallback: dynamically construct a unique Exercise object preserving original name, muscle, & equipment
  return {
    id: cEx.exerciseId || `ex_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cEx.name || 'Custom Exercise',
    primaryMuscle: normalizeMuscleGroup(cEx.primaryMuscle, cEx.name),
    secondaryMuscles: [],
    equipment: (cEx.equipment as any) || 'dumbbell',
    category: 'compound',
    hypertrophyTier: 'A Tier',
    instructions: ['Perform with controlled tempo and full mechanical tension.'],
    cue: cEx.notes || 'Maintain strict form and focus on target muscle contraction.',
    defaultRIR: 1
  };
};

interface RestTimerState {
  isRunning: boolean;
  secondsRemaining: number;
  totalDuration: number;
  targetEndTime?: number;
}

interface IronPathState {
  // Navigation & View
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Onboarding Flow
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (profileUpdates: Partial<UserProfile>) => void;
  resetOnboarding: () => void;

  // Profile & Physique Focus
  userProfile: UserProfile;
  setPhysiqueTarget: (targetId: PhysiqueTargetId) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Custom Workout Plans (Manual Builder)
  customPlans: CustomWorkoutPlan[];
  activePlanId: string | null;
  exercisesLibrary: Exercise[];
  createCustomPlan: (title: string, description: string, daysPerWeek?: number, goal?: string, notes?: string) => CustomWorkoutPlan;
  updateCustomPlan: (planId: string, updates: Partial<CustomWorkoutPlan>) => void;
  deleteCustomPlan: (planId: string) => void;
  setActivePlan: (planId: string) => void;
  archivePlan: (planId: string) => void;
  unarchivePlan: (planId: string) => void;
  duplicateCustomPlan: (planId: string) => CustomWorkoutPlan;
  importProgramAsEditablePlan: (program: Program) => CustomWorkoutPlan;
  addCustomExerciseToLibrary: (exercise: Exercise) => void;
  addDayToPlan: (planId: string, dayName: string, scheduledDay?: string) => void;
  updatePlanDay: (planId: string, dayId: string, updates: Partial<CustomWorkoutDay>) => void;
  deletePlanDay: (planId: string, dayId: string) => void;
  duplicatePlanDay: (planId: string, dayId: string) => void;
  reorderPlanDays: (planId: string, startIndex: number, endIndex: number) => void;
  addExerciseToPlanDay: (planId: string, dayId: string, exercise: Exercise) => void;
  updatePlanExercise: (planId: string, dayId: string, exerciseId: string, updates: Partial<CustomWorkoutExercise>) => void;
  deletePlanExercise: (planId: string, dayId: string, exerciseId: string) => void;
  duplicatePlanExercise: (planId: string, dayId: string, exerciseId: string) => void;
  reorderPlanExercises: (planId: string, dayId: string, startIndex: number, endIndex: number) => void;
  replacePlanExercise: (planId: string, dayId: string, oldExerciseId: string, newExercise: Exercise) => void;
  startWorkoutFromPlanDay: (planTitle: string, day: CustomWorkoutDay) => void;

  // Active Workout Execution
  activeWorkout: WorkoutSession;
  isWorkoutInProgress: boolean;
  workoutElapsedTime: number;
  persistentNotes: Record<string, string>;
  startWorkout: () => void;
  pauseWorkout: () => void;
  finishWorkout: () => void;
  toggleSetCompleted: (exerciseId: string, setId: string) => void;
  updateSetData: (exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => void;
  updateExerciseNote: (exerciseId: string, note: string) => void;
  addSetToExercise: (exerciseId: string, setType?: 'working' | 'warmup') => void;
  removeSetFromExercise: (exerciseId: string, setId: string) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  swapActiveWorkoutExercise: (plannedExerciseId: string, newExercise: Exercise, reason?: string) => void;
  reorderExercises: (startIndex: number, endIndex: number) => void;
  setWorkoutNote: (note: string) => void;

  // Rest Timer
  restTimer: RestTimerState;
  startRestTimer: (durationInSeconds?: number) => void;
  stopRestTimer: () => void;
  tickRestTimer: () => void;

  // Recovery & Analytics Data
  workoutHistory: WorkoutSession[];
  recoveryList: MuscleRecovery[];
  personalRecords: PersonalRecord[];
  clearWorkoutHistory: () => void;
  deleteWorkoutSession: (sessionId: string) => void;
  clearPersonalRecords: () => void;
  deletePersonalRecord: (recordId: string) => void;
  addPersonalRecord: (pr: Omit<PersonalRecord, 'id'>) => void;
  resetAllHistoryAndPRs: () => void;

  // Body Measurements
  bodyMeasurements: BodyMeasurementEntry[];
  addBodyMeasurement: (entry: Omit<BodyMeasurementEntry, 'id'>) => void;
  deleteBodyMeasurement: (id: string) => void;

  // Offline Sync Status
  isOffline: boolean;
  lastSyncedAt: string | null;
  triggerSync: () => void;
}

const STORAGE_KEY_WORKOUT = 'ironpath_active_workout';
const STORAGE_KEY_PROFILE = 'ironpath_user_profile';
const STORAGE_KEY_PLANS = 'ironpath_custom_plans';
const STORAGE_KEY_MEASUREMENTS = 'ironpath_body_measurements';
const STORAGE_KEY_HISTORY = 'ironpath_workout_history';
const STORAGE_KEY_PRS = 'ironpath_personal_records';
const STORAGE_KEY_CUSTOM_EXERCISES = 'ironpath_custom_exercises';
const STORAGE_KEY_NOTES = 'ironpath_persistent_exercise_notes';

const loadSavedNotes = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_NOTES);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
};

const syncActiveWorkoutToHistoryAndPRs = (
  activeWorkout: WorkoutSession,
  workoutHistory: WorkoutSession[],
  personalRecords: PersonalRecord[],
  persistentNotes: Record<string, string>
) => {
  const todayStr = new Date().toISOString().split('T')[0];

  let totalVol = 0;
  activeWorkout.exercises?.forEach((pe) => {
    pe.sets?.forEach((s) => {
      if (s.completed) totalVol += s.weight * s.reps;
    });
  });

  const updatedSession: WorkoutSession = {
    ...activeWorkout,
    date: activeWorkout.date || todayStr,
    totalVolumeKg: totalVol,
    completed: true
  };

  const existingIdx = workoutHistory.findIndex((h) => h.id === activeWorkout.id);
  let updatedHistory: WorkoutSession[];

  if (activeWorkout.exercises && activeWorkout.exercises.length > 0) {
    if (existingIdx >= 0) {
      updatedHistory = [...workoutHistory];
      updatedHistory[existingIdx] = updatedSession;
    } else {
      updatedHistory = [updatedSession, ...workoutHistory];
    }
  } else {
    updatedHistory = workoutHistory;
  }

  const updatedNotes = { ...persistentNotes };
  activeWorkout.exercises?.forEach((pe) => {
    if (pe.notes) {
      if (pe.exercise?.name) updatedNotes[pe.exercise.name.toLowerCase()] = pe.notes;
      if (pe.exercise?.id) updatedNotes[pe.exercise.id.toLowerCase()] = pe.notes;
    }
  });

  const updatedPRs = [...personalRecords];
  activeWorkout.exercises?.forEach((pe) => {
    pe.sets?.forEach((s) => {
      if (s.completed && s.weight > 0 && s.reps > 0) {
        const e1rm = Math.round((s.weight * (1 + s.reps / 30)) * 10) / 10;
        const exName = pe.exercise.name;
        const prIdx = updatedPRs.findIndex(
          (pr) => pr.exerciseName.toLowerCase() === exName.toLowerCase()
        );

        if (prIdx >= 0) {
          const existing = updatedPRs[prIdx];
          if (s.weight > existing.weight || e1rm > existing.estimated1RM) {
            updatedPRs[prIdx] = {
              ...existing,
              weight: Math.max(existing.weight, s.weight),
              reps: s.weight >= existing.weight ? s.reps : existing.reps,
              estimated1RM: Math.max(existing.estimated1RM, e1rm),
              date: todayStr,
              isRecent: true
            };
          }
        } else {
          updatedPRs.push({
            id: `pr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            exerciseName: exName,
            muscle: pe.exercise.primaryMuscle,
            weight: s.weight,
            reps: s.reps,
            estimated1RM: e1rm,
            date: todayStr,
            isRecent: true
          });
        }
      }
    });
  });

  try {
    localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedSession));
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    localStorage.setItem(STORAGE_KEY_PRS, JSON.stringify(updatedPRs));
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
  } catch {}

  return {
    activeWorkout: updatedSession,
    workoutHistory: updatedHistory,
    personalRecords: updatedPRs,
    persistentNotes: updatedNotes
  };
};

export const getLastLogsForExercise = (
  workoutHistory: WorkoutSession[],
  persistentNotes: Record<string, string>,
  exerciseNameOrId: string
) => {
  const nameTrim = (exerciseNameOrId || '').trim().toLowerCase();
  if (!nameTrim) return { lastWeight: undefined, lastReps: undefined, lastNote: '', sets: [] };

  let foundPe: PlannedExercise | null = null;
  
  for (const session of workoutHistory) {
    if (!session.exercises) continue;
    const match = session.exercises.find((pe) => {
      if (pe.exercise?.id && pe.exercise.id.toLowerCase() === nameTrim) return true;
      if (pe.exercise?.name && pe.exercise.name.trim().toLowerCase() === nameTrim) return true;
      return false;
    });
    if (match && match.sets && match.sets.some((s) => s.completed || s.weight > 0)) {
      foundPe = match;
      break;
    }
  }

  const storedNote = persistentNotes[nameTrim] || (foundPe?.notes || '');

  if (!foundPe || !foundPe.sets || foundPe.sets.length === 0) {
    return { lastWeight: undefined, lastReps: undefined, lastNote: storedNote, sets: [] };
  }

  const completedSets = foundPe.sets.filter((s) => s.completed || s.weight > 0);
  const workingSets = completedSets.filter((s) => s.type === 'working');
  const targetSet = workingSets.length > 0 ? workingSets[workingSets.length - 1] : completedSets[completedSets.length - 1];

  return {
    lastWeight: targetSet ? targetSet.weight : undefined,
    lastReps: targetSet ? targetSet.reps : undefined,
    lastNote: storedNote,
    sets: completedSets.map((s) => ({ weight: s.weight, reps: s.reps, type: s.type }))
  };
};

const loadSavedCustomExercises = (): Exercise[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_EXERCISES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((ex: Exercise) => ({
          ...ex,
          primaryMuscle: normalizeMuscleGroup(ex.primaryMuscle, ex.name)
        }));
      }
    }
  } catch {}
  return [];
};

const INITIAL_DEFAULT_PLANS: CustomWorkoutPlan[] = [
  {
    id: 'plan_ppl_masterclass',
    title: 'PPL Hypertrophy Masterclass',
    description: '6-day high density push/pull/legs split designed for maximum hypertrophy and balanced volume distribution.',
    daysPerWeek: 6,
    goal: 'Hypertrophy & Aesthetic Symmetry',
    notes: 'Focus on 1-2 RIR on all main compound movements.',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDurationMinutes: 60,
    days: [
      {
        id: 'day_ppl_push_a',
        name: 'Push A: Chest, Side Delts, Triceps',
        focus: 'Upper Chest & Lateral Head Focus',
        scheduledDay: 'Monday',
        exercises: [
          { id: 'c_ppl_1', exerciseId: 'ex_incline_db_bench', name: 'Incline Dumbbell Bench Press', equipment: 'dumbbell', sets: 4, reps: '8-12', restSeconds: 120, primaryMuscle: 'chest', warmupSets: 2, targetRIR: 1, tempoNotes: '2s eccentric stretch' },
          { id: 'c_ppl_2', exerciseId: 'ex_cable_fly', name: 'Flat Cable Chest Fly', equipment: 'cable', sets: 3, reps: '12-15', restSeconds: 90, primaryMuscle: 'chest', warmupSets: 0, targetRIR: 0, tempoNotes: 'Hard 1s squeeze' },
          { id: 'c_ppl_3', exerciseId: 'ex_cable_lateral_raise', name: 'Cable Lateral Raise', equipment: 'cable', sets: 4, reps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts', warmupSets: 1, targetRIR: 0, tempoNotes: 'No momentum' },
          { id: 'c_ppl_4', exerciseId: 'ex_overhead_tricep_ext', name: 'Triceps Overhead Cable Extension', equipment: 'cable', sets: 3, reps: '10-12', restSeconds: 90, primaryMuscle: 'triceps', warmupSets: 0, targetRIR: 1, tempoNotes: 'Deep stretch at bottom' }
        ]
      },
      {
        id: 'day_ppl_pull_a',
        name: 'Pull A: Lats, Upper Back, Biceps',
        focus: 'Lat Width & Upper Back Density',
        scheduledDay: 'Tuesday',
        exercises: [
          { id: 'c_ppl_5', exerciseId: 'ex_lat_pulldown', name: 'Neutral Grip Lat Pulldown', equipment: 'cable', sets: 4, reps: '8-12', restSeconds: 120, primaryMuscle: 'lats', warmupSets: 2, targetRIR: 1, tempoNotes: 'Drive elbows down to hips' },
          { id: 'c_ppl_6', exerciseId: 'ex_tbar_row', name: 'Chest Supported T-Bar Row', equipment: 'machine', sets: 4, reps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back', warmupSets: 1, targetRIR: 1 },
          { id: 'c_ppl_7', exerciseId: 'ex_bayesian_curl', name: 'Bayesian Bicep Cable Curl', equipment: 'cable', sets: 4, reps: '10-12', restSeconds: 90, primaryMuscle: 'biceps', warmupSets: 0, targetRIR: 0, tempoNotes: 'Extended position stretch' }
        ]
      },
      {
        id: 'day_ppl_legs_a',
        name: 'Legs A: Quads, Hamstrings, Calves',
        focus: 'Quad Dominance & Hamstring Isolation',
        scheduledDay: 'Wednesday',
        exercises: [
          { id: 'c_ppl_8', exerciseId: 'ex_hack_squat', name: 'Barbell Hack Squat', equipment: 'machine', sets: 4, reps: '8-10', restSeconds: 180, primaryMuscle: 'quads', warmupSets: 2, targetRIR: 1 },
          { id: 'c_ppl_9', exerciseId: 'ex_seated_leg_curl', name: 'Seated Hamstring Curl', equipment: 'machine', sets: 4, reps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings', warmupSets: 1, targetRIR: 1 },
          { id: 'c_ppl_10', exerciseId: 'ex_standing_calf_raise', name: 'Standing Calf Raise', equipment: 'machine', sets: 4, reps: '12-15', restSeconds: 60, primaryMuscle: 'calves', warmupSets: 0, targetRIR: 0, tempoNotes: 'Pause 2s at bottom' }
        ]
      },
      {
        id: 'day_ppl_rest_1',
        name: 'Rest & Recovery Day',
        focus: 'Fiber Repair & Light Mobility',
        scheduledDay: 'Thursday',
        isRestDay: true,
        exercises: []
      }
    ]
  },
  {
    id: 'plan_vtaper_spec',
    title: 'V-Taper Architecture 4-Day',
    description: 'Specialization routine prioritizing upper chest, lat width, and side delt cap.',
    daysPerWeek: 4,
    goal: 'V-Taper Ratio Focus',
    status: 'saved',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDurationMinutes: 50,
    days: [
      {
        id: 'day_vt_1',
        name: 'Day 1: Upper Width Focus',
        focus: 'Lats, Side Delts & Upper Chest',
        scheduledDay: 'Monday',
        exercises: [
          { id: 'c_vt_1', exerciseId: 'ex_incline_db_bench', name: 'Incline Dumbbell Bench Press', equipment: 'dumbbell', sets: 4, reps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { id: 'c_vt_2', exerciseId: 'ex_lat_pulldown', name: 'Neutral Grip Lat Pulldown', equipment: 'cable', sets: 4, reps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { id: 'c_vt_3', exerciseId: 'ex_cable_lateral_raise', name: 'Cable Lateral Raise', equipment: 'cable', sets: 5, reps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        id: 'day_vt_2',
        name: 'Day 2: Quads, Arms & Core',
        focus: 'Lower Body & Arm Hypertrophy',
        scheduledDay: 'Tuesday',
        exercises: [
          { id: 'c_vt_4', exerciseId: 'ex_hack_squat', name: 'Barbell Hack Squat', equipment: 'machine', sets: 4, reps: '8-12', restSeconds: 180, primaryMuscle: 'quads' },
          { id: 'c_vt_5', exerciseId: 'ex_bayesian_curl', name: 'Bayesian Bicep Cable Curl', equipment: 'cable', sets: 4, reps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      }
    ]
  }
];

const loadSavedPlans = (): CustomWorkoutPlan[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PLANS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((plan: CustomWorkoutPlan) => ({
          ...plan,
          days: Array.isArray(plan.days)
            ? plan.days.map((day) => ({
                ...day,
                exercises: Array.isArray(day.exercises)
                  ? day.exercises.map((ex) => ({
                      ...ex,
                      primaryMuscle: normalizeMuscleGroup(ex.primaryMuscle, ex.name)
                    }))
                  : []
              }))
            : []
        }));
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_DEFAULT_PLANS;
};

// Helper to load from LocalStorage
const loadSavedProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_USER_PROFILE;
};

const loadSavedWorkout = (): WorkoutSession => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WORKOUT);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_TODAY_WORKOUT;
};

const loadSavedMeasurements = (): BodyMeasurementEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MEASUREMENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_BODY_MEASUREMENTS;
};

const loadSavedHistory = (): WorkoutSession[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return []; // Fresh empty default
};

const loadSavedPRs = (): PersonalRecord[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PRS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return []; // Fresh empty default
};

export const useIronPathStore = create<IronPathState>((set, get) => ({
  activeTab: 'train',
  setActiveTab: (tab) => {
    set({ activeTab: tab });
    try {
      localStorage.setItem('ironpath_last_tab', tab);
    } catch {}
  },

  isOnboardingOpen: false,
  setIsOnboardingOpen: (open) => set({ isOnboardingOpen: open }),

  completeOnboarding: (profileUpdates) => {
    set((state) => {
      const updatedProfile: UserProfile = {
        ...state.userProfile,
        ...profileUpdates,
        hasCompletedOnboarding: true,
      };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
      } catch {}
      return { userProfile: updatedProfile, isOnboardingOpen: false, activeTab: 'train' };
    });
  },

  resetOnboarding: () => {
    set((state) => {
      const updatedProfile: UserProfile = {
        ...state.userProfile,
        hasCompletedOnboarding: false,
      };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
      } catch {}
      return { userProfile: updatedProfile, isOnboardingOpen: true };
    });
  },

  userProfile: loadSavedProfile(),

  setPhysiqueTarget: (targetId) => {
    set((state) => {
      const updatedProfile = { ...state.userProfile, physiqueTarget: targetId };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
      } catch {}
      return { userProfile: updatedProfile };
    });
  },
  updateUserProfile: (updates) => {
    set((state) => {
      const updatedProfile = { ...state.userProfile, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
      } catch {}
      return { userProfile: updatedProfile };
    });
  },

  activeWorkout: loadSavedWorkout(),
  isWorkoutInProgress: false,
  workoutElapsedTime: 0,
  persistentNotes: loadSavedNotes(),

  startWorkout: () => {
    set({ isWorkoutInProgress: true });
  },

  pauseWorkout: () => {
    set({ isWorkoutInProgress: false });
  },

  finishWorkout: () => {
    const { activeWorkout, personalRecords, workoutHistory, persistentNotes } = get();
    // Celebrate & mark workout as complete
    const completedWorkout: WorkoutSession = {
      ...activeWorkout,
      completed: true,
      endTime: new Date().toISOString()
    };

    const newHistory = [completedWorkout, ...workoutHistory];

    // Save notes to persistentNotes dictionary
    const newNotes = { ...persistentNotes };
    completedWorkout.exercises.forEach((pe) => {
      if (pe.notes) {
        if (pe.exercise?.name) newNotes[pe.exercise.name.toLowerCase()] = pe.notes;
        if (pe.exercise?.id) newNotes[pe.exercise.id.toLowerCase()] = pe.notes;
      }
    });

    // Auto-detect PRs achieved during this workout
    const updatedPRs = [...personalRecords];
    const todayStr = new Date().toISOString().split('T')[0];

    completedWorkout.exercises.forEach((pe) => {
      pe.sets.forEach((s) => {
        if (s.completed && s.weight > 0 && s.reps > 0) {
          const e1rm = Math.round((s.weight * (1 + s.reps / 30)) * 10) / 10;
          const exName = pe.exercise.name;
          const existingIdx = updatedPRs.findIndex(
            (pr) => pr.exerciseName.toLowerCase() === exName.toLowerCase()
          );

          if (existingIdx >= 0) {
            const existing = updatedPRs[existingIdx];
            if (s.weight > existing.weight || e1rm > existing.estimated1RM) {
              updatedPRs[existingIdx] = {
                ...existing,
                weight: Math.max(existing.weight, s.weight),
                reps: s.reps,
                estimated1RM: Math.max(existing.estimated1RM, e1rm),
                date: todayStr,
                isRecent: true
              };
            }
          } else {
            updatedPRs.push({
              id: `pr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              exerciseName: exName,
              muscle: pe.exercise.primaryMuscle,
              weight: s.weight,
              reps: s.reps,
              estimated1RM: e1rm,
              date: todayStr,
              isRecent: true
            });
          }
        }
      });
    });

    set({
      activeWorkout: completedWorkout,
      isWorkoutInProgress: false,
      activeTab: 'train',
      workoutHistory: newHistory,
      personalRecords: updatedPRs,
      persistentNotes: newNotes
    });

    playWorkoutFinishedSound(
      get().userProfile.soundAlerts !== false,
      get().userProfile.hapticAlerts !== false
    );

    try {
      localStorage.removeItem(STORAGE_KEY_WORKOUT);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
      localStorage.setItem(STORAGE_KEY_PRS, JSON.stringify(updatedPRs));
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(newNotes));
    } catch {}
  },

  toggleSetCompleted: (exerciseId, setId) => {
    set((state) => {
      const soundOn = state.userProfile.soundAlerts !== false;
      const hapticsOn = state.userProfile.hapticAlerts !== false;

      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== exerciseId) return pe;
        const sets = pe.sets.map((s) => {
          if (s.id !== setId) return s;
          const newCompleted = !s.completed;
          // Trigger rest timer and chime on completing a set!
          if (newCompleted) {
            playSetCompletionSound(soundOn, hapticsOn);
            const exerciseRest = pe.restSeconds || state.userProfile.defaultRestTimerSeconds || 120;
            get().startRestTimer(exerciseRest);
          } else {
            triggerHaptic('tap', hapticsOn);
          }
          return { ...s, completed: newCompleted };
        });
        return { ...pe, sets };
      });

      // Recalculate total volume
      let totalVol = 0;
      exercises.forEach((pe) => {
        pe.sets.forEach((s) => {
          if (s.completed) totalVol += s.weight * s.reps;
        });
      });

      const updatedWorkout = {
        ...state.activeWorkout,
        exercises,
        totalVolumeKg: totalVol
      };

      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  updateSetData: (exerciseId, setId, updates) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== exerciseId) return pe;
        const sets = pe.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s));
        return { ...pe, sets };
      });

      const updatedWorkout = { ...state.activeWorkout, exercises };
      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  updateExerciseNote: (exerciseId, note) => {
    set((state) => {
      let targetExName = '';
      let targetExId = '';

      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id === exerciseId || pe.exercise.id === exerciseId) {
          targetExName = pe.exercise.name.toLowerCase();
          targetExId = pe.exercise.id.toLowerCase();
          return { ...pe, notes: note };
        }
        return pe;
      });

      const updatedWorkout = { ...state.activeWorkout, exercises };

      const updatedNotes = { ...state.persistentNotes };
      if (targetExName) updatedNotes[targetExName] = note;
      if (targetExId) updatedNotes[targetExId] = note;
      if (exerciseId) updatedNotes[exerciseId] = note;

      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        updatedNotes
      );
    });
  },

  addSetToExercise: (exerciseId, setType = 'working') => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== exerciseId) return pe;

        let lastWarmupIdx = -1;
        for (let i = 0; i < pe.sets.length; i++) {
          if (pe.sets[i].type === 'warmup') {
            lastWarmupIdx = i;
          }
        }

        const firstWorkingSet = pe.sets.find((s) => s.type === 'working');
        const lastSet = pe.sets[pe.sets.length - 1];

        const defaultWeight = setType === 'warmup'
          ? (firstWorkingSet ? Math.round(firstWorkingSet.weight * 0.5) || 15 : (lastSet ? Math.round(lastSet.weight * 0.5) || 15 : 15))
          : (lastSet ? lastSet.weight : 20);

        const newSet: ExerciseSet = {
          id: `set_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          setNumber: 1, // temporary, will renumber below
          type: setType,
          weight: defaultWeight,
          reps: setType === 'warmup' ? 12 : (lastSet ? lastSet.reps : 10),
          rir: setType === 'warmup' ? 3 : 1,
          completed: false,
          previousWeight: lastSet ? lastSet.weight : 20,
          previousReps: lastSet ? lastSet.reps : 10
        };

        let updatedSets: ExerciseSet[] = [];
        if (setType === 'warmup') {
          if (lastWarmupIdx >= 0) {
            // Place right after the last existing warmup set
            updatedSets = [
              ...pe.sets.slice(0, lastWarmupIdx + 1),
              newSet,
              ...pe.sets.slice(lastWarmupIdx + 1)
            ];
          } else {
            // Place at the top before working sets
            updatedSets = [newSet, ...pe.sets];
          }
        } else {
          // Append working set at the end
          updatedSets = [...pe.sets, newSet];
        }

        const renumbered = updatedSets.map((s, idx) => ({ ...s, setNumber: idx + 1 }));

        return { ...pe, sets: renumbered };
      });

      const updatedWorkout = { ...state.activeWorkout, exercises };
      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  removeSetFromExercise: (exerciseId, setId) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== exerciseId) return pe;
        const filteredSets = pe.sets.filter((s) => s.id !== setId);
        // renumber sets
        const renumbered = filteredSets.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...pe, sets: renumbered };
      });

      const updatedWorkout = { ...state.activeWorkout, exercises };
      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  addExerciseToWorkout: (exercise) => {
    set((state) => {
      const lastLogs = getLastLogsForExercise(state.workoutHistory, state.persistentNotes, exercise.id) ||
                       getLastLogsForExercise(state.workoutHistory, state.persistentNotes, exercise.name);

      const baseWeight = lastLogs.lastWeight !== undefined ? lastLogs.lastWeight : 20;
      const baseReps = lastLogs.lastReps !== undefined ? lastLogs.lastReps : 10;
      const note = lastLogs.lastNote || exercise.notes || exercise.cue;

      const newPlanned: PlannedExercise = {
        id: `pe_${Date.now()}`,
        exercise,
        restSeconds: state.userProfile.defaultRestTimerSeconds || 120,
        notes: note,
        sets: [
          {
            id: `set_${Date.now()}_1`,
            setNumber: 1,
            type: 'working',
            weight: baseWeight,
            reps: baseReps,
            rir: 2,
            completed: false,
            previousWeight: baseWeight,
            previousReps: baseReps
          },
          {
            id: `set_${Date.now()}_2`,
            setNumber: 2,
            type: 'working',
            weight: baseWeight,
            reps: baseReps,
            rir: 1,
            completed: false,
            previousWeight: baseWeight,
            previousReps: baseReps
          }
        ]
      };

      const exercises = [...state.activeWorkout.exercises, newPlanned];
      const updatedWorkout = { ...state.activeWorkout, exercises };
      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  removeExerciseFromWorkout: (exerciseId) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.filter((pe) => pe.id !== exerciseId);
      const updatedWorkout = { ...state.activeWorkout, exercises };
      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  swapActiveWorkoutExercise: (plannedExerciseId, newExercise, reason) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== plannedExerciseId) return pe;
        const oldName = pe.exercise.name;
        const swapNote = `[Swapped from ${oldName}${reason ? ` (${reason})` : ''}]`;
        const updatedNote = pe.notes ? `${pe.notes}\n${swapNote}` : swapNote;
        return {
          ...pe,
          exercise: newExercise,
          swappedFrom: oldName,
          notes: updatedNote
        };
      });

      const updatedWorkout = { ...state.activeWorkout, exercises };
      return syncActiveWorkoutToHistoryAndPRs(
        updatedWorkout,
        state.workoutHistory,
        state.personalRecords,
        state.persistentNotes
      );
    });
  },

  reorderExercises: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.activeWorkout.exercises);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      const updatedWorkout = { ...state.activeWorkout, exercises: result };
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
    });
  },

  setWorkoutNote: (notes) => {
    set((state) => {
      const updatedWorkout = { ...state.activeWorkout, notes };
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
    });
  },

  // Rest timer
  restTimer: {
    isRunning: false,
    secondsRemaining: 120,
    totalDuration: 120
  },

  startRestTimer: (duration = 120) => {
    const targetEndTime = Date.now() + duration * 1000;
    const { userProfile } = get();
    triggerHaptic('bump', userProfile.hapticAlerts !== false);
    set({
      restTimer: {
        isRunning: true,
        secondsRemaining: duration,
        totalDuration: duration,
        targetEndTime
      }
    });
  },

  stopRestTimer: () => {
    triggerHaptic('tap', get().userProfile.hapticAlerts !== false);
    set((state) => ({
      restTimer: { ...state.restTimer, isRunning: false, targetEndTime: undefined }
    }));
  },

  tickRestTimer: () => {
    set((state) => {
      if (!state.restTimer.isRunning) return state;

      let remainingSecs = state.restTimer.secondsRemaining - 1;
      if (state.restTimer.targetEndTime) {
        const remainingMs = state.restTimer.targetEndTime - Date.now();
        remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));
      }

      const soundOn = state.userProfile.soundAlerts !== false;
      const hapticsOn = state.userProfile.hapticAlerts !== false;

      if (remainingSecs <= 0) {
        playTimerCompletionBeep(soundOn, hapticsOn);
        return {
          restTimer: {
            ...state.restTimer,
            isRunning: false,
            secondsRemaining: 0,
            targetEndTime: undefined
          }
        };
      }

      // 3-2-1 countdown ticks
      if (remainingSecs <= 3 && remainingSecs !== state.restTimer.secondsRemaining) {
        playCountdownTick(remainingSecs, soundOn, hapticsOn);
      }

      return {
        restTimer: {
          ...state.restTimer,
          secondsRemaining: remainingSecs
        }
      };
    });
  },

  workoutHistory: loadSavedHistory(),
  recoveryList: RECOVERY_STATUS,
  personalRecords: loadSavedPRs(),

  clearWorkoutHistory: () => {
    set({ workoutHistory: [] });
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  },

  deleteWorkoutSession: (sessionId) => {
    set((state) => {
      const updated = state.workoutHistory.filter((w) => w.id !== sessionId);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {}
      return { workoutHistory: updated };
    });
  },

  clearPersonalRecords: () => {
    set({ personalRecords: [] });
    try {
      localStorage.removeItem(STORAGE_KEY_PRS);
    } catch {}
  },

  deletePersonalRecord: (recordId) => {
    set((state) => {
      const updated = state.personalRecords.filter((pr) => pr.id !== recordId);
      try {
        localStorage.setItem(STORAGE_KEY_PRS, JSON.stringify(updated));
      } catch {}
      return { personalRecords: updated };
    });
  },

  addPersonalRecord: (pr) => {
    const newPr: PersonalRecord = {
      ...pr,
      id: `pr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    set((state) => {
      const updated = [newPr, ...state.personalRecords];
      try {
        localStorage.setItem(STORAGE_KEY_PRS, JSON.stringify(updated));
      } catch {}
      return { personalRecords: updated };
    });
  },

  resetAllHistoryAndPRs: () => {
    set({ workoutHistory: [], personalRecords: [] });
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      localStorage.removeItem(STORAGE_KEY_PRS);
    } catch {}
  },

  // Custom Workout Plans (Manual Builder)
  customPlans: loadSavedPlans(),
  activePlanId: loadSavedPlans().find((p) => p.status === 'active')?.id || loadSavedPlans()[0]?.id || null,
  exercisesLibrary: [...loadSavedCustomExercises(), ...EXERCISES_LIBRARY],

  createCustomPlan: (title, description, daysPerWeek = 3, goal, notes) => {
    const newPlan: CustomWorkoutPlan = {
      id: `plan_${Date.now()}`,
      title: title || 'My Custom Training Blueprint',
      description: description || 'Custom hypertrophy routine built manually in IronPath.',
      daysPerWeek: daysPerWeek,
      goal: goal || 'Muscle Hypertrophy & Density',
      notes: notes || '',
      status: 'saved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDurationMinutes: 55,
      days: [
        {
          id: `day_${Date.now()}_1`,
          name: 'Day 1: Upper Body Focus',
          focus: 'Chest, Lats & Side Delts',
          scheduledDay: 'Monday',
          exercises: []
        },
        {
          id: `day_${Date.now()}_2`,
          name: 'Day 2: Lower Body & Core',
          focus: 'Quads, Hamstrings & Calves',
          scheduledDay: 'Wednesday',
          exercises: []
        }
      ]
    };

    set((state) => {
      const updated = [newPlan, ...state.customPlans];
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return {
        customPlans: updated,
        activePlanId: newPlan.id
      };
    });

    return newPlan;
  },

  updateCustomPlan: (planId, updates) => {
    set((state) => {
      const updated = state.customPlans.map((p) => 
        p.id === planId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  deleteCustomPlan: (planId) => {
    set((state) => {
      const updated = state.customPlans.filter((p) => p.id !== planId);
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return {
        customPlans: updated,
        activePlanId: state.activePlanId === planId ? (updated[0]?.id || null) : state.activePlanId
      };
    });
  },

  setActivePlan: (planId) => {
    set((state) => {
      const updated = state.customPlans.map((p) => {
        if (p.id === planId) {
          return { ...p, status: 'active' as const, updatedAt: new Date().toISOString() };
        }
        if (p.status === 'active') {
          return { ...p, status: 'saved' as const };
        }
        return p;
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return {
        customPlans: updated,
        activePlanId: planId
      };
    });
  },

  archivePlan: (planId) => {
    set((state) => {
      const updated = state.customPlans.map((p) =>
        p.id === planId ? { ...p, status: 'archived' as const, updatedAt: new Date().toISOString() } : p
      );
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return {
        customPlans: updated,
        activePlanId: state.activePlanId === planId ? (updated.find(p => p.status === 'active')?.id || null) : state.activePlanId
      };
    });
  },

  unarchivePlan: (planId) => {
    set((state) => {
      const updated = state.customPlans.map((p) =>
        p.id === planId ? { ...p, status: 'saved' as const, updatedAt: new Date().toISOString() } : p
      );
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  duplicateCustomPlan: (planId) => {
    let duplicated!: CustomWorkoutPlan;
    set((state) => {
      const source = state.customPlans.find((p) => p.id === planId);
      if (!source) return state;
      duplicated = {
        ...source,
        id: `plan_${Date.now()}`,
        title: `${source.title} (Copy)`,
        status: 'saved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        days: source.days.map((d) => ({
          ...d,
          id: `day_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          exercises: d.exercises.map((e) => ({
            ...e,
            id: `c_ex_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
          }))
        }))
      };
      const updated = [duplicated, ...state.customPlans];
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
    return duplicated;
  },

  importProgramAsEditablePlan: (program) => {
    const importedPlan: CustomWorkoutPlan = {
      id: `imported_${program.id}_${Date.now()}`,
      title: `${program.title} (Personal Copy)`,
      description: program.description,
      daysPerWeek: program.daysPerWeek,
      goal: program.tagline || 'Hypertrophy Program',
      status: 'active',
      isImportedFromTemplate: true,
      sourceTemplateId: program.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days: program.weeklyStructure.map((day, dIdx) => ({
        id: `day_${Date.now()}_${dIdx}`,
        name: day.dayName,
        focus: day.focus,
        scheduledDay: day.scheduledDay || 'Unscheduled',
        exercises: day.exercises.map((ex, eIdx) => {
          const matchedEx = getOrBuildExercise(EXERCISES_LIBRARY, {
            exerciseId: (ex as any).exerciseId,
            name: ex.name,
            equipment: (ex as any).equipment,
            primaryMuscle: ex.primaryMuscle,
            notes: ex.notes
          });
          return {
            id: `c_ex_${Date.now()}_${dIdx}_${eIdx}`,
            exerciseId: matchedEx.id,
            name: ex.name,
            equipment: matchedEx.equipment,
            sets: ex.sets,
            reps: ex.targetReps,
            restSeconds: ex.restSeconds || 120,
            primaryMuscle: ex.primaryMuscle,
            notes: ex.notes,
            optional: ex.optional
          };
        })
      }))
    };

    set((state) => ({
      customPlans: [importedPlan, ...state.customPlans],
      activePlanId: importedPlan.id,
      activeTab: 'train'
    }));

    return importedPlan;
  },

  addCustomExerciseToLibrary: (exercise) => {
    const normEx: Exercise = {
      ...exercise,
      primaryMuscle: normalizeMuscleGroup(exercise.primaryMuscle, exercise.name)
    };
    set((state) => {
      const filtered = state.exercisesLibrary.filter((e) => e.id !== normEx.id && e.name.toLowerCase() !== normEx.name.toLowerCase());
      const updatedLib = [normEx, ...filtered];
      try {
        const customOnly = updatedLib.filter((e) => e.id.startsWith('ex_user_') || e.id.startsWith('ex_custom_') || e.id.startsWith('c_ex_'));
        localStorage.setItem(STORAGE_KEY_CUSTOM_EXERCISES, JSON.stringify(customOnly));
      } catch {}
      return { exercisesLibrary: updatedLib };
    });
  },

  addDayToPlan: (planId, dayName, scheduledDay = 'Unscheduled') => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        const newDay: CustomWorkoutDay = {
          id: `day_${Date.now()}`,
          name: dayName || `Day ${plan.days.length + 1}`,
          focus: 'Hypertrophy Focus',
          scheduledDay: scheduledDay,
          exercises: []
        };
        return { ...plan, days: [...plan.days, newDay], daysPerWeek: plan.days.length + 1, updatedAt: new Date().toISOString() };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  updatePlanDay: (planId, dayId, updates) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => (day.id === dayId ? { ...day, ...updates } : day))
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  deletePlanDay: (planId, dayId) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        const filteredDays = plan.days.filter((d) => d.id !== dayId);
        return { ...plan, days: filteredDays, daysPerWeek: filteredDays.length, updatedAt: new Date().toISOString() };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  duplicatePlanDay: (planId, dayId) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        const targetDay = plan.days.find((d) => d.id === dayId);
        if (!targetDay) return plan;
        const duplicatedDay: CustomWorkoutDay = {
          ...targetDay,
          id: `day_${Date.now()}`,
          name: `${targetDay.name} (Copy)`,
          exercises: targetDay.exercises.map((e) => ({ ...e, id: `c_ex_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` }))
        };
        return { ...plan, days: [...plan.days, duplicatedDay], daysPerWeek: plan.days.length + 1, updatedAt: new Date().toISOString() };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  reorderPlanDays: (planId, startIndex, endIndex) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        const reordered = Array.from(plan.days);
        const [removed] = reordered.splice(startIndex, 1);
        reordered.splice(endIndex, 0, removed);
        return { ...plan, days: reordered, updatedAt: new Date().toISOString() };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  addExerciseToPlanDay: (planId, dayId, exercise) => {
    const normMuscle = normalizeMuscleGroup(exercise.primaryMuscle, exercise.name);
    
    // Ensure custom/new exercise gets added to the library state and storage
    get().addCustomExerciseToLibrary({
      ...exercise,
      primaryMuscle: normMuscle
    });

    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            const newPlanExercise: CustomWorkoutExercise = {
              id: `c_ex_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              exerciseId: exercise.id,
              name: exercise.name,
              equipment: exercise.equipment,
              sets: 3,
              reps: exercise.recommendedHypertrophyRange || '8-12',
              restSeconds: 120,
              primaryMuscle: normMuscle,
              notes: exercise.cue,
              warmupSets: 1,
              targetRIR: exercise.defaultRIR || 1
            };
            return { ...day, exercises: [...day.exercises, newPlanExercise] };
          })
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  updatePlanExercise: (planId, dayId, exerciseId, updates) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            return {
              ...day,
              exercises: day.exercises.map((ex) => (ex.id === exerciseId ? { ...ex, ...updates } : ex))
            };
          })
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  deletePlanExercise: (planId, dayId, exerciseId) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            return {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId)
            };
          })
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  duplicatePlanExercise: (planId, dayId, exerciseId) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            const targetEx = day.exercises.find((ex) => ex.id === exerciseId);
            if (!targetEx) return day;
            const duplicatedEx: CustomWorkoutExercise = {
              ...targetEx,
              id: `c_ex_${Date.now()}`
            };
            return { ...day, exercises: [...day.exercises, duplicatedEx] };
          })
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  reorderPlanExercises: (planId, dayId, startIndex, endIndex) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            const reordered = Array.from(day.exercises);
            const [removed] = reordered.splice(startIndex, 1);
            reordered.splice(endIndex, 0, removed);
            return { ...day, exercises: reordered };
          })
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  replacePlanExercise: (planId, dayId, oldExerciseId, newExercise) => {
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            return {
              ...day,
              exercises: day.exercises.map((ex) => {
                if (ex.id !== oldExerciseId) return ex;
                return {
                  ...ex,
                  exerciseId: newExercise.id,
                  name: newExercise.name,
                  equipment: newExercise.equipment,
                  primaryMuscle: newExercise.primaryMuscle,
                  notes: newExercise.cue || ex.notes
                };
              })
            };
          })
        };
      });
      try { localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(updated)); } catch {}
      return { customPlans: updated };
    });
  },

  startWorkoutFromPlanDay: (planTitle, day) => {
    const history = get().workoutHistory;
    const persistentNotes = get().persistentNotes;

    const activeWorkoutExercises: PlannedExercise[] = day.exercises.map((cEx, idx) => {
      const libraryEx = getOrBuildExercise(get().exercisesLibrary, cEx);
      
      const lastLogs = getLastLogsForExercise(history, persistentNotes, libraryEx.id) ||
                       getLastLogsForExercise(history, persistentNotes, libraryEx.name);

      const warmupCount = cEx.warmupSets || 0;
      const workingCount = cEx.sets || 3;
      const parsedSets: ExerciseSet[] = [];

      const baseWeight = lastLogs.lastWeight !== undefined ? lastLogs.lastWeight : 30;
      const baseReps = lastLogs.lastReps !== undefined ? lastLogs.lastReps : (parseInt((cEx.reps || '10').split('-')[0]) || 10);

      for (let w = 0; w < warmupCount; w++) {
        const warmupWeight = Math.max(10, Math.round((baseWeight * 0.5) / 2.5) * 2.5);
        parsedSets.push({
          id: `set_w_${Date.now()}_${idx}_${w}`,
          setNumber: w + 1,
          type: 'warmup',
          weight: warmupWeight,
          reps: 12,
          rir: 3,
          completed: false,
          previousWeight: warmupWeight,
          previousReps: 12
        });
      }

      for (let s = 0; s < workingCount; s++) {
        const lastSetForIndex = lastLogs.sets && lastLogs.sets.filter(st => st.type === 'working')[s];
        const setWeight = lastSetForIndex ? lastSetForIndex.weight : baseWeight;
        const setReps = lastSetForIndex ? lastSetForIndex.reps : baseReps;

        parsedSets.push({
          id: `set_${Date.now()}_${idx}_${s}`,
          setNumber: warmupCount + s + 1,
          type: 'working',
          weight: setWeight,
          reps: setReps,
          rir: cEx.targetRIR ?? 1,
          completed: false,
          previousWeight: setWeight,
          previousReps: setReps
        });
      }

      const note = lastLogs.lastNote || cEx.notes || libraryEx.notes || libraryEx.cue;

      return {
        id: `pe_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        exercise: libraryEx,
        sets: parsedSets,
        notes: note,
        isOptional: cEx.optional,
        restSeconds: cEx.restSeconds || 120
      };
    });

    const newSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      title: `${planTitle}: ${day.name}`,
      focusMuscles: Array.from(new Set(day.exercises.map((e) => e.primaryMuscle))),
      date: new Date().toISOString().split('T')[0],
      durationSeconds: 0,
      completed: false,
      totalVolumeKg: 0,
      exercises: activeWorkoutExercises
    };

    const synced = syncActiveWorkoutToHistoryAndPRs(
      newSession,
      history,
      get().personalRecords,
      persistentNotes
    );

    set({
      ...synced,
      isWorkoutInProgress: true,
      activeTab: 'train'
    });
  },

  bodyMeasurements: loadSavedMeasurements(),
  addBodyMeasurement: (entry) => {
    const newEntry: BodyMeasurementEntry = {
      ...entry,
      id: `meas_${Date.now()}`
    };
    set((state) => {
      const updated = [newEntry, ...state.bodyMeasurements];
      try {
        localStorage.setItem(STORAGE_KEY_MEASUREMENTS, JSON.stringify(updated));
      } catch {}
      return { bodyMeasurements: updated };
    });
  },
  deleteBodyMeasurement: (id) => {
    set((state) => {
      const updated = state.bodyMeasurements.filter((m) => m.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_MEASUREMENTS, JSON.stringify(updated));
      } catch {}
      return { bodyMeasurements: updated };
    });
  },

  isOffline: false,
  lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  triggerSync: () => {
    set({
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
}));
