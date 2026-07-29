import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  Scale, 
  Trophy, 
  BarChart3, 
  Layers,
  History
} from 'lucide-react';
import { BodyMeasurementEntry, PersonalRecord, MuscleRecovery, WorkoutSession } from '../../types';

interface ProgressChartsProps {
  bodyMeasurements: BodyMeasurementEntry[];
  personalRecords: PersonalRecord[];
  recoveryList: MuscleRecovery[];
  workoutHistory: WorkoutSession[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  bodyMeasurements,
  personalRecords,
  recoveryList,
  workoutHistory
}) => {
  const [chartType, setChartType] = useState<'weight' | 'volume' | 'muscles' | 'prs'>('weight');
  const [measurementMetric, setMeasurementMetric] = useState<'weightKg' | 'waistCm' | 'chestCm' | 'armsCm' | 'shouldersCm' | 'bodyFatPercentage'>('weightKg');

  // Prepare chronological body measurement data for Recharts
  const measurementChartData = [...bodyMeasurements]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => ({
      date: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weightKg: m.weightKg || null,
      waistCm: m.waistCm || null,
      chestCm: m.chestCm || null,
      armsCm: m.armsCm || null,
      shouldersCm: m.shouldersCm || null,
      bodyFatPercentage: m.bodyFatPercentage || null,
    }));

  // Calculate Real Volume History from workoutHistory
  const realVolumeData = [...workoutHistory]
    .reverse()
    .map((s) => ({
      session: s.title.split(':')[1]?.trim() || s.title,
      date: s.date,
      volumeKg: s.totalVolumeKg || 0
    }));

  // Prepare Muscle Set Volume comparison for radar & bar charts
  const muscleVolumeData = recoveryList.map((m) => ({
    muscleName: m.name.split('(')[0].trim(),
    fullName: m.name,
    setsDone: m.weeklySetsDone,
    targetSets: m.targetWeeklySets
  }));

  // Prepare PR trajectory
  const prChartData = [...personalRecords].map((pr) => ({
    exercise: pr.exerciseName,
    date: pr.date,
    weight: pr.weight,
    estimated1RM: pr.estimated1RM
  }));

  return (
    <Card className="p-4 sm:p-6 space-y-5 border-emerald-500/30 bg-zinc-900/90 shadow-xl">
      {/* Header & Chart Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="text-[10px] uppercase font-bold">
              HYPERTROPHY ANALYTICS
            </Badge>
          </div>
          <h3 className="text-xl font-black text-zinc-100 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Interactive Progress & Volume Visualizer
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor body composition trends, progressive overload tonnage, and individual muscle set distribution.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setChartType('weight')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === 'weight'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Body Stats
          </button>
          <button
            type="button"
            onClick={() => setChartType('volume')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === 'volume'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Session Tonnage
          </button>
          <button
            type="button"
            onClick={() => setChartType('muscles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === 'muscles'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Muscle Sets
          </button>
          <button
            type="button"
            onClick={() => setChartType('prs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartType === 'prs'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> PR Progression
          </button>
        </div>
      </div>

      {/* Chart 1: Body Measurements Trend */}
      {chartType === 'weight' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-300">Select Tracked Metric:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'weightKg', label: 'Body Weight (kg)' },
                { id: 'bodyFatPercentage', label: 'Body Fat %' },
                { id: 'waistCm', label: 'Waist (cm)' },
                { id: 'chestCm', label: 'Chest (cm)' },
                { id: 'armsCm', label: 'Arms (cm)' },
                { id: 'shouldersCm', label: 'Shoulders (cm)' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMeasurementMetric(m.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    measurementMetric === m.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {measurementChartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-1">
                <Scale className="w-8 h-8 opacity-40" />
                <p className="text-xs font-bold">No body measurement logs yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={measurementChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                    labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={measurementMetric}
                    name={measurementMetric.replace('Kg', ' (kg)').replace('Cm', ' (cm)').replace('Percentage', ' %')}
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#metricGrad)"
                    dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#09090b' }}
                    activeDot={{ r: 7, fill: '#34d399' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Chart 2: Session Tonnage Progression */}
      {chartType === 'volume' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Training Volume Load per Workout Session (kg moved)</span>
            <span className="text-emerald-400 font-bold font-mono">{realVolumeData.length} Sessions Logged</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {realVolumeData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 border border-dashed border-zinc-800 rounded-2xl">
                <History className="w-8 h-8 opacity-40 text-emerald-400" />
                <p className="text-xs font-bold text-zinc-400">No workout sessions logged yet.</p>
                <p className="text-[11px] text-zinc-500">Finish your first workout in the Train tab to see volume charts!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realVolumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                    formatter={(val: any) => [`${val.toLocaleString()} kg`, 'Volume Load']}
                  />
                  <Bar dataKey="volumeKg" name="Volume Load (kg)" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Chart 3: Muscle Set Distribution */}
      {chartType === 'muscles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">14-Muscle Group Weekly Set Volume vs Target (MAV Range)</span>
            <span className="text-purple-400 font-bold">10 - 20 Sets/Wk Optimal</span>
          </div>

          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={muscleVolumeData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" fontSize={11} domain={[0, 24]} />
                <YAxis dataKey="muscleName" type="category" stroke="#a1a1aa" fontSize={11} width={85} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                  formatter={(value: any, name: string) => [
                    `${value} sets`,
                    name === 'setsDone' ? 'Completed Sets' : 'Target Goal'
                  ]}
                />
                <Bar dataKey="setsDone" name="Sets Done" fill="#10b981" radius={[0, 6, 6, 0]} />
                <Bar dataKey="targetSets" name="Target Goal" fill="#3f3f46" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 4: PR Progression */}
      {chartType === 'prs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Personal Record Max Weight & 1RM Trajectory</span>
            <span className="text-emerald-400 font-bold">{prChartData.length} PRs Recorded</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {prChartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 border border-dashed border-zinc-800 rounded-2xl">
                <Trophy className="w-8 h-8 opacity-40 text-purple-400" />
                <p className="text-xs font-bold text-zinc-400">No personal records logged yet.</p>
                <p className="text-[11px] text-zinc-500">Log a workout or manually enter your PRs to see strength progression!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="exercise" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                    formatter={(val: any, name: string) => [`${val} kg`, name === 'weight' ? 'Top Weight' : 'Estimated 1RM']}
                  />
                  <Bar dataKey="weight" name="Top Weight" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="estimated1RM" name="Estimated 1RM" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
