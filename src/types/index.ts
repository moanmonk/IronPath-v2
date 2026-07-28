export type NavigationTab = 
  | 'train' 
  | 'programs' 
  | 'exercises' 
  | 'progress' 
  | 'settings';

export type MuscleGroup = 
  | 'chest' 
  | 'side_delts' 
  | 'front_delts' 
  | 'rear_delts' 
  | 'lats' 
  | 'upper_back' 
  | 'biceps' 
  | 'triceps' 
  | 'forearms'
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'abs';

export type PhysiqueTargetId = 
  | 'lean_v_taper' 
  | 'classic_aesthetic' 
  | 'mens_physique' 
  | 'balanced_physique'
  | 'athletic_build'
  | 'x_frame'
  | 'upper_dominant'
  | 'lower_dominant'
  | 'custom';

export interface PhysiqueTargetCard {
  id: PhysiqueTargetId;
  name: string;
  tagline: string;
  description: string;
  emphasizedMuscles: string[];
  iconName: string;
  bgGradient: string;
}

export type TrainingExperience = 'Beginner' | 'Intermediate' | 'Advanced';

export type PrimaryGoal = 
  | 'Build Muscle' 
  | 'Build Strength' 
  | 'Body Recomposition' 
  | 'Lose Fat While Maintaining Muscle' 
  | 'General Fitness';

export type EquipmentOption = 
  | 'Commercial Gym' 
  | 'Home Gym' 
  | 'Dumbbells Only' 
  | 'Bodyweight' 
  | 'Minimal Equipment';

export type WorkoutDurationOption = 
  | '30 Minutes' 
  | '45 Minutes' 
  | '60 Minutes' 
  | '75 Minutes' 
  | '90 Minutes';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'smith_machine' | 'ez_bar';
  category: 'compound' | 'isolation';
  hypertrophyTier: 'S Tier' | 'A Tier' | 'B Tier';
  difficulty?: TrainingExperience;
  instructions: string[];
  cue: string;
  defaultRIR: number;
  setupInstructions?: string[];
  executionInstructions?: string[];
  commonMistakes?: string[];
  tips?: string[];
  alternatives?: string[];
  recommendedRepRange?: string;
  recommendedHypertrophyRange?: string;
  recommendedStrengthRange?: string;
  notes?: string;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  type: 'warmup' | 'working' | 'drop' | 'myo_rep';
  previousWeight?: number;
  previousReps?: number;
  weight: number;
  reps: number;
  rir: number; // Reps in Reserve (0-4)
  completed: boolean;
}

export interface PlannedExercise {
  id: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  notes?: string;
  supersetGroup?: string;
  isOptional?: boolean;
}

export interface WorkoutSession {
  id: string;
  title: string;
  focusMuscles: MuscleGroup[];
  date: string;
  startTime?: string;
  endTime?: string;
  durationSeconds: number;
  completed: boolean;
  exercises: PlannedExercise[];
  notes?: string;
  rating?: number; // 1-5 scale
  totalVolumeKg: number;
}

export type PlanStatus = 'active' | 'saved' | 'archived';

export interface CustomWorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  equipment: string;
  sets: number;
  reps: string;
  restSeconds: number;
  primaryMuscle: MuscleGroup;
  notes?: string;
  optional?: boolean;
  warmupSets?: number;
  targetRIR?: number;
  tempoNotes?: string;
  weightTrackingEnabled?: boolean;
}

export interface CustomWorkoutDay {
  id: string;
  name: string;
  focus: string;
  scheduledDay?: string; // e.g., 'Monday', 'Wednesday', 'Unscheduled'
  isRestDay?: boolean;
  exercises: CustomWorkoutExercise[];
}

export interface CustomWorkoutPlan {
  id: string;
  title: string;
  description: string;
  daysPerWeek: number;
  goal?: string;
  notes?: string;
  status: PlanStatus;
  isImportedFromTemplate?: boolean;
  sourceTemplateId?: string;
  createdAt: string;
  updatedAt?: string;
  lastPerformedDate?: string;
  estimatedDurationMinutes?: number;
  days: CustomWorkoutDay[];
}

export interface MuscleRecovery {
  muscle: MuscleGroup;
  name: string;
  recoveryPercentage: number; // 0 - 100
  hoursSinceLastTrained: number;
  status: 'optimal' | 'recovering' | 'fatigued';
  weeklySetsDone: number;
  targetWeeklySets: number;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  muscle: MuscleGroup;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
  isRecent?: boolean;
}

export interface Program {
  id: string;
  title: string;
  tagline: string;
  level: TrainingExperience;
  daysPerWeek: number;
  physiqueFocus: PhysiqueTargetId;
  description: string;
  tags: string[];
  author: string;
  targetAudience?: string;
  recoveryExpectations?: string;
  weeklyVolumeSummary?: string;
  primaryEmphasisMuscles?: string[];
  progressionRecommendations?: string[];
  weeklyStructure: {
    dayName: string;
    focus: string;
    scheduledDay?: string;
    exercises: { 
      name: string; 
      sets: number; 
      targetReps: string; 
      restSeconds?: number;
      primaryMuscle: MuscleGroup;
      notes?: string;
      optional?: boolean;
    }[];
  }[];
}

export interface BodyMeasurementEntry {
  id: string;
  date: string;
  weightKg?: number;
  chestCm?: number;
  waistCm?: number;
  armsCm?: number;
  shouldersCm?: number;
  hipsCm?: number;
  thighsCm?: number;
  bodyFatPercentage?: number;
  notes?: string;
}

export type AccentColorId = 'amber' | 'indigo' | 'crimson' | 'cyan' | 'emerald' | 'violet' | 'orange';

export interface UserProfile {
  name: string;
  experience: TrainingExperience;
  primaryGoal: PrimaryGoal;
  physiqueTarget: PhysiqueTargetId;
  weakMuscles: string[];
  equipment: EquipmentOption;
  trainingDays: number;
  workoutDuration: WorkoutDurationOption;
  weightUnit: 'kg' | 'lbs';
  hasCompletedOnboarding: boolean;
  theme: 'dark' | 'light';
  accentColor?: AccentColorId;
  soundAlerts: boolean;
  defaultRestTimerSeconds: number;
  streakDays: number;
}

