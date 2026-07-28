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
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  TrendingUp, 
  Scale, 
  Activity, 
  Trophy, 
  BarChart3, 
  LineChart as LineChartIcon,
  Calendar,
  Layers
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

  // Mock / Calculated Volume History (Weekly Tonnage)
  const mockVolumeHistory = [
    { week: 'Wk 23', volumeKg: 14200, sessions: 4 },
    { week: 'Wk 24', volumeKg: 15600, sessions: 4 },
    { week: 'Wk 25', volumeKg: 16100, sessions: 5 },
    { week: 'Wk 26', volumeKg: 17400, sessions: 5 },
    { week: 'Wk 27', volumeKg: 16900, sessions: 4 },
    { week: 'Wk 28', volumeKg: 18420, sessions: 5 },
  ];

  // Prepare Muscle Set Volume comparison for radar & bar charts
  const muscleVolumeData = recoveryList.map((m) => ({
    muscleName: m.name.split('(')[0].trim(),
    fullName: m.name,
    setsDone: m.weeklySetsDone,
    targetSets: m.targetWeeklySets,
    optimalMin: 10,
    optimalMax: 20
  }));

  // Prepare PR trajectory
  const prChartData = [
    { date: 'Jun 1', inclinePress: 32, hackSquat: 130, lateralRaise: 10 },
    { date: 'Jun 15', inclinePress: 34, hackSquat: 140, lateralRaise: 12.5 },
    { date: 'Jul 1', inclinePress: 36, hackSquat: 150, lateralRaise: 12.5 },
    { date: 'Jul 15', inclinePress: 36, hackSquat: 155, lateralRaise: 14 },
    { date: 'Jul 28', inclinePress: 38, hackSquat: 160, lateralRaise: 15 },
  ];

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
            <BarChart3 className="w-3.5 h-3.5" /> Weekly Tonnage
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
          </div>
        </div>
      )}

      {/* Chart 2: Weekly Tonnage Progression */}
      {chartType === 'volume' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Systemic Training Volume Load (kg moved across all working sets per week)</span>
            <span className="text-emerald-400 font-bold">+29.7% Growth over 6 Weeks</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockVolumeHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="week" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                  formatter={(val: any) => [`${val.toLocaleString()} kg`, 'Volume Load']}
                />
                <Bar dataKey="volumeKg" name="Volume Load (kg)" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Muscle Set Distribution */}
      {chartType === 'muscles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">14-Muscle Weekly Set Volume vs Target (MAV Range)</span>
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
                    name === 'setsDone' ? 'Completed Sets' : 'Target Sets'
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
            <span>Primary Core Lift Weight History (kg)</span>
            <span className="text-emerald-400 font-bold">Consistent Progressive Overload</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                  formatter={(val: any) => [`${val} kg`, 'Working Weight']}
                />
                <Line type="monotone" dataKey="inclinePress" name="Incline DB Press" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="hackSquat" name="Hack Squat" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="lateralRaise" name="Cable Side Lateral" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};
