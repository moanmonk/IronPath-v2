import React from 'react';
import { 
  Target, 
  Timer, 
  Database, 
  RefreshCw, 
  Download, 
  RotateCcw,
  Building,
  AlertTriangle
} from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { PHYSIQUE_TARGET_CARDS } from '../../data/mockData';
import { 
  TrainingExperience, 
  PrimaryGoal, 
  EquipmentOption, 
  WorkoutDurationOption, 
  PhysiqueTargetId 
} from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

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

export const SettingsView: React.FC = () => {
  const userProfile = useIronPathStore((s) => s.userProfile);
  const updateUserProfile = useIronPathStore((s) => s.updateUserProfile);
  const resetOnboarding = useIronPathStore((s) => s.resetOnboarding);
  const triggerSync = useIronPathStore((s) => s.triggerSync);
  const lastSyncedAt = useIronPathStore((s) => s.lastSyncedAt);

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userProfile));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ironpath_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleWeakMuscle = (muscle: string) => {
    const current = userProfile.weakMuscles || [];
    if (current.includes(muscle)) {
      updateUserProfile({ weakMuscles: current.filter((m) => m !== muscle) });
    } else {
      updateUserProfile({ weakMuscles: [...current, muscle] });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <Badge variant="purple" className="mb-1">PERSONALIZATION & PROFILE</Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">Application Settings</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Customize your physique targets, weak muscle allocations, equipment setup, and rest timers directly.
        </p>
      </div>

      {/* Profile & Physique Target */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400 shrink-0" />
          Physique & Profile Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Lifter Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => updateUserProfile({ name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Target Physique Silhouette</label>
            <select
              value={userProfile.physiqueTarget}
              onChange={(e) => updateUserProfile({ physiqueTarget: e.target.value as PhysiqueTargetId })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              {PHYSIQUE_TARGET_CARDS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tagline})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Training Experience</label>
            <select
              value={userProfile.experience}
              onChange={(e) => updateUserProfile({ experience: e.target.value as TrainingExperience })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              <option value="Beginner">Beginner (&lt; 1 Year)</option>
              <option value="Intermediate">Intermediate (1 - 3 Years)</option>
              <option value="Advanced">Advanced (3+ Years)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Primary Goal</label>
            <select
              value={userProfile.primaryGoal}
              onChange={(e) => updateUserProfile({ primaryGoal: e.target.value as PrimaryGoal })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              <option value="Build Muscle">Build Muscle</option>
              <option value="Build Strength">Build Strength</option>
              <option value="Body Recomposition">Body Recomposition</option>
              <option value="Lose Fat While Maintaining Muscle">Lose Fat While Maintaining Muscle</option>
              <option value="General Fitness">General Fitness</option>
            </select>
          </div>
        </div>

        {/* Weak Muscle Group Specialization */}
        <div className="pt-3 border-t border-zinc-800/60 space-y-2">
          <label className="text-xs text-zinc-400 font-medium block">Weak Muscle Group Focus (Click to Toggle)</label>
          <div className="flex flex-wrap gap-2">
            {WEAK_MUSCLE_OPTIONS.map((m) => {
              const isSelected = (userProfile.weakMuscles || []).includes(m);
              return (
                <button
                  key={m}
                  onClick={() => toggleWeakMuscle(m)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md font-extrabold'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  {m} {isSelected ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Equipment & Schedule */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-400 shrink-0" />
          Equipment & Schedule Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Equipment Access</label>
            <select
              value={userProfile.equipment}
              onChange={(e) => updateUserProfile({ equipment: e.target.value as EquipmentOption })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              <option value="Commercial Gym">Commercial Gym</option>
              <option value="Home Gym">Home Gym</option>
              <option value="Dumbbells Only">Dumbbells Only</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Minimal Equipment">Minimal Equipment</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Training Days / Week</label>
            <select
              value={userProfile.trainingDays}
              onChange={(e) => updateUserProfile({ trainingDays: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              <option value={2}>2 Days / Week</option>
              <option value={3}>3 Days / Week</option>
              <option value={4}>4 Days / Week</option>
              <option value={5}>5 Days / Week</option>
              <option value={6}>6 Days / Week</option>
              <option value={7}>7 Days / Week</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Session Duration</label>
            <select
              value={userProfile.workoutDuration}
              onChange={(e) => updateUserProfile({ workoutDuration: e.target.value as WorkoutDurationOption })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              <option value="30 Minutes">30 Minutes</option>
              <option value="45 Minutes">45 Minutes</option>
              <option value="60 Minutes">60 Minutes</option>
              <option value="75 Minutes">75 Minutes</option>
              <option value="90 Minutes">90 Minutes</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Workout Preferences */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Timer className="w-5 h-5 text-purple-400 shrink-0" />
          Workout & Timer Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Weight Unit System</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateUserProfile({ weightUnit: 'kg' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all min-h-[44px] cursor-pointer ${
                  userProfile.weightUnit === 'kg'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                onClick={() => updateUserProfile({ weightUnit: 'lbs' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all min-h-[44px] cursor-pointer ${
                  userProfile.weightUnit === 'lbs'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                Pounds (lbs)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Default Rest Timer Duration</label>
            <select
              value={userProfile.defaultRestTimerSeconds}
              onChange={(e) => updateUserProfile({ defaultRestTimerSeconds: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 min-h-[44px]"
            >
              <option value={60}>60 Seconds (1 Min)</option>
              <option value={90}>90 Seconds (1.5 Mins)</option>
              <option value={120}>120 Seconds (2 Mins - Recommended)</option>
              <option value={180}>180 Seconds (3 Mins)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Synchronization & Backup */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400 shrink-0" />
            Database & Backup Sync
          </h3>
          <Badge variant="emerald">Local & Sync Active</Badge>
        </div>

        <p className="text-xs text-zinc-400">
          Last synced: <span className="text-zinc-200 font-semibold">{lastSyncedAt}</span>. IronPath operates completely offline and auto-synchronizes when connected.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto min-h-[44px]"
            onClick={triggerSync}
            leftIcon={<RefreshCw className="w-4 h-4 text-emerald-400" />}
          >
            Force Sync
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto min-h-[44px]"
            onClick={exportData}
            leftIcon={<Download className="w-4 h-4 text-purple-400" />}
          >
            Export Backup JSON
          </Button>
        </div>
      </Card>

      {/* Danger Zone / Reset Flow (Safely placed at bottom) */}
      <Card className="p-5 sm:p-6 space-y-4 border-rose-900/40 bg-zinc-950/60 mt-8">
        <div className="flex items-center gap-2.5 text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="text-base font-bold text-zinc-100">Reset & Danger Zone</h3>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Need to reconfigure your training setup from scratch? Restarting the onboarding flow allows you to step through all physique goals, equipment selections, and commitment preferences again.
        </p>

        <div className="pt-2 flex justify-start">
          <button
            onClick={resetOnboarding}
            className="px-5 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 font-bold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Restart Onboarding Flow</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
