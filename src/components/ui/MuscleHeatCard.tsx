import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { MuscleRecovery } from '../../types';
import { Activity, Battery, CheckCircle2, Clock } from 'lucide-react';

interface MuscleHeatCardProps {
  recovery: MuscleRecovery;
  onClick?: () => void;
}

export const MuscleHeatCard: React.FC<MuscleHeatCardProps> = ({ recovery, onClick }) => {
  const getStatusBadge = () => {
    switch (recovery.status) {
      case 'optimal':
        return <Badge variant="emerald">Optimal Readiness ({recovery.recoveryPercentage}%)</Badge>;
      case 'recovering':
        return <Badge variant="purple">Recovering ({recovery.recoveryPercentage}%)</Badge>;
      case 'fatigued':
        return <Badge variant="danger">High Fatigue ({recovery.recoveryPercentage}%)</Badge>;
    }
  };

  const getProgressColor = () => {
    if (recovery.recoveryPercentage >= 85) return 'bg-emerald-500';
    if (recovery.recoveryPercentage >= 60) return 'bg-purple-500';
    return 'bg-red-500';
  };

  return (
    <Card 
      variant="interactive" 
      onClick={onClick}
      className="p-4 flex flex-col justify-between border-zinc-800/80 hover:border-zinc-700"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">{recovery.name}</h4>
          <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-zinc-500" />
            Trained {recovery.hoursSinceLastTrained}h ago
          </span>
        </div>
        {getStatusBadge()}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1 text-zinc-400">
          <span>Weekly Sets Volume</span>
          <span className="font-semibold text-zinc-200">
            {recovery.weeklySetsDone} / {recovery.targetWeeklySets} sets
          </span>
        </div>
        
        {/* Recovery Progress Bar */}
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${recovery.recoveryPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
