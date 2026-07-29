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

export const getOrBuildExercise = (
  library: Exercise[],
  cEx: { exerciseId?: string; name: string; equipment?: string; primaryMuscle?: any; notes?: string }
): Exercise => {
  const nameTrim = (cEx.name || '').trim().toLowerCase();

  // 1. Exact ID match
  if (cEx.exerciseId) {
    const byId = library.find((e) => e.id === cEx.exerciseId);
    if (byId) return byId;
  }

  // 2. Exact name match
  if (nameTrim) {
    const byName = library.find((e) => e.name.trim().toLowerCase() === nameTrim);
    if (byName) return byName;
  }

  // 3. Clean name match (ignoring parenthetical details)
  if (nameTrim) {
    const cleanNameTrim = nameTrim.replace(/\([^)]*\)/g, '').trim();
    if (cleanNameTrim) {
      const byClean = library.find((e) => {
        const eClean = e.name.trim().toLowerCase().replace(/\([^)]*\)/g, '').trim();
        return eClean === cleanNameTrim || eClean.includes(cleanNameTrim) || cleanNameTrim.includes(eClean);
      });
      if (byClean) return byClean;
    }
  }

  // 4. Partial / includes name match
  if (nameTrim) {
    const byPartial = library.find((e) => {
      const eName = e.name.trim().toLowerCase();
      return eName.includes(nameTrim) || nameTrim.includes(eName);
    });
    if (byPartial) return byPartial;
  }

  // 5. Fallback: dynamically construct a unique Exercise object preserving original name, muscle, & equipment
  return {
    id: cEx.exerciseId || `ex_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cEx.name || 'Custom Exercise',
    primaryMuscle: cEx.primaryMuscle || 'chest',
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
  startWorkout: () => void;
  pauseWorkout: () => void;
  finishWorkout: () => void;
  toggleSetCompleted: (exerciseId: string, setId: string) => void;
  updateSetData: (exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => void;
  addSetToExercise: (exerciseId: string) => void;
  removeSetFromExercise: (exerciseId: string, setId: string) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
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
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

  startWorkout: () => {
    set({ isWorkoutInProgress: true });
  },

  pauseWorkout: () => {
    set({ isWorkoutInProgress: false });
  },

  finishWorkout: () => {
    const { activeWorkout } = get();
    // Celebrate & reset workout or mark as complete
    const completedWorkout: WorkoutSession = {
      ...activeWorkout,
      completed: true,
      endTime: new Date().toISOString()
    };
    set((state) => ({
      activeWorkout: completedWorkout,
      isWorkoutInProgress: false,
      activeTab: 'train',
      workoutHistory: [completedWorkout, ...state.workoutHistory]
    }));
    try {
      localStorage.removeItem(STORAGE_KEY_WORKOUT);
    } catch {}
  },

  toggleSetCompleted: (exerciseId, setId) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== exerciseId) return pe;
        const sets = pe.sets.map((s) => {
          if (s.id !== setId) return s;
          const newCompleted = !s.completed;
          // Trigger rest timer on completing a working set!
          if (newCompleted) {
            get().startRestTimer(state.userProfile.defaultRestTimerSeconds);
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

      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
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
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
    });
  },

  addSetToExercise: (exerciseId) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.map((pe) => {
        if (pe.id !== exerciseId) return pe;
        const lastSet = pe.sets[pe.sets.length - 1];
        const newSet: ExerciseSet = {
          id: `set_${Date.now()}`,
          setNumber: pe.sets.length + 1,
          type: 'working',
          weight: lastSet ? lastSet.weight : 20,
          reps: lastSet ? lastSet.reps : 10,
          rir: 1,
          completed: false,
          previousWeight: lastSet ? lastSet.weight : 20,
          previousReps: lastSet ? lastSet.reps : 10
        };
        return { ...pe, sets: [...pe.sets, newSet] };
      });

      const updatedWorkout = { ...state.activeWorkout, exercises };
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
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
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
    });
  },

  addExerciseToWorkout: (exercise) => {
    set((state) => {
      const newPlanned: PlannedExercise = {
        id: `pe_${Date.now()}`,
        exercise,
        sets: [
          {
            id: `set_${Date.now()}_1`,
            setNumber: 1,
            type: 'working',
            weight: 20,
            reps: 10,
            rir: 2,
            completed: false
          },
          {
            id: `set_${Date.now()}_2`,
            setNumber: 2,
            type: 'working',
            weight: 20,
            reps: 10,
            rir: 1,
            completed: false
          }
        ]
      };

      const exercises = [...state.activeWorkout.exercises, newPlanned];
      const updatedWorkout = { ...state.activeWorkout, exercises };
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
    });
  },

  removeExerciseFromWorkout: (exerciseId) => {
    set((state) => {
      const exercises = state.activeWorkout.exercises.filter((pe) => pe.id !== exerciseId);
      const updatedWorkout = { ...state.activeWorkout, exercises };
      try {
        localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(updatedWorkout));
      } catch {}

      return { activeWorkout: updatedWorkout };
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
    set({
      restTimer: {
        isRunning: true,
        secondsRemaining: duration,
        totalDuration: duration
      }
    });
  },

  stopRestTimer: () => {
    set((state) => ({
      restTimer: { ...state.restTimer, isRunning: false }
    }));
  },

  tickRestTimer: () => {
    set((state) => {
      if (!state.restTimer.isRunning) return state;
      if (state.restTimer.secondsRemaining <= 1) {
        return {
          restTimer: {
            ...state.restTimer,
            isRunning: false,
            secondsRemaining: 0
          }
        };
      }
      return {
        restTimer: {
          ...state.restTimer,
          secondsRemaining: state.restTimer.secondsRemaining - 1
        }
      };
    });
  },

  workoutHistory: [INITIAL_TODAY_WORKOUT],
  recoveryList: RECOVERY_STATUS,
  personalRecords: RECENT_PRS,

  // Custom Workout Plans (Manual Builder)
  customPlans: loadSavedPlans(),
  activePlanId: loadSavedPlans().find((p) => p.status === 'active')?.id || loadSavedPlans()[0]?.id || null,
  exercisesLibrary: EXERCISES_LIBRARY,

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
    set((state) => ({
      exercisesLibrary: [exercise, ...state.exercisesLibrary]
    }));
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
    set((state) => {
      const updated = state.customPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          updatedAt: new Date().toISOString(),
          days: plan.days.map((day) => {
            if (day.id !== dayId) return day;
            const newPlanExercise: CustomWorkoutExercise = {
              id: `c_ex_${Date.now()}`,
              exerciseId: exercise.id,
              name: exercise.name,
              equipment: exercise.equipment,
              sets: 3,
              reps: exercise.recommendedHypertrophyRange || '8-12',
              restSeconds: 120,
              primaryMuscle: exercise.primaryMuscle,
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
    const activeWorkoutExercises: PlannedExercise[] = day.exercises.map((cEx, idx) => {
      const libraryEx = getOrBuildExercise(get().exercisesLibrary, cEx);
      
      const parsedSets: ExerciseSet[] = Array.from({ length: cEx.sets || 3 }, (_, sIdx) => ({
        id: `set_${Date.now()}_${idx}_${sIdx}`,
        setNumber: sIdx + 1,
        type: 'working',
        weight: 30,
        reps: parseInt((cEx.reps || '10').split('-')[0]) || 10,
        rir: cEx.targetRIR ?? 1,
        completed: false
      }));

      return {
        id: `pe_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        exercise: libraryEx,
        sets: parsedSets,
        notes: cEx.notes,
        isOptional: cEx.optional
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

    set({
      activeWorkout: newSession,
      isWorkoutInProgress: true,
      activeTab: 'train'
    });

    try {
      localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(newSession));
    } catch {}
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
