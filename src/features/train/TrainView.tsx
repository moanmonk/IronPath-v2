import React, { useState } from 'react';
import { Dumbbell, Target } from 'lucide-react';
import { LiveWorkoutView } from './LiveWorkoutView';
import { WorkoutPlannerView } from './WorkoutPlannerView';
import { useIronPathStore } from '../../store/useIronPathStore';

export const TrainView: React.FC = () => {
  const isWorkoutInProgress = useIronPathStore((s) => s.isWorkoutInProgress);
  const [activeSubMode, setActiveSubMode] = useState<'live' | 'planner'>(
    isWorkoutInProgress ? 'live' : 'planner'
  );

  return (
    <div className="space-y-6">
      {/* View Toggle Bar */}
      <div className="flex items-center justify-center">
        <div className="p-1 rounded-2xl bg-zinc-900 border border-zinc-800 grid grid-cols-2 w-full max-w-md gap-1">
          <button
            onClick={() => setActiveSubMode('live')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all relative ${
              activeSubMode === 'live'
                ? isWorkoutInProgress 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-400/50 ring-2 ring-red-500/50'
                  : 'bg-zinc-100 text-zinc-950 shadow-md'
                : isWorkoutInProgress
                  ? 'bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/50'
                  : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Dumbbell className={`w-4 h-4 shrink-0 ${isWorkoutInProgress ? 'animate-bounce text-red-200' : ''}`} />
            <span className="truncate">Live Session</span>
            {isWorkoutInProgress && (
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubMode('planner')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeSubMode === 'planner'
                ? 'bg-zinc-100 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span className="truncate">Planner</span>
          </button>
        </div>
      </div>

      {activeSubMode === 'live' ? <LiveWorkoutView /> : <WorkoutPlannerView />}
    </div>
  );
};
