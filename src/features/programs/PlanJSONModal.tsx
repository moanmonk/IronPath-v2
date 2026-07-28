import React, { useState } from 'react';
import { Download, Copy, Check, FileJson, Upload, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { CustomWorkoutPlan } from '../../types';
import { useIronPathStore } from '../../store/useIronPathStore';

interface PlanJSONModalProps {
  isOpen: boolean;
  onClose: () => void;
  planToExport?: CustomWorkoutPlan | null;
  mode: 'export' | 'import';
}

const SAMPLE_JSON_PLAN = {
  title: "4-Day Aesthetic Hypertrophy Split",
  goal: "Aesthetic Proportion & V-Taper",
  daysPerWeek: 4,
  description: "High-tension hypertrophy routine targeting chest, back width, side delts, and quads.",
  notes: "Focus on 2-3s controlled eccentrics. Rest 2 mins between heavy sets.",
  days: [
    {
      name: "Upper Body Width & Density",
      scheduledDay: "Monday",
      focus: "Chest, Lats & Side Delts",
      exercises: [
        {
          name: "Incline Dumbbell Press",
          equipment: "dumbbell",
          primaryMuscle: "chest",
          sets: 3,
          reps: "8-12",
          restSeconds: 120,
          targetRIR: 1,
          notes: "Deep stretch pause at bottom position"
        },
        {
          name: "Lat Pulldown (Neutral Grip)",
          equipment: "cable",
          primaryMuscle: "back",
          sets: 3,
          reps: "10-12",
          restSeconds: 90,
          targetRIR: 2,
          notes: "Drive elbows to hip pockets"
        },
        {
          name: "Cable Lateral Raise",
          equipment: "cable",
          primaryMuscle: "delts",
          sets: 4,
          reps: "12-15",
          restSeconds: 75,
          targetRIR: 0,
          notes: "Smooth continuous cable tension"
        }
      ]
    },
    {
      name: "Lower Body Quad & Calves Focus",
      scheduledDay: "Tuesday",
      focus: "Quads & Calves",
      exercises: [
        {
          name: "Barbell Back Squat",
          equipment: "barbell",
          primaryMuscle: "quads",
          sets: 3,
          reps: "6-10",
          restSeconds: 180,
          targetRIR: 1,
          notes: "Controlled descent with full knee flexion"
        }
      ]
    }
  ]
};

const SAMPLE_JSON_STRING = JSON.stringify(SAMPLE_JSON_PLAN, null, 2);

const SAMPLE_AI_PROMPT = `Generate an IronPath workout plan in JSON format. Ensure it follows this exact JSON structure:

${SAMPLE_JSON_STRING}`;

export const PlanJSONModal: React.FC<PlanJSONModalProps> = ({
  isOpen,
  onClose,
  planToExport,
  mode
}) => {
  const [jsonText, setJsonText] = useState(
    planToExport ? JSON.stringify(planToExport, null, 2) : ''
  );
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createCustomPlan = useIronPathStore((s) => s.createCustomPlan);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySamplePrompt = () => {
    navigator.clipboard.writeText(SAMPLE_AI_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleLoadSample = () => {
    setJsonText(SAMPLE_JSON_STRING);
    setError(null);
  };

  const handleDownload = () => {
    if (!planToExport) return;
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planToExport.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_ironpath.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.title || !Array.isArray(parsed.days)) {
        throw new Error('Invalid IronPath plan format. Must include title and days array.');
      }
      const newPlan = createCustomPlan(
        parsed.title + ' (Imported)',
        parsed.description || 'Imported via JSON blueprint',
        parsed.daysPerWeek || parsed.days.length || 3,
        parsed.goal || 'Custom Hypertrophy',
        parsed.notes || ''
      );

      // Overwrite days if structured
      if (parsed.days.length > 0) {
        useIronPathStore.getState().updateCustomPlan(newPlan.id, {
          days: parsed.days.map((d: any, dIdx: number) => ({
            id: `day_${Date.now()}_${dIdx}`,
            name: d.name || `Day ${dIdx + 1}`,
            focus: d.focus || 'Hypertrophy Focus',
            scheduledDay: d.scheduledDay || 'Unscheduled',
            exercises: Array.isArray(d.exercises)
              ? d.exercises.map((e: any, eIdx: number) => ({
                  id: `c_ex_${Date.now()}_${dIdx}_${eIdx}`,
                  exerciseId: e.exerciseId || `ex_imp_${Date.now()}_${dIdx}_${eIdx}`,
                  name: e.name || 'Custom Exercise',
                  equipment: e.equipment || 'dumbbell',
                  sets: e.sets || 3,
                  reps: e.reps || '8-12',
                  restSeconds: e.restSeconds || 120,
                  primaryMuscle: e.primaryMuscle || 'chest',
                  notes: e.notes || '',
                  targetRIR: e.targetRIR ?? 1
                }))
              : []
          }))
        });
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse JSON. Please check formatting.');
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'export' ? 'Export Blueprint JSON' : 'Import Blueprint JSON'}
      subtitle={
        mode === 'export'
          ? 'Share or backup your training plan structure in JSON format'
          : 'Paste an IronPath JSON schema or use sample prompts to import a complete plan'
      }
    >
      {mode === 'export' ? (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              readOnly
              rows={10}
              value={jsonText}
              className="w-full p-3.5 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-purple-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied JSON!' : 'Copy to Clipboard'}
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              leftIcon={<Download className="w-4 h-4 text-zinc-950" />}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black"
            >
              Download JSON
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleImportSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Helper Actions for Import */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Sample JSON Helpers
              </span>
              <span className="text-[10px] text-zinc-500">Quick start template</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopySamplePrompt}
                leftIcon={copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                className="text-xs font-semibold justify-center"
              >
                {copiedPrompt ? 'Copied Prompt!' : 'Copy AI Prompt & Schema'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                leftIcon={<FileText className="w-3.5 h-3.5 text-emerald-400" />}
                className="text-xs font-semibold justify-center"
              >
                Load Sample Template
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Paste Plan JSON Code
            </label>
            <textarea
              rows={9}
              required
              placeholder='{\n  "title": "5 Day Aesthetic Split",\n  "days": [...]\n}'
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full p-3.5 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full font-black gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
            leftIcon={<Upload className="w-4 h-4 text-zinc-950" />}
          >
            Import Plan Blueprint
          </Button>
        </form>
      )}
    </BottomSheet>
  );
};

