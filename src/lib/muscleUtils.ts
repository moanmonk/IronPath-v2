import { MuscleGroup } from '../types';

/**
 * Normalizes any muscle group string or fuzzy exercise name to one of the 14 valid IronPath MuscleGroup IDs:
 * - chest, side_delts, front_delts, rear_delts, lats, upper_back, biceps, triceps, forearms, quads, hamstrings, glutes, calves, abs
 */
export const normalizeMuscleGroup = (
  rawMuscle?: string,
  exerciseName?: string
): MuscleGroup => {
  const m = (rawMuscle || '').toLowerCase().trim().replace(/[-_\s]+/g, '_');
  const name = (exerciseName || '').toLowerCase().trim();

  const validMuscles: MuscleGroup[] = [
    'chest', 'side_delts', 'front_delts', 'rear_delts',
    'lats', 'upper_back', 'biceps', 'triceps', 'forearms',
    'quads', 'hamstrings', 'glutes', 'calves', 'abs'
  ];

  // 1. Direct valid match
  if (validMuscles.includes(m as MuscleGroup)) {
    return m as MuscleGroup;
  }

  // 2. String alias mapping
  if (m.includes('chest') || m.includes('pec') || m.includes('push')) return 'chest';

  if (m.includes('side_delt') || m.includes('lateral_delt') || m.includes('medial_delt')) return 'side_delts';
  if (m.includes('front_delt') || m.includes('anterior_delt')) return 'front_delts';
  if (m.includes('rear_delt') || m.includes('posterior_delt')) return 'rear_delts';
  if (m.includes('delt') || m.includes('shoulder')) {
    if (name.includes('front') || name.includes('overhead') || name.includes('military') || name.includes('arnold')) return 'front_delts';
    if (name.includes('rear') || name.includes('face pull') || name.includes('reverse fly') || name.includes('bent over')) return 'rear_delts';
    return 'side_delts';
  }

  if (m.includes('lat') || m.includes('pulldown') || m.includes('width')) return 'lats';
  if (m.includes('upper_back') || m.includes('rhomboid') || m.includes('trap') || m.includes('back')) {
    if (name.includes('pulldown') || name.includes('lat') || name.includes('chin') || name.includes('pullup') || name.includes('pull up') || name.includes('pullover')) return 'lats';
    return 'upper_back';
  }

  if (m.includes('bicep') || m.includes('arm_flexor')) return 'biceps';
  if (m.includes('tricep') || m.includes('arm_extensor')) return 'triceps';
  if (m.includes('arm')) {
    if (name.includes('tricep') || name.includes('pushdown') || name.includes('skull') || name.includes('extension')) return 'triceps';
    return 'biceps';
  }

  if (m.includes('quad') || m.includes('thigh')) return 'quads';
  if (m.includes('hamstring') || m.includes('leg_curl') || m.includes('posterior_chain')) return 'hamstrings';
  if (m.includes('glute') || m.includes('butt') || m.includes('hip')) return 'glutes';
  if (m.includes('calf') || m.includes('gastrocnemius') || m.includes('soleus')) return 'calves';
  if (m.includes('ab') || m.includes('core') || m.includes('stomach') || m.includes('abdominal')) return 'abs';
  if (m.includes('forearm') || m.includes('grip') || m.includes('wrist')) return 'forearms';
  if (m.includes('leg')) {
    if (name.includes('curl') || name.includes('rdl') || name.includes('deadlift')) return 'hamstrings';
    if (name.includes('calf') || name.includes('raise')) return 'calves';
    if (name.includes('hip') || name.includes('glute')) return 'glutes';
    return 'quads';
  }

  // 3. Fallback inference directly from exercise name
  if (name.includes('bench') || name.includes('chest') || name.includes('fly') || name.includes('pushup') || name.includes('dip')) return 'chest';
  if (name.includes('pulldown') || name.includes('chin') || name.includes('lat') || name.includes('pullover')) return 'lats';
  if (name.includes('row') || name.includes('t-bar') || name.includes('shrug') || name.includes('back') || name.includes('face pull')) return 'upper_back';
  if (name.includes('lateral') || name.includes('delt') || name.includes('shoulder')) return 'side_delts';
  if (name.includes('overhead') || name.includes('military') || name.includes('front raise')) return 'front_delts';
  if (name.includes('curl') || name.includes('bicep')) return 'biceps';
  if (name.includes('extension') || name.includes('tricep') || name.includes('pushdown') || name.includes('skull crusher')) return 'triceps';
  if (name.includes('squat') || name.includes('leg press') || name.includes('quad') || name.includes('lunge') || name.includes('leg extension')) return 'quads';
  if (name.includes('rdl') || name.includes('hamstring') || name.includes('leg curl') || name.includes('deadlift')) return 'hamstrings';
  if (name.includes('hip thrust') || name.includes('glute')) return 'glutes';
  if (name.includes('calf') || name.includes('calves')) return 'calves';
  if (name.includes('crunch') || name.includes('ab') || name.includes('plank') || name.includes('leg raise')) return 'abs';
  if (name.includes('wrist') || name.includes('forearm') || name.includes('hammer')) return 'forearms';

  return 'chest';
};
