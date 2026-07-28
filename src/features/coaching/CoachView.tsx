import React from 'react';
import { Sparkles, Bot, MessageSquare, Lightbulb, Zap, Shield, ChevronRight } from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { PHYSIQUE_TARGET_CARDS } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CoachView: React.FC = () => {
  const userProfile = useIronPathStore((s) => s.userProfile);
  const currentPhysiqueCard = PHYSIQUE_TARGET_CARDS.find((p) => p.id === userProfile.physiqueTarget) || PHYSIQUE_TARGET_CARDS[0];

  const primaryWeakPoint = userProfile.weakMuscles?.[0] || 'Upper Body';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <Badge variant="emerald" className="mb-1">INTELLIGENT HYPERTROPHY COACH</Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">IronPath AI Hypertrophy Coach</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Automated progressive overload recommendations, auto-regulatory deload flags, and physique bottleneck analysis.
        </p>
      </div>

      <Card variant="glow" glowColor="rgba(16, 185, 129, 0.15)" className="p-6 sm:p-8 space-y-6 border-emerald-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-purple-600 text-white font-bold shrink-0 shadow-lg shadow-emerald-500/20">
            <Bot className="w-8 h-8 text-zinc-950" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald">AI COACHING INSIGHT (TODAY)</Badge>
              <Badge variant="purple">{userProfile.experience} Lifter</Badge>
            </div>
            <h3 className="text-xl font-bold text-zinc-100">
              {currentPhysiqueCard.name} Volume Analysis
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              "Hey <strong className="text-zinc-100">{userProfile.name}</strong>, based on your <strong className="text-emerald-400">{currentPhysiqueCard.name}</strong> physique goal and <strong className="text-zinc-100">{userProfile.equipment}</strong> setup, your current volume target is optimized for {userProfile.trainingDays} days/week. 
              {userProfile.weakMuscles?.length ? ` We are actively prioritizing extra set volume for ${userProfile.weakMuscles.join(' and ')}.` : ''}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
          <div className="p-4 rounded-xl bg-zinc-950 border border-purple-500/30 space-y-1">
            <span className="text-xs text-purple-400 font-bold uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Specialization Recommendation
            </span>
            <div className="text-sm font-bold text-zinc-200">Priority: {primaryWeakPoint}</div>
            <p className="text-xs text-zinc-400">Targeting +2 working sets per session with strict 2-3s eccentric pauses.</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-1">
            <span className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Systemic Readiness
            </span>
            <div className="text-sm font-bold text-zinc-200">Optimal Recovery State (88%)</div>
            <p className="text-xs text-zinc-400">Progression pacing aligned with {userProfile.workoutDuration} sessions.</p>
          </div>
        </div>
      </Card>

      {/* Ask Coach Input Box */}
      <Card className="p-4 sm:p-5 space-y-3 bg-zinc-900/80">
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
          Ask AI Coach a Hypertrophy Question
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={`e.g., How can I maximize ${primaryWeakPoint} growth?`}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 min-h-[44px]"
          />
          <Button variant="primary" size="md" className="w-full sm:w-auto min-h-[44px]">
            Ask Coach
          </Button>
        </div>
      </Card>
    </div>
  );
};

