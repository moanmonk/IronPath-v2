import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Dumbbell, 
  Target, 
  Shield, 
  Zap, 
  Crown, 
  Activity, 
  Flame, 
  Scale, 
  Sparkles, 
  Building, 
  Home, 
  Feather, 
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { 
  UserProfile, 
  TrainingExperience, 
  PrimaryGoal, 
  EquipmentOption, 
  WorkoutDurationOption 
} from '../../types';
import { PHYSIQUE_TARGET_CARDS } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { IronPathLogo } from '../../components/ui/IronPathLogo';

const WEAK_MUSCLE_OPTIONS = [
  'Chest',
  'Upper Chest',
  'Lats',
  'Back Thickness',
  'Side Delts',
  'Rear Delts',
  'Biceps',
  'Triceps',
  'Forearms',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core'
];

const EXPERIENCE_OPTIONS: { level: TrainingExperience; tagline: string; desc: string }[] = [
  {
    level: 'Beginner',
    tagline: 'Under 1 year of consistent lifting',
    desc: 'Focus on mastering key compound movement patterns, motor control, and rapid neural adaptations.'
  },
  {
    level: 'Intermediate',
    tagline: '1 to 3 years of structured training',
    desc: 'Ready for systematic volume periodization, weak-point specialization, and precise RIR management.'
  },
  {
    level: 'Advanced',
    tagline: '3+ years of dedicated hypertrophy training',
    desc: 'Optimized stimulus-to-fatigue ratios, specialized intensity techniques, and strict fatigue management.'
  }
];

const GOAL_OPTIONS: { goal: PrimaryGoal; desc: string; icon: string }[] = [
  { goal: 'Build Muscle', desc: 'Maximize total muscular hypertrophy and physical mass accumulation.', icon: 'Flame' },
  { goal: 'Build Strength', desc: 'Progressive overload focused on heavy compound strength & muscle density.', icon: 'Shield' },
  { goal: 'Body Recomposition', desc: 'Simultaneously build lean muscle mass while burning excess body fat.', icon: 'Zap' },
  { goal: 'Lose Fat While Maintaining Muscle', desc: 'Caloric deficit preservation of lean muscle tissue and vascularity.', icon: 'Target' },
  { goal: 'General Fitness', desc: 'Overall athletic conditioning, functional mobility, and healthy muscle tone.', icon: 'Activity' }
];

const EQUIPMENT_OPTIONS: { type: EquipmentOption; tagline: string; desc: string; icon: string }[] = [
  {
    type: 'Commercial Gym',
    tagline: 'Full Access',
    desc: 'Barbells, dumbbells, cable stacks, plate-loaded machines, and specialized hack squats.',
    icon: 'Building'
  },
  {
    type: 'Home Gym',
    tagline: 'Free Weights & Rack',
    desc: 'Power rack or squat stand, barbell with plates, dumbbells, and adjustable bench.',
    icon: 'Home'
  },
  {
    type: 'Dumbbells Only',
    tagline: 'Dumbbells & Bench',
    desc: 'Set of adjustable or fixed dumbbells paired with a flat or incline workout bench.',
    icon: 'Dumbbell'
  },
  {
    type: 'Bodyweight',
    tagline: 'Calisthenics Setup',
    desc: 'Pull-up bar, dip station, gymnastic rings, and bodyweight leverage exercises.',
    icon: 'Feather'
  },
  {
    type: 'Minimal Equipment',
    tagline: 'Light Setup',
    desc: 'Resistance bands, kettlebells, or light dumbbells for flexible home sessions.',
    icon: 'Layers'
  }
];

const TRAINING_DAYS_OPTIONS = [
  { days: 2, commitment: '~2.0 hrs / week', desc: 'Ideal for ultra-busy schedules or active recovery maintenance.' },
  { days: 3, commitment: '~3.5 hrs / week', desc: 'Classic 3-day Full Body rotation for high stimulus efficiency.' },
  { days: 4, commitment: '~4.5 hrs / week', desc: 'The sweet spot Upper / Lower split for balanced recovery.' },
  { days: 5, commitment: '~5.5 hrs / week', desc: 'Push / Pull / Legs + Upper / Lower specialization frequency.' },
  { days: 6, commitment: '~6.5 hrs / week', desc: 'Dedicated 6-day Push / Pull / Legs 2x hypertrophy rotation.' },
  { days: 7, commitment: '~7.5 hrs / week', desc: 'High frequency micro-dosed daily hypertrophy sessions.' }
];

