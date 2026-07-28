import { 
  PhysiqueTargetCard, 
  Exercise, 
  WorkoutSession, 
  MuscleRecovery, 
  PersonalRecord, 
  Program, 
  UserProfile,
  BodyMeasurementEntry 
} from '../types';
import { COMPREHENSIVE_EXERCISES_LIBRARY } from './exerciseDatabase';

export const PHYSIQUE_TARGET_CARDS: PhysiqueTargetCard[] = [
  {
    id: 'lean_v_taper',
    name: 'Lean V-Taper',
    tagline: 'Wide Lats, Capped Side Delts & Narrow Waist',
    description: 'Optimized for creating a wide upper body silhouette with sweeping lats, 3D side lateral delts, and upper chest density.',
    emphasizedMuscles: ['Lats', 'Side Delts', 'Upper Chest'],
    iconName: 'Shield',
    bgGradient: 'from-purple-500/20 to-indigo-600/10'
  },
  {
    id: 'classic_aesthetic',
    name: 'Classic Aesthetic',
    tagline: 'Golden Ratio Symmetry & Fullness',
    description: 'Balanced muscle density across major groups prioritizing symmetrical growth, arm thickness, sweeping quads, and deep abs.',
    emphasizedMuscles: ['Chest', 'Lats', 'Biceps', 'Quads'],
    iconName: 'Crown',
    bgGradient: 'from-violet-500/20 to-purple-700/10'
  },
  {
    id: 'mens_physique',
    name: "Men's Physique",
    tagline: '3D Shoulder Caps & Wide Lat Sweeps',
    description: 'Stage-ready proportions emphasizing capped deltoids, sweeping lats, sharp serratus, and full upper chest shelf.',
    emphasizedMuscles: ['Side Delts', 'Rear Delts', 'Upper Chest', 'Lats'],
    iconName: 'Zap',
    bgGradient: 'from-indigo-500/20 to-blue-600/10'
  },
  {
    id: 'balanced_physique',
    name: 'Balanced Physique',
    tagline: 'Uniform Proportional Growth',
    description: 'An even volume distribution split engineered for total body hypertrophy without over-prioritizing any single muscle group.',
    emphasizedMuscles: ['Full Body Uniformity'],
    iconName: 'Scale',
    bgGradient: 'from-emerald-500/20 to-teal-600/10'
  },
  {
    id: 'athletic_build',
    name: 'Athletic Build',
    tagline: 'Functional Hypertrophy & Power',
    description: 'Lean muscle development paired with core stability, powerful hips, and functional posture alignment.',
    emphasizedMuscles: ['Quads', 'Core', 'Upper Back', 'Shoulders'],
    iconName: 'Activity',
    bgGradient: 'from-rose-500/20 to-pink-600/10'
  },
  {
    id: 'x_frame',
    name: 'X-Frame',
    tagline: 'Ultra Wide Shoulders & Heavy Quad Sweep',
    description: 'The ultimate bodybuilding outline combining extreme shoulder sweep with powerful quad tear drops and calves.',
    emphasizedMuscles: ['Side Delts', 'Lats', 'Quads', 'Calves'],
    iconName: 'Flame',
    bgGradient: 'from-purple-600/20 to-indigo-600/10'
  },
  {
    id: 'upper_dominant',
    name: 'Upper Body Dominant',
    tagline: 'Heavy Upper Torso & Arm Specialization',
    description: 'Maximum volume focused on chest, lats, traps, shoulders, and arms with maintenance lower body volume.',
    emphasizedMuscles: ['Chest', 'Back Thickness', 'Biceps', 'Triceps'],
    iconName: 'Dumbbell',
    bgGradient: 'from-cyan-500/20 to-blue-700/10'
  },
  {
    id: 'lower_dominant',
    name: 'Lower Body Dominant',
    tagline: 'Quads, Hamstrings & Posterior Chain',
    description: 'Specialized leg growth programming prioritizing quad sweep, hamstring tie-ins, and glute hypertrophy.',
    emphasizedMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    iconName: 'Target',
    bgGradient: 'from-fuchsia-500/20 to-purple-600/10'
  },
  {
    id: 'custom',
    name: 'Build My Own',
    tagline: 'Custom Hypertrophy Blueprint',
    description: 'Tailor your own custom set allocations and prioritization across all 14 major muscle groups.',
    emphasizedMuscles: ['Your Selected Weak Points'],
    iconName: 'Sparkles',
    bgGradient: 'from-zinc-500/20 to-zinc-700/10'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  experience: 'Intermediate',
  primaryGoal: 'Build Muscle',
  physiqueTarget: 'lean_v_taper',
  weakMuscles: ['Upper Chest', 'Side Delts', 'Lats'],
  equipment: 'Commercial Gym',
  trainingDays: 5,
  workoutDuration: '60 Minutes',
  weightUnit: 'kg',
  hasCompletedOnboarding: false,
  theme: 'dark',
  accentColor: 'cyan',
  soundAlerts: true,
  defaultRestTimerSeconds: 120,
  streakDays: 14
};


export const EXERCISES_LIBRARY: Exercise[] = COMPREHENSIVE_EXERCISES_LIBRARY;

const OLD_EXERCISES_LIBRARY: Exercise[] = [
  {
    id: 'ex_1',
    name: 'Incline Dumbbell Bench Press (30°)',
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    equipment: 'dumbbell',
    category: 'compound',
    hypertrophyTier: 'S Tier',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench to 30 degrees to maximize upper chest clavicular head activation.',
      'Depress and retract scapula before unracking.',
      'Control the eccentric for 2-3 seconds down to a deep pectoral stretch.',
      'Drive dumbbells up and slightly inward without clacking at top.'
    ],
    setupInstructions: [
      'Adjust bench to 30 degrees (about two notches up).',
      'Sit with dumbbells resting upright on knees.',
      'Kick dumbbells back one at a time as you lie back.'
    ],
    executionInstructions: [
      'Maintain arched upper back and firmly planted feet.',
      'Lower weights until thumbs are near upper chest level.',
      'Press smoothly through mid-palm.'
    ],
    commonMistakes: [
      'Setting bench too steep (over 45° shifts load to front delts).',
      'Flaring elbows out at 90 degrees instead of 45-60 degrees.',
      'Cutting depth short before full stretch.'
    ],
    tips: ['Think about squeezing upper arms together across your chest.'],
    alternatives: ['Incline Smith Machine Press', 'Incline Cable Flye', 'Incline Barbell Press'],
    recommendedRepRange: '6 - 12 reps',
    recommendedHypertrophyRange: '8 - 10 reps @ RIR 1-2',
    recommendedStrengthRange: '5 - 8 reps @ RIR 2',
    cue: 'Think about squeezing upper arms together across your chest rather than pushing up.',
    defaultRIR: 1,
    notes: 'Premier upper chest builder with high stretch tension.'
  },
  {
    id: 'ex_2',
    name: 'Cable Side Lateral Raise',
    primaryMuscle: 'side_delts',
    secondaryMuscles: [],
    equipment: 'cable',
    category: 'isolation',
    hypertrophyTier: 'S Tier',
    difficulty: 'Beginner',
    instructions: [
      'Set cable pulley at hand height or slightly lower.',
      'Cross cable behind body or hold slightly in front.',
      'Raise arm out to the side in the scapular plane (15° forward).',
      'Pause briefly at top peak contraction.'
    ],
    setupInstructions: [
      'Set single pulley to knee or waist height.',
      'Stand side-on or slightly angled away from stack.'
    ],
    executionInstructions: [
      'Initiate sweep leading with elbow.',
      'Raise until arm is parallel to floor.',
      'Control 3-second lowering.'
    ],
    commonMistakes: [
      'Using momentum or shrugging with upper traps.',
      'Bending elbow past 90 degrees.'
    ],
    tips: ['Throw weight outwards toward walls, not straight up.'],
    alternatives: ['Dumbbell Lateral Raise', 'Machine Lateral Raise'],
    recommendedRepRange: '10 - 20 reps',
    recommendedHypertrophyRange: '12 - 15 reps @ RIR 0-1',
    recommendedStrengthRange: '8 - 10 reps @ RIR 2',
    cue: 'Lead with your elbows and throw the weight away from your body, not up.',
    defaultRIR: 0,
    notes: 'Constant cable tension maximizes side delt width.'
  },
  {
    id: 'ex_3',
    name: 'Chest-Supported T-Bar Row',
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'rear_delts', 'biceps'],
    equipment: 'machine',
    category: 'compound',
    hypertrophyTier: 'S Tier',
    difficulty: 'Intermediate',
    instructions: [
      'Lock chest against pad to eliminate momentum and spinal load.',
      'Pull elbows back at 45° angle for upper back density.',
      'Squeeze shoulder blades firmly at peak contraction.'
    ],
    setupInstructions: ['Adjust footplate so upper chest rests comfortably on pad.'],
    executionInstructions: [
      'Let arms fully extend down for mid-back stretch.',
      'Row handles towards lower ribs.',
      'Pause for 1 second at top contraction.'
    ],
    commonMistakes: ['Lifting chest off pad during heavy reps.'],
    tips: ['Focus on driving elbows straight back.'],
    alternatives: ['Chest-Supported Dumbbell Row', 'Seated Cable Row Wide Grip'],
    recommendedRepRange: '8 - 12 reps',
    recommendedHypertrophyRange: '8 - 12 reps @ RIR 1',
    recommendedStrengthRange: '6 - 8 reps @ RIR 2',
    cue: 'Drive back with your elbows like elbowing someone behind you.',
    defaultRIR: 1,
    notes: 'Zero lower back loading makes this ideal for pure upper back hypertrophy.'
  },
  {
    id: 'ex_4',
    name: 'Neutral Grip Lat Pulldown',
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back'],
    equipment: 'cable',
    category: 'compound',
    hypertrophyTier: 'S Tier',
    difficulty: 'Beginner',
    instructions: [
      'Attach neutral grip handle to pulldown cable.',
      'Maintain slight 10° backward lean.',
      'Drive elbows down towards hips.'
    ],
    setupInstructions: ['Lock thigh pad securely over legs.'],
    executionInstructions: ['Stretch fully at top.', 'Pull attachment to upper chest.'],
    commonMistakes: ['Leaning back 45° converting it to a row.'],
    tips: ['Tuck elbows close to ribs.'],
    alternatives: ['Single Arm Neutral Cable Lat Pulldown', 'Assisted Pull Up'],
    recommendedRepRange: '8 - 15 reps',
    recommendedHypertrophyRange: '10 - 12 reps @ RIR 1',
    recommendedStrengthRange: '6 - 8 reps @ RIR 2',
    cue: 'Tuck elbows into your front pockets to feel lat fibers fire.',
    defaultRIR: 1,
    notes: 'Unbeatable for lat width sweep.'
  },
  {
    id: 'ex_5',
    name: 'Incline Bayesian Cable Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'cable',
    category: 'isolation',
    hypertrophyTier: 'S Tier',
    difficulty: 'Intermediate',
    instructions: [
      'Attach handles to bottom pulleys and face away from machine.',
      'Step forward so arms are pulled behind torso under stretch.',
      'Curl forward keeping shoulder immobile.'
    ],
    setupInstructions: ['Set pulleys low, take two steps forward.'],
    executionInstructions: ['Emphasize deep bottom stretch.'],
    commonMistakes: ['Letting upper arm swing forward.'],
    tips: ['Keep wrists neutral.'],
    alternatives: ['Incline Dumbbell Curl', 'Preacher Curl'],
    recommendedRepRange: '10 - 15 reps',
    recommendedHypertrophyRange: '10 - 12 reps @ RIR 0-1',
    recommendedStrengthRange: '8 - 10 reps @ RIR 2',
    cue: 'Maximize the stretch at the bottom position where peak tension lives.',
    defaultRIR: 0,
    notes: 'Targets biceps long head in lengthened position.'
  },
  {
    id: 'ex_6',
    name: 'Dual Overhead Cable Triceps Extension',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
    category: 'isolation',
    hypertrophyTier: 'S Tier',
    difficulty: 'Intermediate',
    instructions: [
      'Set dual pulleys at shoulder height.',
      'Cross hands to grab opposite cables and step forward.',
      'Extend arms diagonally out.'
    ],
    setupInstructions: ['Set pulleys at shoulder height without attachments or with cuffs.'],
    executionInstructions: ['Extend forearms forward fully locking out.'],
    commonMistakes: ['Flare elbows excessively.'],
    tips: ['Maintain constant tension on triceps long head.'],
    alternatives: ['Skullcrushers', 'Rope Overhead Cable Extension'],
    recommendedRepRange: '10 - 15 reps',
    recommendedHypertrophyRange: '10 - 12 reps @ RIR 1',
    recommendedStrengthRange: '8 - 10 reps @ RIR 2',
    cue: 'Lock elbows in space and stretch long head deeply behind head.',
    defaultRIR: 1,
    notes: 'Maximum long head hypertrophy.'
  },
  {
    id: 'ex_7',
    name: 'Hack Squat (Low Foot Placement)',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes'],
    equipment: 'machine',
    category: 'compound',
    hypertrophyTier: 'S Tier',
    difficulty: 'Intermediate',
    instructions: [
      'Place feet lower on platform for maximal knee travel.',
      'Descend into full flexed knee depth.',
      'Press through midfoot.'
    ],
    setupInstructions: ['Position shoulders comfortably under pads.'],
    executionInstructions: ['Control 3-second descent.'],
    commonMistakes: ['Heels lifting off platform.'],
    tips: ['Keep lower back pressed flat into back pad.'],
    alternatives: ['Smith Machine Squat', 'Leg Press'],
    recommendedRepRange: '6 - 12 reps',
    recommendedHypertrophyRange: '8 - 10 reps @ RIR 1',
    recommendedStrengthRange: '5 - 8 reps @ RIR 2',
    cue: 'Let knees travel freely forward over toes while keeping heels planted.',
    defaultRIR: 1,
    notes: 'Gold standard quad builder.'
  },
  {
    id: 'ex_8',
    name: 'Seated Hamstring Curl',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: [],
    equipment: 'machine',
    category: 'isolation',
    hypertrophyTier: 'S Tier',
    difficulty: 'Beginner',
    instructions: [
      'Lock thigh pad securely against lap.',
      'Flex toes back toward shins.',
      'Curl lower pad down under seat.'
    ],
    setupInstructions: ['Align knee joint with machine pivot axis.'],
    executionInstructions: ['Full hamstring flexion and controlled stretch.'],
    commonMistakes: ['Loose thigh pad allowing hips to rise.'],
    tips: ['Maintain dorsiflexed ankles.'],
    alternatives: ['Lying Leg Curl', 'Romanian Deadlift'],
    recommendedRepRange: '8 - 15 reps',
    recommendedHypertrophyRange: '10 - 12 reps @ RIR 0-1',
    recommendedStrengthRange: '6 - 8 reps @ RIR 2',
    cue: 'Resist the return stroke slowly for 3 full seconds.',
    defaultRIR: 0,
    notes: 'Greater hamstring lengthening than lying curl.'
  },
  {
    id: 'ex_9',
    name: 'Barbell Romanian Deadlift (RDL)',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'upper_back'],
    equipment: 'barbell',
    category: 'compound',
    hypertrophyTier: 'S Tier',
    difficulty: 'Intermediate',
    instructions: [
      'Stand with feet hip-width apart holding barbell with overhand grip.',
      'Hinge at hips, pushing glutes backward while keeping bar close to legs.',
      'Descend until hamstrings reach full stretch below knees.',
      'Drive hips forward to return to starting position.'
    ],
    setupInstructions: ['Unrack barbell from rack at thigh height.'],
    executionInstructions: ['Maintain neutral spine throughout hinge movement.'],
    commonMistakes: ['Rounding lower back at bottom.', 'Bending knees into a conventional deadlift.'],
    tips: ['Keep bar drag against thighs throughout movement.'],
    alternatives: ['Dumbbell RDL', 'Single Leg RDL'],
    recommendedRepRange: '6 - 12 reps',
    recommendedHypertrophyRange: '8 - 10 reps @ RIR 1-2',
    recommendedStrengthRange: '5 - 8 reps @ RIR 2',
    cue: 'Imagine pushing a door shut behind you with your glutes.',
    defaultRIR: 2,
    notes: 'Elite posterior chain lengthener.'
  },
  {
    id: 'ex_10',
    name: 'Standing Calf Raise (Machine or Smith)',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
    category: 'isolation',
    hypertrophyTier: 'A Tier',
    difficulty: 'Beginner',
    instructions: [
      'Place balls of feet on platform edge with heels hanging off.',
      'Lower heels down into deep ankle stretch.',
      'Drive up onto big toes and hold peak contraction for 1 second.'
    ],
    setupInstructions: ['Set shoulder pads firmly over shoulders.'],
    executionInstructions: ['Pause 2 seconds at the stretch bottom to remove Achilles elasticity.'],
    commonMistakes: ['Bouncing rapidly at bottom without pausing.'],
    tips: ['Pause strictly at the bottom before driving up.'],
    alternatives: ['Leg Press Calf Raise', 'Donkey Calf Raise'],
    recommendedRepRange: '10 - 20 reps',
    recommendedHypertrophyRange: '12 - 15 reps @ RIR 0',
    recommendedStrengthRange: '8 - 10 reps @ RIR 1',
    cue: 'Drive straight up through your big toe joint.',
    defaultRIR: 0,
    notes: 'Gastrocnemius specialization.'
  }
];

