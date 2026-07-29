import React, { useState } from 'react';
import { 
  TrendingUp, 
  Trophy, 
  Scale, 
  Activity, 
  Plus, 
  Ruler, 
  Trash2, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  Flame,
  Info
} from 'lucide-react';
import { useIronPathStore } from '../../store/useIronPathStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { BodyMeasurementEntry } from '../../types';
import { ProgressCharts } from './ProgressCharts';

export const ProgressView: React.FC = () => {
  const personalRecords = useIronPathStore((s) => s.personalRecords);
  const recoveryList = useIronPathStore((s) => s.recoveryList);
  const userProfile = useIronPathStore((s) => s.userProfile);
  const bodyMeasurements = useIronPathStore((s) => s.bodyMeasurements);
  const workoutHistory = useIronPathStore((s) => s.workoutHistory);
  const addBodyMeasurement = useIronPathStore((s) => s.addBodyMeasurement);
  const deleteBodyMeasurement = useIronPathStore((s) => s.deleteBodyMeasurement);

  const [activeTab, setActiveTab] = useState<'overview' | 'measurements'>('measurements');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formWeight, setFormWeight] = useState<string>('');
  const [formChest, setFormChest] = useState<string>('');
  const [formWaist, setFormWaist] = useState<string>('');
  const [formArms, setFormArms] = useState<string>('');
  const [formShoulders, setFormShoulders] = useState<string>('');
  const [formHips, setFormHips] = useState<string>('');
  const [formThighs, setFormThighs] = useState<string>('');
  const [formBodyFat, setFormBodyFat] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  const latestMeasurement = bodyMeasurements.length > 0 ? bodyMeasurements[0] : null;
  const previousMeasurement = bodyMeasurements.length > 1 ? bodyMeasurements[1] : null;

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWeight && !formChest && !formWaist && !formArms && !formShoulders) {
      alert('Please enter at least one measurement or weight value.');
      return;
    }

    addBodyMeasurement({
      date: formDate || new Date().toISOString().split('T')[0],
      weightKg: formWeight ? parseFloat(formWeight) : undefined,
      chestCm: formChest ? parseFloat(formChest) : undefined,
      waistCm: formWaist ? parseFloat(formWaist) : undefined,
      armsCm: formArms ? parseFloat(formArms) : undefined,
      shouldersCm: formShoulders ? parseFloat(formShoulders) : undefined,
      hipsCm: formHips ? parseFloat(formHips) : undefined,
      thighsCm: formThighs ? parseFloat(formThighs) : undefined,
      bodyFatPercentage: formBodyFat ? parseFloat(formBodyFat) : undefined,
      notes: formNotes ? formNotes.trim() : undefined
    });

    // Reset Form
    setFormWeight('');
    setFormChest('');
    setFormWaist('');
    setFormArms('');
    setFormShoulders('');
    setFormHips('');
    setFormThighs('');
    setFormBodyFat('');
    setFormNotes('');
    setIsLogModalOpen(false);
  };

  // Calculate V-Taper Ratio (Shoulder / Waist) if available
  const vTaperRatio = latestMeasurement?.shouldersCm && latestMeasurement?.waistCm
    ? (latestMeasurement.shouldersCm / latestMeasurement.waistCm).toFixed(2)
    : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" className="mb-1">PROGRESSION & MEASUREMENTS</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-100">History, PRs & Body Stats</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track body weight, chest, waist, arm circumferences, and mechanical PR strength history.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsLogModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4 shrink-0 text-zinc-950" />}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/20 inline-flex items-center justify-center text-center px-4 py-2.5 rounded-xl self-start sm:self-auto"
        >
          Log Body Measurements
        </Button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab('measurements')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'measurements'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Ruler className="w-4 h-4" />
          Body Measurements & Weight
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          PRs & Volume Load
        </button>
      </div>

      {activeTab === 'measurements' && (
        <div className="space-y-6">
          {/* Key Latest Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-purple-400" /> Body Weight
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.weightKg ? `${latestMeasurement.weightKg} kg` : '--'}
              </div>
              {previousMeasurement?.weightKg && latestMeasurement?.weightKg && (
                <p className="text-[11px] text-zinc-400">
                  {latestMeasurement.weightKg - previousMeasurement.weightKg > 0 ? '+' : ''}
                  {(latestMeasurement.weightKg - previousMeasurement.weightKg).toFixed(1)} kg vs prev
                </p>
              )}
            </Card>

            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-purple-400" /> Chest
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.chestCm ? `${latestMeasurement.chestCm} cm` : '--'}
              </div>
              {previousMeasurement?.chestCm && latestMeasurement?.chestCm && (
                <p className="text-[11px] text-zinc-400">
                  {latestMeasurement.chestCm - previousMeasurement.chestCm > 0 ? '+' : ''}
                  {(latestMeasurement.chestCm - previousMeasurement.chestCm).toFixed(1)} cm
                </p>
              )}
            </Card>

            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-purple-400" /> Waist
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.waistCm ? `${latestMeasurement.waistCm} cm` : '--'}
              </div>
              {previousMeasurement?.waistCm && latestMeasurement?.waistCm && (
                <p className="text-[11px] text-zinc-400">
                  {latestMeasurement.waistCm - previousMeasurement.waistCm > 0 ? '+' : ''}
                  {(latestMeasurement.waistCm - previousMeasurement.waistCm).toFixed(1)} cm
                </p>
              )}
            </Card>

            <Card className="p-4 bg-zinc-900/90 border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-purple-400" /> Arms (Flexed)
              </span>
              <div className="text-xl sm:text-2xl font-black text-zinc-100">
                {latestMeasurement?.armsCm ? `${latestMeasurement.armsCm} cm` : '--'}
              </div>
              {previousMeasurement?.armsCm && latestMeasurement?.armsCm && (
                <p className="text-[11px] text-zinc-400">
                  {latestMeasurement.armsCm - previousMeasurement.armsCm > 0 ? '+' : ''}
                  {(latestMeasurement.armsCm - previousMeasurement.armsCm).toFixed(1)} cm
                </p>
              )}
            </Card>
          </div>

          {/* V-Taper Alignment Card */}
          {vTaperRatio && (
            <Card className="p-4 sm:p-5 bg-gradient-to-r from-purple-500/10 via-zinc-900 to-zinc-950 border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-bold text-zinc-100">Shoulder-to-Waist V-Taper Ratio</h4>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Golden Ratio target is ~1.618. Your current ratio is calculated from shoulder circumference vs waist width.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-purple-400">{vTaperRatio}</div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Ratio Index</span>
              </div>
            </Card>
          )}

          {/* Detailed Measurement Log History Table/Cards */}
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Measurement Log History
              </h3>
              <span className="text-xs text-zinc-400">{bodyMeasurements.length} entries recorded</span>
            </div>

            {bodyMeasurements.length === 0 ? (
              <div className="text-center py-12 space-y-3 border border-dashed border-zinc-800 rounded-2xl">
                <Scale className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-sm text-zinc-400 font-medium">No body measurements recorded yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLogModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4 shrink-0" />}
                  className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 inline-flex items-center justify-center text-center mx-auto"
                >
                  Log First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {bodyMeasurements.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                          {entry.date}
                        </span>
                        {entry.weightKg && (
                          <span className="text-sm font-black text-zinc-100">
                            {entry.weightKg} kg
                          </span>
                        )}
                        {entry.bodyFatPercentage && (
                          <Badge variant="purple">{entry.bodyFatPercentage}% BF</Badge>
                        )}
                      </div>

                      <button
                        onClick={() => deleteBodyMeasurement(entry.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Grid of Circumferences */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                      {entry.chestCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Chest</span>
                          <span className="font-bold text-zinc-200">{entry.chestCm} cm</span>
                        </div>
                      )}
                      {entry.waistCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Waist</span>
                          <span className="font-bold text-zinc-200">{entry.waistCm} cm</span>
                        </div>
                      )}
                      {entry.armsCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Arms</span>
                          <span className="font-bold text-zinc-200">{entry.armsCm} cm</span>
                        </div>
                      )}
                      {entry.shouldersCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Shoulders</span>
                          <span className="font-bold text-zinc-200">{entry.shouldersCm} cm</span>
                        </div>
                      )}
                      {entry.hipsCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Hips</span>
                          <span className="font-bold text-zinc-200">{entry.hipsCm} cm</span>
                        </div>
                      )}
                      {entry.thighsCm && (
                        <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase">Thighs</span>
                          <span className="font-bold text-zinc-200">{entry.thighsCm} cm</span>
                        </div>
                      )}
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/30 italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="All-Time Hypertrophy PRs"
              value={personalRecords.length}
              subtitle="Records Tracked"
              icon={<Trophy className="w-5 h-5" />}
              accentGradient="from-purple-500/20 to-transparent"
            />

            <MetricCard
              title="Weekly Volume Load"
              value="18,420 kg"
              subtitle="Tonnage Moved"
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: '+8.4%', isPositive: true }}
              accentGradient="from-emerald-500/20 to-transparent"
            />

            <MetricCard
              title="Physique Alignment Score"
              value="96%"
              subtitle="V-Taper Match"
              icon={<ShieldCheck className="w-5 h-5" />}
              accentGradient="from-purple-500/20 to-transparent"
            />
          </div>

          {/* Interactive Progress & Volume Charts */}
          <ProgressCharts
            bodyMeasurements={bodyMeasurements}
            personalRecords={personalRecords}
            recoveryList={recoveryList}
            workoutHistory={workoutHistory}
          />

          {/* Muscle Volume Distribution vs Target (14 Separate Muscle Groups) */}
          <Card className="p-4 sm:p-6 space-y-5 bg-zinc-900/90 border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                  Individual Muscle Weekly Set Volume (14 Targeted Groups)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tracks actual working sets completed against Maximal Adaptive Volume (MAV) targets for each distinct muscle group.
                </p>
              </div>
              <Badge variant="emerald" className="self-start sm:self-auto text-[10px] font-bold">
                {recoveryList.length} Muscles Tracked
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recoveryList.map((rec) => {
                const percent = Math.min(100, Math.round((rec.weeklySetsDone / rec.targetWeeklySets) * 100));
                return (
                  <div key={rec.muscle} className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-bold text-zinc-100 text-sm">{rec.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-emerald-400">
                          {rec.weeklySetsDone} / {rec.targetWeeklySets} sets
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            rec.status === 'optimal'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : rec.status === 'recovering'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    </div>

                    {/* Set Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 100
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : percent >= 70
                              ? 'bg-gradient-to-r from-purple-500 to-emerald-400'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>{percent}% of MAV</span>
                        <span>Recovery: {rec.recoveryPercentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Modal: Log Body Measurements */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg space-y-5 animate-scaleIn my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-zinc-100">Log Body Measurements</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 82.5"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 14.5"
                    value={formBodyFat}
                    onChange={(e) => setFormBodyFat(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 108"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 81"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Arms / Biceps (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 41.5"
                    value={formArms}
                    onChange={(e) => setFormArms(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Shoulders (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 124"
                    value={formShoulders}
                    onChange={(e) => setFormShoulders(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Hips / Glutes (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 98"
                    value={formHips}
                    onChange={(e) => setFormHips(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Thighs / Quads (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 62"
                    value={formThighs}
                    onChange={(e) => setFormThighs(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Notes / Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Morning fasted, post-refeed day"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLogModalOpen(false)}
                  className="border-zinc-800 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Measurement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