const DURATION_OPTIONS: { duration: WorkoutDurationOption; desc: string }[] = [
  { duration: '30 Minutes', desc: 'Express high-density superset sessions.' },
  { duration: '45 Minutes', desc: 'Targeted 4-5 exercise hypertrophy workouts.' },
  { duration: '60 Minutes', desc: 'Standard optimal hypertrophy session length.' },
  { duration: '75 Minutes', desc: 'High-volume training with thorough warmups.' },
  { duration: '90 Minutes', desc: 'Maximum volume session for advanced lifters.' }
];

export const OnboardingFlow: React.FC = () => {
  const completeOnboarding = useIronPathStore((s) => s.completeOnboarding);
  const userProfile = useIronPathStore((s) => s.userProfile);

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: userProfile.name || 'Alex Rivera',
    experience: userProfile.experience || 'Intermediate',
    primaryGoal: userProfile.primaryGoal || 'Build Muscle',
    physiqueTarget: userProfile.physiqueTarget || 'lean_v_taper',
    weakMuscles: userProfile.weakMuscles?.length ? userProfile.weakMuscles : ['Upper Chest', 'Side Delts', 'Lats'],
    equipment: userProfile.equipment || 'Commercial Gym',
    trainingDays: userProfile.trainingDays || 5,
    workoutDuration: userProfile.workoutDuration || '60 Minutes',
    weightUnit: userProfile.weightUnit || 'kg',
    accentColor: 'violet'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const totalSteps = 10;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    setIsGenerating(true);
    setTimeout(() => {
      completeOnboarding({ ...formData, accentColor: 'violet' });
    }, 1000);
  };

  const toggleWeakMuscle = (muscle: string) => {
    setFormData((prev) => {
      const current = prev.weakMuscles || [];
      if (current.includes(muscle)) {
        return { ...prev, weakMuscles: current.filter((m) => m !== muscle) };
      } else {
        return { ...prev, weakMuscles: [...current, muscle] };
      }
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Crown': return <Crown className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Zap': return <Zap className="w-5 h-5 text-indigo-400 shrink-0" />;
      case 'Scale': return <Scale className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'Flame': return <Flame className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Target': return <Target className="w-5 h-5 text-fuchsia-400 shrink-0" />;
      case 'Building': return <Building className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'Feather': return <Feather className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400 shrink-0" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex flex-col overflow-y-auto overflow-x-hidden select-none">
      {/* Header Bar */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 py-3 sm:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={isGenerating}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Previous Step"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <IronPathLogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
              Step {step} of {totalSteps}
            </span>
            <div className="w-24 sm:w-32 h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Step Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-6"
          >
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <div className="text-center space-y-6 sm:space-y-8 py-4 sm:py-8">
                <div className="flex justify-center">
                  <IronPathLogo size="lg" showText={false} />
                </div>

                <div className="space-y-3 max-w-xl mx-auto">
                  <Badge variant="purple" className="px-3 py-1 text-xs">
                    PHYSIQUE COACHING PLATFORM
                  </Badge>
                  <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
                    Welcome to <span className="text-purple-400">IronPath</span>
                  </h1>
                  <p className="text-base sm:text-xl text-zinc-300 font-medium leading-relaxed italic border-l-2 border-purple-500/80 pl-4 text-left my-4">
                    "IronPath builds training plans around the physique you want, not just workout splits."
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    We will customize your hypertrophy volume, muscle group priorities, equipment constraints, and rest tempos into a precision training profile.
                  </p>
                </div>

                <div className="pt-4 max-w-sm mx-auto">
                  <button
                    onClick={handleNext}
                    className="w-full text-base font-bold py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group min-h-[48px] active:scale-98"
                  >
                    <span>Let's Begin</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TRAINING EXPERIENCE */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 2</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Training Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Select the experience level that best matches your weight training background.
                  </p>
                </div>

                <div className="grid gap-3.5">
                  {EXPERIENCE_OPTIONS.map((item) => {
                    const isSelected = formData.experience === item.level;
                    return (
                      <Card
                        key={item.level}
                        onClick={() => setFormData({ ...formData, experience: item.level })}
                        className={`p-4 sm:p-5 cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base sm:text-lg font-bold text-zinc-100">{item.level}</span>
                              <Badge variant={isSelected ? 'purple' : 'zinc'} className="text-[10px]">
                                {item.tagline}
                              </Badge>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                          </div>
                          <div className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-purple-500 border-purple-500 text-zinc-950 font-black' : 'border-zinc-700 bg-zinc-900'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PRIMARY GOAL */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 3</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Primary Goal
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    What is the main objective driving your current training block?
                  </p>
                </div>

                <div className="grid gap-3">
                  {GOAL_OPTIONS.map((item) => {
                    const isSelected = formData.primaryGoal === item.goal;
                    return (
                      <Card
                        key={item.goal}
                        onClick={() => setFormData({ ...formData, primaryGoal: item.goal })}
                        className={`p-4 cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-800 text-purple-400'
                            }`}>
                              {getIcon(item.icon)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-bold text-zinc-100 truncate">{item.goal}</div>
                              <div className="text-xs text-zinc-400 truncate">{item.desc}</div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-purple-500 border-purple-500 text-zinc-950 font-black' : 'border-zinc-700 bg-zinc-900'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DESIRED PHYSIQUE */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple">Step 4 — Core Selection</Badge>
                    <span className="text-xs text-purple-400 font-mono font-bold">✨ Physique Target</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Desired Physique Target
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Choose the visual aesthetic silhouette you want to craft. We adjust exercise selections to match this blueprint.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
                  {PHYSIQUE_TARGET_CARDS.map((card) => {
                    const isSelected = formData.physiqueTarget === card.id;
                    return (
                      <Card
                        key={card.id}
                        onClick={() => setFormData({ ...formData, physiqueTarget: card.id })}
                        className={`p-4 cursor-pointer transition-all border relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-800 text-purple-400'
                              }`}>
                                {getIcon(card.iconName)}
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-zinc-100">{card.name}</h3>
                                <p className="text-[11px] text-purple-400 font-medium">{card.tagline}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-purple-500 border-purple-500 text-zinc-950 font-black' : 'border-zinc-700 bg-zinc-900'
                            }`}>
                              {isSelected && <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />}
                            </div>
                          </div>

                          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                            {card.description}
                          </p>
                        </div>

                        <div className="relative z-10 pt-3 border-t border-zinc-800/60 mt-3 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Priority:</span>
                          {card.emphasizedMuscles.map((m) => (
                            <Badge key={m} variant={isSelected ? 'purple' : 'zinc'} className="text-[10px] py-0.5 px-2">
                              {m}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: WEAK MUSCLES */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 5</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Weak Muscle Groups
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Select any specific lagging muscles you want to prioritize with higher weekly set volume.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 sm:gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  {WEAK_MUSCLE_OPTIONS.map((muscle) => {
                    const isSelected = (formData.weakMuscles || []).includes(muscle);
                    return (
                      <button
                        key={muscle}
                        onClick={() => toggleWeakMuscle(muscle)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                            : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        <span>{muscle}</span>
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-zinc-500 text-xs">+</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <span>Selected Priority Muscles:</span>
                  <span className="font-bold text-purple-400">
                    {(formData.weakMuscles || []).length === 0 ? 'None selected (Equal distribution)' : (formData.weakMuscles || []).join(', ')}
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: EQUIPMENT */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 6</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Available Equipment
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    What equipment do you have access to for your workouts?
                  </p>
                </div>

                <div className="grid gap-3">
                  {EQUIPMENT_OPTIONS.map((item) => {
                    const isSelected = formData.equipment === item.type;
                    return (
                      <Card
                        key={item.type}
                        onClick={() => setFormData({ ...formData, equipment: item.type })}
                        className={`p-4 cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-800 text-purple-400'
                            }`}>
                              {getIcon(item.icon)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm sm:text-base font-bold text-zinc-100">{item.type}</span>
                                <Badge variant={isSelected ? 'purple' : 'zinc'} className="text-[10px]">
                                  {item.tagline}
                                </Badge>
                              </div>
                              <div className="text-xs text-zinc-400 mt-0.5 truncate">{item.desc}</div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-purple-500 border-purple-500 text-zinc-950 font-black' : 'border-zinc-700 bg-zinc-900'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: TRAINING DAYS */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 7</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Training Days Per Week
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    How many days per week can you consistently commit to lifting?
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TRAINING_DAYS_OPTIONS.map((item) => {
                    const isSelected = formData.trainingDays === item.days;
                    return (
                      <Card
                        key={item.days}
                        onClick={() => setFormData({ ...formData, trainingDays: item.days })}
                        className={`p-4 cursor-pointer transition-all border text-center flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-3xl font-black text-purple-400">{item.days}</div>
                          <div className="text-xs font-bold text-zinc-200">Days / Week</div>
                          <div className="text-[11px] font-mono text-zinc-400">{item.commitment}</div>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-tight pt-2 border-t border-zinc-800/80 mt-2">
                          {item.desc}
                        </p>
                      </Card>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: PREFERRED WORKOUT DURATION */}
            {step === 8 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 8</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Preferred Workout Duration
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    How much time do you prefer spending in a single workout session?
                  </p>
                </div>

                <div className="grid gap-3">
                  {DURATION_OPTIONS.map((item) => {
                    const isSelected = formData.workoutDuration === item.duration;
                    return (
                      <Card
                        key={item.duration}
                        onClick={() => setFormData({ ...formData, workoutDuration: item.duration })}
                        className={`p-4 cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                            <Clock className={`w-5 h-5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-zinc-500'}`} />
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-bold text-zinc-100 truncate">{item.duration}</div>
                              <div className="text-xs text-zinc-400 truncate">{item.desc}</div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-purple-500 border-purple-500 text-zinc-950 font-black' : 'border-zinc-700 bg-zinc-900'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 9: UNITS */}
            {step === 9 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 9</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Preferred Units
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Select your preferred weight unit for exercise tracking and personal records.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card
                    onClick={() => setFormData({ ...formData, weightUnit: 'kg' })}
                    className={`p-6 cursor-pointer text-center space-y-2 border ${
                      formData.weightUnit === 'kg'
                        ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-4xl font-black text-zinc-100">kg</div>
                    <div className="text-xs font-bold text-purple-400 uppercase">Kilograms</div>
                    <p className="text-[11px] text-zinc-500">Metric standard weight calculation</p>
                  </Card>

                  <Card
                    onClick={() => setFormData({ ...formData, weightUnit: 'lbs' })}
                    className={`p-6 cursor-pointer text-center space-y-2 border ${
                      formData.weightUnit === 'lbs'
                        ? 'bg-purple-500/15 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-4xl font-black text-zinc-100">lbs</div>
                    <div className="text-xs font-bold text-purple-400 uppercase">Pounds</div>
                    <p className="text-[11px] text-zinc-500">Imperial standard weight calculation</p>
                  </Card>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
                  >
                    <span>Continue to Review</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 10: REVIEW & FINISH */}
            {step === 10 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge variant="purple">Step 10 — Final Review</Badge>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                    Review Your Training Profile
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Here is your personalized hypertrophy coaching blueprint summary:
                  </p>
                </div>

                <Card className="p-5 sm:p-6 space-y-4 border-purple-500/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Experience Level</div>
                      <div className="text-base font-extrabold text-zinc-100">{formData.experience}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Primary Goal</div>
                      <div className="text-base font-extrabold text-zinc-100">{formData.primaryGoal}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Physique Target</div>
                      <div className="text-base font-extrabold text-purple-400 capitalize">
                        {PHYSIQUE_TARGET_CARDS.find((c) => c.id === formData.physiqueTarget)?.name || formData.physiqueTarget}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Weekly Commitment</div>
                      <div className="text-base font-extrabold text-zinc-100">
                        {formData.trainingDays} Days / Wk ({formData.workoutDuration})
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Equipment Setup</div>
                      <div className="text-base font-extrabold text-zinc-100">{formData.equipment}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Preferred Unit</div>
                      <div className="text-base font-extrabold text-zinc-100 uppercase">{formData.weightUnit}</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Weak Muscle Specialization</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(formData.weakMuscles || []).length === 0 ? (
                        <span className="text-xs text-zinc-400">None selected (Balanced distribution)</span>
                      ) : (
                        formData.weakMuscles?.map((wm) => (
                          <Badge key={wm} variant="purple" className="text-xs">
                            {wm}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </Card>

                <div className="pt-4">
                  <button
                    onClick={handleFinish}
                    disabled={isGenerating}
                    className="w-full text-base font-bold py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group min-h-[52px] active:scale-98 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin shrink-0" />
                        <span>Setting Up Your IronPath Journey...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with Your Journey</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