export const FEATURED_PROGRAMS: Program[] = [
  // 3-DAY PROGRAMS
  {
    id: 'prog_fullbody_3d',
    title: 'Full Body Hypertrophy (3-Day)',
    tagline: 'High frequency total body development split',
    level: 'Intermediate',
    daysPerWeek: 3,
    physiqueFocus: 'balanced_physique',
    description: 'A scientifically structured 3-day workout plan delivering total body hypertrophy using high-efficiency compound & isolation movements.',
    tags: ['3-Day', 'Full Body', 'High Frequency'],
    author: 'IronPath Science Team',
    targetAudience: 'Lifters looking for maximum efficiency with 3 training days per week.',
    recoveryExpectations: 'High systemic recovery due to 4 full rest days per week.',
    weeklyVolumeSummary: '12-15 direct working sets per muscle group weekly.',
    primaryEmphasisMuscles: ['Chest', 'Lats', 'Quads', 'Side Delts'],
    progressionRecommendations: ['Add 1-2 kg or 1 rep when target RIR is met on final set.'],
    weeklyStructure: [
      {
        dayName: 'Day 1: Full Body A',
        focus: 'Chest, Back, Quads, Arms',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Incline Bayesian Cable Curl', sets: 3, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      },
      {
        dayName: 'Day 2: Full Body B',
        focus: 'Upper Back, Shoulders, Hamstrings, Triceps',
        scheduledDay: 'Wednesday',
        exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: 3, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 3, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 3, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Day 3: Full Body C',
        focus: 'Quads, Chest, Lats, Arms',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '10-12', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 3, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Seated Hamstring Curl', sets: 3, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'hamstrings' }
        ]
      }
    ]
  },
  {
    id: 'prog_beginner_fb_3d',
    title: 'Beginner Full Body (3-Day)',
    tagline: 'Foundational hypertrophy & motor pattern mastery',
    level: 'Beginner',
    daysPerWeek: 3,
    physiqueFocus: 'balanced_physique',
    description: 'Perfect starting program designed for rapid neural adaptation, clean form mastery, and steady hypertrophy.',
    tags: ['3-Day', 'Beginner', 'Foundations'],
    author: 'IronPath Science Team',
    targetAudience: 'Newer lifters with less than 1 year of consistent gym training.',
    recoveryExpectations: 'Substantial time for joint and muscle tendon recovery between workouts.',
    weeklyVolumeSummary: '9-12 working sets per muscle group per week.',
    primaryEmphasisMuscles: ['Chest', 'Lats', 'Quads', 'Hamstrings'],
    progressionRecommendations: ['Focus on adding 1 rep per set weekly while keeping RIR 2.'],
    weeklyStructure: [
      {
        dayName: 'Workout A',
        focus: 'Total Body Push/Pull/Legs',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'quads' }
        ]
      },
      {
        dayName: 'Workout B',
        focus: 'Total Body Hinge/Row/Shoulder',
        scheduledDay: 'Wednesday',
        exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'hamstrings' },
          { name: 'Cable Side Lateral Raise', sets: 3, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Workout C',
        focus: 'Total Body Hypertrophy Density',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'quads' },
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Incline Bayesian Cable Curl', sets: 3, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      }
    ]
  },
  {
    id: 'prog_v_taper_3d',
    title: 'V-Taper Specialist (3-Day)',
    tagline: 'Upper width priority for limited schedule lifters',
    level: 'Intermediate',
    daysPerWeek: 3,
    physiqueFocus: 'lean_v_taper',
    description: 'Compresses upper body width specialization (Lats, Side Delts, Upper Chest) into 3 powerful high-intensity sessions.',
    tags: ['3-Day', 'V-Taper', 'Width Priority'],
    author: 'IronPath Science Team',
    targetAudience: 'Intermediate lifters wanting V-taper aesthetic results in 3 days.',
    recoveryExpectations: 'High local stimulus with rapid overall systemic recovery.',
    weeklyVolumeSummary: '16 sets Side Delts, 14 sets Lats, 12 sets Upper Chest.',
    primaryEmphasisMuscles: ['Side Delts', 'Lats', 'Upper Chest'],
    progressionRecommendations: ['Track side lateral raise loads carefully with 0.5kg increments.'],
    weeklyStructure: [
      {
        dayName: 'Day 1: Upper Width Focus',
        focus: 'Upper Chest, Lats, Side Delts',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Day 2: Legs & Arms',
        focus: 'Quads, Hamstrings, Arms',
        scheduledDay: 'Wednesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'hamstrings' },
          { name: 'Incline Bayesian Cable Curl', sets: 3, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 3, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Day 3: Upper Thickness & Sweep',
        focus: 'Upper Back, Side Delts, Chest',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' }
        ]
      }
    ]
  },

  // 4-DAY PROGRAMS
  {
    id: 'prog_v_taper_4d',
    title: 'V-Taper Architecture (4-Day)',
    tagline: 'Evidence-based upper body width specialization split',
    level: 'Intermediate',
    daysPerWeek: 4,
    physiqueFocus: 'lean_v_taper',
    description: 'High frequency side delt and lat stimulation combined with heavy upper chest presses and precise arm isolation.',
    tags: ['4-Day', 'V-Taper', 'Upper Priority'],
    author: 'IronPath Science Team',
    targetAudience: 'Lifters aiming for wide shoulder caps, sweeping lats, and narrow waist silhouette.',
    recoveryExpectations: 'Optimal balance between 4 training days and 3 rest days.',
    weeklyVolumeSummary: '18 sets Side Delts, 16 sets Lats, 14 sets Chest.',
    primaryEmphasisMuscles: ['Side Delts', 'Lats', 'Upper Chest'],
    progressionRecommendations: ['Maintain strict 2-3s eccentrics across all working sets.'],
    weeklyStructure: [
      {
        dayName: 'Day 1: Upper Width Focus',
        focus: 'Upper Chest, Lats, Side Delts',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Day 2: Quads & Arms',
        focus: 'Quads, Biceps, Triceps',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-12', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Day 3: Upper Thickness & Lats',
        focus: 'Upper Back, Side Delts, Chest',
        scheduledDay: 'Thursday',
        exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' }
        ]
      },
      {
        dayName: 'Day 4: Posterior Chain & Abs',
        focus: 'Hamstrings, Calves, Abs',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      }
    ]
  },
  {
    id: 'prog_upper_lower_4d',
    title: 'Upper Lower Hypertrophy (4-Day)',
    tagline: 'The gold standard 4-day structural split',
    level: 'Intermediate',
    daysPerWeek: 4,
    physiqueFocus: 'classic_aesthetic',
    description: 'Time-tested Upper/Lower split dividing upper body pushing/pulling and lower body quad/hamstring development across 4 workouts.',
    tags: ['4-Day', 'Upper Lower', 'Symmetry'],
    author: 'IronPath Science Team',
    targetAudience: 'All intermediate lifters seeking balanced mass and rapid recovery.',
    recoveryExpectations: 'Even workload split with mid-week and weekend rest days.',
    weeklyVolumeSummary: '14-16 sets per muscle group weekly.',
    primaryEmphasisMuscles: ['Chest', 'Back', 'Quads', 'Hamstrings'],
    progressionRecommendations: ['Cycle weekly intensity between RIR 2 and RIR 0 on week 4.'],
    weeklyStructure: [
      {
        dayName: 'Upper A',
        focus: 'Chest, Back, Shoulders, Arms',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Incline Bayesian Cable Curl', sets: 3, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      },
      {
        dayName: 'Lower A',
        focus: 'Quads, Hamstrings, Calves',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      },
      {
        dayName: 'Upper B',
        focus: 'Lats, Chest, Shoulders, Triceps',
        scheduledDay: 'Thursday',
        exercises: [
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 3, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Lower B',
        focus: 'Hamstrings, Quads, Calves',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings' },
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '10-12', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      }
    ]
  },
  {
    id: 'prog_torso_limbs_4d',
    title: 'Torso Limbs Split (4-Day)',
    tagline: 'Chest, Back & Shoulders on Torso Day; Arms & Legs on Limbs Day',
    level: 'Intermediate',
    daysPerWeek: 4,
    physiqueFocus: 'mens_physique',
    description: 'Unique programming grouping chest, lats, and shoulders on Torso Days, and quads, hamstrings, biceps, and triceps on Limbs Days.',
    tags: ['4-Day', 'Torso Limbs', 'Aesthetic'],
    author: 'IronPath Science Team',
    targetAudience: 'Lifters looking to dedicate focused session energy to arms and legs together.',
    recoveryExpectations: 'Allows arms to receive full recovery away from torso pressing.',
    weeklyVolumeSummary: '16 sets Torso, 16 sets Limbs weekly.',
    primaryEmphasisMuscles: ['Chest', 'Lats', 'Arms', 'Quads'],
    progressionRecommendations: ['Keep working sets strict with 1-2 RIR.'],
    weeklyStructure: [
      {
        dayName: 'Torso A',
        focus: 'Chest, Lats, Upper Back, Side Delts',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Chest-Supported T-Bar Row', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Limbs A',
        focus: 'Quads, Hamstrings, Biceps, Triceps',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Torso B',
        focus: 'Upper Back, Chest, Side Delts',
        scheduledDay: 'Thursday',
        exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Limbs B',
        focus: 'Posterior Chain, Quads, Arms',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '10-12', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Incline Bayesian Cable Curl', sets: 3, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      }
    ]
  },

  // 5-DAY PROGRAMS
  {
    id: 'prog_ppl_ul_5d',
    title: 'Push Pull Legs Upper Lower (5-Day)',
    tagline: 'Optimal frequency & volume blend for serious lifters',
    level: 'Advanced',
    daysPerWeek: 5,
    physiqueFocus: 'classic_aesthetic',
    description: 'Combines the hypertrophy mechanics of PPL with the structural volume distribution of Upper/Lower across 5 days.',
    tags: ['5-Day', 'PPL-UL Hybrid', 'High Volume'],
    author: 'IronPath Science Team',
    targetAudience: 'Experienced hypertrophy trainees seeking 2x per week muscle group hit frequency.',
    recoveryExpectations: 'Requires consistent nutrition and 8+ hours sleep per night.',
    weeklyVolumeSummary: '18-20 direct working sets per muscle group weekly.',
    primaryEmphasisMuscles: ['Chest', 'Lats', 'Shoulders', 'Quads', 'Arms'],
    progressionRecommendations: ['Deload every 6th week by reducing volume by 40%.'],
    weeklyStructure: [
      {
        dayName: 'Push',
        focus: 'Chest, Shoulders, Triceps',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Pull',
        focus: 'Lats, Upper Back, Biceps',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      },
      {
        dayName: 'Legs',
        focus: 'Quads, Hamstrings, Calves',
        scheduledDay: 'Wednesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Seated Hamstring Curl', sets: 3, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'hamstrings' }
        ]
      },
      {
        dayName: 'Upper Focus',
        focus: 'Upper Body Width & Density',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 3, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Cable Side Lateral Raise', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Lower Focus',
        focus: 'Quads, Posterior Chain, Arms',
        scheduledDay: 'Saturday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '10-12', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' },
          { name: 'Incline Bayesian Cable Curl', sets: 3, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      }
    ]
  },
  {
    id: 'prog_arm_priority_5d',
    title: 'Arm Priority Specialization (5-Day)',
    tagline: 'Dedicated Arm Days paired with Upper/Lower maintenance',
    level: 'Intermediate',
    daysPerWeek: 5,
    physiqueFocus: 'upper_dominant',
    description: 'Designed specifically to bring up lagging biceps and triceps through dedicated high-volume arm training sessions twice per week.',
    tags: ['5-Day', 'Arm Priority', 'Biceps & Triceps'],
    author: 'IronPath Science Team',
    targetAudience: 'Lifters prioritizing arm circumference growth.',
    recoveryExpectations: 'High arm recovery managed with reduced shoulder overhead volume.',
    weeklyVolumeSummary: '20 sets Biceps, 20 sets Triceps weekly.',
    primaryEmphasisMuscles: ['Biceps', 'Triceps', 'Side Delts'],
    progressionRecommendations: ['Utilize slow 3-second eccentrics on all arm isolation exercises.'],
    weeklyStructure: [
      {
        dayName: 'Arms & Shoulders A',
        focus: 'Biceps, Triceps, Side Delts',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Bayesian Cable Curl', sets: 5, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 5, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Legs',
        focus: 'Quads & Hamstrings',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings' }
        ]
      },
      {
        dayName: 'Torso (Chest & Back)',
        focus: 'Chest, Upper Back, Lats',
        scheduledDay: 'Thursday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' }
        ]
      },
      {
        dayName: 'Arms & Shoulders B',
        focus: 'Peak Arm Hypertrophy',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Incline Bayesian Cable Curl', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'triceps' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' }
        ]
      },
      {
        dayName: 'Lower & Core',
        focus: 'Hamstrings, Calves, Abs',
        scheduledDay: 'Saturday',
        exercises: [
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      }
    ]
  },

  // 6-DAY PROGRAMS
  {
    id: 'prog_ppl_hypertrophy_6d',
    title: 'Push Pull Legs Masterclass (6-Day)',
    tagline: 'High volume push pull legs split for bodybuilding',
    level: 'Advanced',
    daysPerWeek: 6,
    physiqueFocus: 'classic_aesthetic',
    description: 'The iconic 6-day PPL routine engineered for elite hypertrophy trainees with optimal exercise choices and high total volume.',
    tags: ['6-Day', 'PPL', 'Bodybuilding'],
    author: 'IronPath Science Team',
    targetAudience: 'Advanced lifters with high recovery capacity.',
    recoveryExpectations: 'Demands strict nutrition and sleep hygiene.',
    weeklyVolumeSummary: '20-22 working sets per muscle group weekly.',
    primaryEmphasisMuscles: ['Chest', 'Lats', 'Side Delts', 'Quads', 'Hamstrings'],
    progressionRecommendations: ['Cycle intensity between RIR 2 and RIR 0 on last sets.'],
    weeklyStructure: [
      {
        dayName: 'Push A',
        focus: 'Chest, Side Delts, Triceps',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Pull A',
        focus: 'Lats, Upper Back, Biceps',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      },
      {
        dayName: 'Legs A',
        focus: 'Quads, Hamstrings, Calves',
        scheduledDay: 'Wednesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      },
      {
        dayName: 'Push B',
        focus: 'Chest, Side Delts, Triceps',
        scheduledDay: 'Thursday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Pull B',
        focus: 'Upper Back, Lats, Biceps',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'upper_back' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'biceps' }
        ]
      },
      {
        dayName: 'Legs B',
        focus: 'Posterior Chain & Quads',
        scheduledDay: 'Saturday',
        exercises: [
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' },
          { name: 'Hack Squat (Low Foot Placement)', sets: 3, targetReps: '10-12', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      }
    ]
  },
  {
    id: 'prog_arnold_split_6d',
    title: 'Arnold Split Hypertrophy (6-Day)',
    tagline: 'Chest/Back, Shoulders/Arms, Legs classic bodybuilding split',
    level: 'Advanced',
    daysPerWeek: 6,
    physiqueFocus: 'classic_aesthetic',
    description: 'The golden era Arnold Schwarzenegger structure pairing antagonistic upper body muscle groups together for intense upper body pump and growth.',
    tags: ['6-Day', 'Arnold Split', 'Golden Era'],
    author: 'IronPath Science Team',
    targetAudience: 'Experienced bodybuilders looking for maximum upper body antagonistic volume.',
    recoveryExpectations: 'Very high local muscle fatigue.',
    weeklyVolumeSummary: '22 sets Chest, 22 sets Back, 20 sets Arms.',
    primaryEmphasisMuscles: ['Chest', 'Lats', 'Shoulders', 'Biceps', 'Triceps'],
    progressionRecommendations: ['Focus on deep pump and tension.'],
    weeklyStructure: [
      {
        dayName: 'Chest & Back A',
        focus: 'Chest & Lats Antagonistic',
        scheduledDay: 'Monday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '8-10', restSeconds: 120, primaryMuscle: 'lats' },
          { name: 'Chest-Supported T-Bar Row', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'upper_back' }
        ]
      },
      {
        dayName: 'Shoulders & Arms A',
        focus: 'Delts, Biceps, Triceps',
        scheduledDay: 'Tuesday',
        exercises: [
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Legs A',
        focus: 'Quads & Hamstrings',
        scheduledDay: 'Wednesday',
        exercises: [
          { name: 'Hack Squat (Low Foot Placement)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'quads' },
          { name: 'Barbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8-10', restSeconds: 180, primaryMuscle: 'hamstrings' }
        ]
      },
      {
        dayName: 'Chest & Back B',
        focus: 'Chest & Back Volume',
        scheduledDay: 'Thursday',
        exercises: [
          { name: 'Incline Dumbbell Bench Press (30°)', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'chest' },
          { name: 'Neutral Grip Lat Pulldown', sets: 4, targetReps: '10-12', restSeconds: 120, primaryMuscle: 'lats' }
        ]
      },
      {
        dayName: 'Shoulders & Arms B',
        focus: 'Delts & Arm Peak',
        scheduledDay: 'Friday',
        exercises: [
          { name: 'Cable Side Lateral Raise', sets: 5, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'side_delts' },
          { name: 'Incline Bayesian Cable Curl', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'biceps' },
          { name: 'Dual Overhead Cable Triceps Extension', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'triceps' }
        ]
      },
      {
        dayName: 'Legs B',
        focus: 'Hamstrings & Calves',
        scheduledDay: 'Saturday',
        exercises: [
          { name: 'Seated Hamstring Curl', sets: 4, targetReps: '10-12', restSeconds: 90, primaryMuscle: 'hamstrings' },
          { name: 'Standing Calf Raise (Machine or Smith)', sets: 4, targetReps: '12-15', restSeconds: 90, primaryMuscle: 'calves' }
        ]
      }
    ]
  }
];

export const INITIAL_TODAY_WORKOUT: WorkoutSession = {
  id: 'session_today',
  title: 'V-Taper Priority: Upper Chest & Lat Sweeps',
  focusMuscles: ['chest', 'lats', 'side_delts', 'triceps'],
  date: new Date().toISOString().split('T')[0],
  durationSeconds: 0,
  completed: false,
  totalVolumeKg: 4280,
  exercises: [
    {
      id: 'pe_1',
      exercise: EXERCISES_LIBRARY[0], // Incline DB Bench Press
      sets: [
        { id: 's1', setNumber: 1, type: 'warmup', weight: 24, reps: 12, rir: 3, completed: true, previousWeight: 24, previousReps: 12 },
        { id: 's2', setNumber: 2, type: 'working', weight: 36, reps: 10, rir: 2, completed: true, previousWeight: 34, previousReps: 10 },
        { id: 's3', setNumber: 3, type: 'working', weight: 38, reps: 8, rir: 1, completed: false, previousWeight: 36, previousReps: 8 },
        { id: 's4', setNumber: 4, type: 'working', weight: 38, reps: 8, rir: 0, completed: false, previousWeight: 36, previousReps: 7 }
      ],
      notes: 'Focus on 3-sec pause in stretch position on last set'
    },
    {
      id: 'pe_2',
      exercise: EXERCISES_LIBRARY[1], // Cable Side Lateral
      sets: [
        { id: 's5', setNumber: 1, type: 'working', weight: 12.5, reps: 15, rir: 1, completed: false, previousWeight: 12.5, previousReps: 14 },
        { id: 's6', setNumber: 2, type: 'working', weight: 12.5, reps: 14, rir: 0, completed: false, previousWeight: 12.5, previousReps: 12 },
        { id: 's7', setNumber: 3, type: 'drop', weight: 10, reps: 18, rir: 0, completed: false, previousWeight: 10, previousReps: 16 }
      ],
      notes: 'Superset opportunity with Rear Delt Cables'
    },
    {
      id: 'pe_3',
      exercise: EXERCISES_LIBRARY[3], // Lat Pulldown
      sets: [
        { id: 's8', setNumber: 1, type: 'working', weight: 75, reps: 10, rir: 2, completed: false, previousWeight: 72.5, previousReps: 10 },
        { id: 's9', setNumber: 2, type: 'working', weight: 77.5, reps: 9, rir: 1, completed: false, previousWeight: 75, previousReps: 8 },
        { id: 's10', setNumber: 3, type: 'working', weight: 77.5, reps: 8, rir: 0, completed: false, previousWeight: 75, previousReps: 8 }
      ]
    },
    {
      id: 'pe_4',
      exercise: EXERCISES_LIBRARY[5], // Overhead Cable Extension
      sets: [
        { id: 's11', setNumber: 1, type: 'working', weight: 27.5, reps: 12, rir: 1, completed: false, previousWeight: 25, previousReps: 12 },
        { id: 's12', setNumber: 2, type: 'working', weight: 30, reps: 10, rir: 0, completed: false, previousWeight: 27.5, previousReps: 10 }
      ]
    }
  ]
};

export const RECOVERY_STATUS: MuscleRecovery[] = [
  { muscle: 'chest', name: 'Chest (Pectoralis Major)', recoveryPercentage: 88, hoursSinceLastTrained: 36, status: 'optimal', weeklySetsDone: 12, targetWeeklySets: 16 },
  { muscle: 'side_delts', name: 'Side Delts (Lateral Head)', recoveryPercentage: 98, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 18, targetWeeklySets: 20 },
  { muscle: 'front_delts', name: 'Front Delts (Anterior Head)', recoveryPercentage: 90, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 8, targetWeeklySets: 12 },
  { muscle: 'rear_delts', name: 'Rear Delts (Posterior Head)', recoveryPercentage: 95, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 12, targetWeeklySets: 16 },
  { muscle: 'lats', name: 'Lats (Latissimus Dorsi)', recoveryPercentage: 92, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 14, targetWeeklySets: 16 },
  { muscle: 'upper_back', name: 'Upper Back & Traps', recoveryPercentage: 90, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 11, targetWeeklySets: 14 },
  { muscle: 'biceps', name: 'Biceps & Brachialis', recoveryPercentage: 100, hoursSinceLastTrained: 72, status: 'optimal', weeklySetsDone: 10, targetWeeklySets: 14 },
  { muscle: 'triceps', name: 'Triceps (Long & Lateral Heads)', recoveryPercentage: 75, hoursSinceLastTrained: 24, status: 'recovering', weeklySetsDone: 11, targetWeeklySets: 14 },
  { muscle: 'forearms', name: 'Forearms & Flexors', recoveryPercentage: 100, hoursSinceLastTrained: 72, status: 'optimal', weeklySetsDone: 6, targetWeeklySets: 10 },
  { muscle: 'quads', name: 'Quads (Quadriceps Femoris)', recoveryPercentage: 45, hoursSinceLastTrained: 18, status: 'fatigued', weeklySetsDone: 12, targetWeeklySets: 14 },
  { muscle: 'hamstrings', name: 'Hamstrings (Biceps Femoris)', recoveryPercentage: 85, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 10, targetWeeklySets: 12 },
  { muscle: 'glutes', name: 'Glutes (Gluteus Maximus)', recoveryPercentage: 90, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 8, targetWeeklySets: 12 },
  { muscle: 'calves', name: 'Calves (Gastrocnemius & Soleus)', recoveryPercentage: 95, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 10, targetWeeklySets: 14 },
  { muscle: 'abs', name: 'Abs & Core (Rectus Abdominis)', recoveryPercentage: 98, hoursSinceLastTrained: 48, status: 'optimal', weeklySetsDone: 8, targetWeeklySets: 12 }
];

export const RECENT_PRS: PersonalRecord[] = [
  { id: 'pr_1', exerciseName: 'Incline DB Press', muscle: 'chest', weight: 38, reps: 8, estimated1RM: 48.2, date: '2026-07-25', isRecent: true },
  { id: 'pr_2', exerciseName: 'Hack Squat', muscle: 'quads', weight: 160, reps: 10, estimated1RM: 213.3, date: '2026-07-23', isRecent: true },
  { id: 'pr_3', exerciseName: 'Cable Lateral Raise', muscle: 'side_delts', weight: 15, reps: 12, estimated1RM: 21.0, date: '2026-07-21', isRecent: false }
];

export const INITIAL_BODY_MEASUREMENTS: BodyMeasurementEntry[] = [
  {
    id: 'meas_1',
    date: '2026-07-27',
    weightKg: 82.5,
    chestCm: 108,
    waistCm: 81,
    armsCm: 41.5,
    shouldersCm: 124,
    hipsCm: 98,
    thighsCm: 62,
    bodyFatPercentage: 14.5,
    notes: 'Morning weight, fasted. V-taper looking sharper.'
  },
  {
    id: 'meas_2',
    date: '2026-07-13',
    weightKg: 83.2,
    chestCm: 107,
    waistCm: 82.5,
    armsCm: 41.0,
    shouldersCm: 123,
    hipsCm: 99,
    thighsCm: 61.5,
    bodyFatPercentage: 15.2,
    notes: 'Baseline measurement before high volume mesocycle.'
  }
];
