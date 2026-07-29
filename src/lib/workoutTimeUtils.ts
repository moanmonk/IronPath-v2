import { CustomWorkoutExercise, PlannedExercise } from '../types';

/**
 * Calculates the estimated workout duration in minutes for custom workout plan exercises.
 * Factoring in:
 * - Set execution time (~35 seconds per set for average reps/tempo)
 * - Rest intervals between sets (ex.restSeconds or default 90s)
 * - Equipment setup & exercise transition buffer (~60s per exercise)
 */
export function calculateCustomDayDurationMinutes(exercises: CustomWorkoutExercise[]): number {
  if (!exercises || exercises.length === 0) return 0;

  let totalSeconds = 0;

  exercises.forEach((ex) => {
    const warmupSets = ex.warmupSets || 0;
    const totalSets = Math.max(1, (ex.sets || 1) + warmupSets);
    const restPerSet = typeof ex.restSeconds === 'number' ? ex.restSeconds : 90;
    const executionPerSet = 35; // average seconds per set

    // Total time = (sets * 35s) + ((sets - 1) * restPerSet) + 60s transition
    const exerciseTime = (totalSets * executionPerSet) + (Math.max(0, totalSets - 1) * restPerSet) + 60;
    totalSeconds += exerciseTime;
  });

  return Math.ceil(totalSeconds / 60);
}

/**
 * Calculates estimated duration in minutes for active session planned exercises.
 */
export function calculateActiveWorkoutDurationMinutes(exercises: PlannedExercise[]): number {
  if (!exercises || exercises.length === 0) return 0;

  let totalSeconds = 0;

  exercises.forEach((pe) => {
    const totalSets = Math.max(1, pe.sets?.length || 1);
    const restPerSet = 90; // default rest time
    const executionPerSet = 35;

    const exerciseTime = (totalSets * executionPerSet) + (Math.max(0, totalSets - 1) * restPerSet) + 60;
    totalSeconds += exerciseTime;
  });

  return Math.ceil(totalSeconds / 60);
}

/**
 * Formats minutes into a clean readable string (e.g., "~45 mins" or "~1h 15m")
 */
export function formatDurationMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 mins';
  if (minutes < 60) return `~${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `~${hours}h ${remainingMins}m` : `~${hours}h`;
}
