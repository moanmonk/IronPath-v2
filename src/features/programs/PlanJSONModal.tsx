import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, FileJson, Upload, AlertCircle, Sparkles, FileText, Printer, MessageSquare } from 'lucide-react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { CustomWorkoutPlan, Exercise } from '../../types';
import { useIronPathStore } from '../../store/useIronPathStore';
import { normalizeMuscleGroup } from '../../lib/muscleUtils';

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

export const printPlanAsPdf = (plan: CustomWorkoutPlan) => {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to open the printable PDF window.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${plan.title} - IronPath Blueprint</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #ffffff;
            color: #09090b;
            margin: 0;
            padding: 36px;
            -webkit-print-color-adjust: exact;
          }
          .header {
            border-bottom: 2px solid #18181b;
            padding-bottom: 16px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .brand {
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #71717a;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          h1 {
            font-size: 24px;
            font-weight: 900;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
            color: #09090b;
          }
          .meta-bar {
            display: flex;
            gap: 12px;
            font-size: 12px;
            font-weight: 700;
          }
          .meta-item {
            background-color: #f4f4f5;
            padding: 4px 10px;
            border-radius: 6px;
            color: #27272a;
          }
          .description {
            font-size: 12px;
            color: #3f3f46;
            margin: 14px 0 20px 0;
            line-height: 1.5;
            background: #fafafa;
            padding: 12px 14px;
            border-left: 3px solid #7c3aed;
            border-radius: 4px;
          }
          .day-section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .day-title {
            font-size: 14px;
            font-weight: 800;
            background: #18181b;
            color: #ffffff;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 12px;
          }
          th {
            background-color: #f4f4f5;
            text-align: left;
            padding: 8px 10px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
            color: #52525b;
            border-bottom: 1px solid #e4e4e7;
          }
          td {
            padding: 9px 10px;
            border-bottom: 1px solid #f4f4f5;
            color: #18181b;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          .muscle-badge {
            display: inline-block;
            background: #e4e4e7;
            color: #18181b;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .notes-text {
            font-size: 10px;
            color: #52525b;
            font-style: italic;
          }
          .footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #e4e4e7;
            font-size: 10px;
            color: #a1a1aa;
            text-align: center;
          }
          @media print {
            body { padding: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #7c3aed; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="brand">IRONPATH • TRAINING BLUEPRINT</div>
            <h1>${plan.title}</h1>
            <div class="meta-bar">
              <span class="meta-item">Goal: ${plan.goal || 'Hypertrophy'}</span>
              <span class="meta-item">Frequency: ${plan.daysPerWeek || plan.days.length} Days / Week</span>
            </div>
          </div>
        </div>

        ${plan.description ? `<div class="description"><strong>Overview:</strong> ${plan.description}</div>` : ''}
        ${plan.notes ? `<div class="description"><strong>Execution Rules:</strong> ${plan.notes}</div>` : ''}

        ${plan.days.map((day, idx) => `
          <div class="day-section">
            <div class="day-title">
              <span>Day ${idx + 1}: ${day.name}</span>
              <span style="font-weight: 500; font-size: 11px; opacity: 0.85;">${day.scheduledDay || 'Unscheduled'} • Focus: ${day.focus}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 4%;">#</th>
                  <th style="width: 36%;">Exercise</th>
                  <th style="width: 14%;">Muscle</th>
                  <th style="width: 12%;">Sets × Reps</th>
                  <th style="width: 10%;">Rest</th>
                  <th style="width: 24%;">Execution Cue</th>
                </tr>
              </thead>
              <tbody>
                ${day.exercises.map((ex, eIdx) => `
                  <tr>
                    <td><strong>${eIdx + 1}</strong></td>
                    <td><strong>${ex.name}</strong> <span style="font-size: 10px; color: #71717a;">(${ex.equipment || 'barbell'})</span></td>
                    <td><span class="muscle-badge">${(ex.primaryMuscle || 'chest').replace('_', ' ')}</span></td>
                    <td><strong>${ex.sets}</strong> × ${ex.reps}</td>
                    <td>${ex.restSeconds || 120}s</td>
                    <td class="notes-text">${ex.notes || ex.tempoNotes || 'Maintain strict control'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="footer">
          Generated with IronPath Hypertrophy Planner • ${new Date().toLocaleDateString()}
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

const generateSimpleNote = (plan: CustomWorkoutPlan): string => {
  let note = `📋 IRONPATH TRAINING BLUEPRINT: ${plan.title.toUpperCase()}\n`;
  note += `Goal: ${plan.goal || 'Custom Hypertrophy'}\n`;
  note += `Frequency: ${plan.daysPerWeek || plan.days.length} Days / Week\n`;
  if (plan.description) note += `Overview: ${plan.description}\n`;
  if (plan.notes) note += `Execution Rules: ${plan.notes}\n`;
  note += `==================================================\n\n`;

  plan.days.forEach((day, idx) => {
    note += `DAY ${idx + 1}: ${day.name.toUpperCase()} (${day.scheduledDay || 'Unscheduled'})\n`;
    note += `Focus: ${day.focus}\n`;
    note += `Exercises:\n`;
    day.exercises.forEach((ex, eIdx) => {
      note += `  ${eIdx + 1}. ${ex.name} (${ex.equipment || 'barbell'})\n`;
      note += `     • Sets: ${ex.sets} | Reps: ${ex.reps} | Rest: ${ex.restSeconds || 120}s | Target RIR: ${ex.targetRIR ?? 1}\n`;
      note += `     • Target Muscle: ${(ex.primaryMuscle || 'chest').replace('_', ' ')}\n`;
      if (ex.notes) note += `     • Execution Cue: ${ex.notes}\n`;
    });
    note += `\n`;
  });

  return note;
};

const generateAiPrompt = (plan: CustomWorkoutPlan): string => {
  const jsonStr = JSON.stringify(plan, null, 2);
  return `Act as an expert hypertrophy strength coach and exercise biomechanist. Please analyze and optimize my custom IronPath workout plan blueprint:

${jsonStr}

Please evaluate:
1. Target muscle group set volume distribution against weekly MAV guidelines
2. Fatigue management and exercise sequencing
3. Specific hypertrophy cues and overload strategies for maximum muscle growth.`;
};

export const PlanJSONModal: React.FC<PlanJSONModalProps> = ({
  isOpen,
  onClose,
  planToExport,
  mode
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'prompt' | 'note'>('pdf');
  const [jsonText, setJsonText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [aiPromptText, setAiPromptText] = useState('');

  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomPlan = useIronPathStore((s) => s.createCustomPlan);

  useEffect(() => {
    if (planToExport) {
      setJsonText(JSON.stringify(planToExport, null, 2));
      setNoteText(generateSimpleNote(planToExport));
      setAiPromptText(generateAiPrompt(planToExport));
    } else {
      setJsonText(SAMPLE_JSON_STRING);
    }
  }, [planToExport, isOpen, mode]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(aiPromptText || SAMPLE_AI_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(noteText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleLoadSample = () => {
    setJsonText(SAMPLE_JSON_STRING);
    setError(null);
  };

  const handleDownloadJson = () => {
    if (!planToExport) return;
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planToExport.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_ironpath.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadNote = () => {
    if (!planToExport) return;
    const blob = new Blob([noteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planToExport.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_notes.txt`;
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
        const store = useIronPathStore.getState();
        store.updateCustomPlan(newPlan.id, {
          days: parsed.days.map((d: any, dIdx: number) => ({
            id: `day_${Date.now()}_${dIdx}`,
            name: d.name || `Day ${dIdx + 1}`,
            focus: d.focus || 'Hypertrophy Focus',
            scheduledDay: d.scheduledDay || 'Unscheduled',
            exercises: Array.isArray(d.exercises)
              ? d.exercises.map((e: any, eIdx: number) => {
                  const normMuscle = normalizeMuscleGroup(e.primaryMuscle, e.name);
                  const exName = e.name || 'Custom Exercise';
                  const exId = e.exerciseId || `ex_imp_${Date.now()}_${dIdx}_${eIdx}`;
                  
                  // Also register into library
                  store.addCustomExerciseToLibrary({
                    id: exId,
                    name: exName,
                    primaryMuscle: normMuscle,
                    secondaryMuscles: [],
                    equipment: e.equipment || 'dumbbell',
                    category: 'compound',
                    hypertrophyTier: 'A Tier',
                    instructions: ['Controlled execution with focus on target muscle.'],
                    cue: e.notes || '',
                    defaultRIR: e.targetRIR ?? 1
                  });

                  return {
                    id: `c_ex_${Date.now()}_${dIdx}_${eIdx}`,
                    exerciseId: exId,
                    name: exName,
                    equipment: e.equipment || 'dumbbell',
                    sets: e.sets || 3,
                    reps: e.reps || '8-12',
                    restSeconds: e.restSeconds || 120,
                    primaryMuscle: normMuscle,
                    notes: e.notes || '',
                    targetRIR: e.targetRIR ?? 1
                  };
                })
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
      title={mode === 'export' ? 'Export Blueprint Hub' : 'Import Blueprint JSON'}
      subtitle={
        mode === 'export'
          ? `Export "${planToExport?.title || 'Workout Blueprint'}" to PDF, JSON, AI Prompt, or Simple Note`
          : 'Paste an IronPath JSON schema or use sample prompts to import a complete plan'
      }
    >
      {mode === 'export' ? (
        <div className="space-y-4">
          {/* Format Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <button
              type="button"
              onClick={() => setExportFormat('pdf')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                exportFormat === 'pdf'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF & Print</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('json')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                exportFormat === 'json'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>JSON Data</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('prompt')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                exportFormat === 'prompt'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Prompt</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('note')}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                exportFormat === 'note'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Simple Note</span>
            </button>
          </div>

          {/* TAB 1: PDF PRINT VIEW */}
          {exportFormat === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div>
                    <h3 className="text-sm font-black text-zinc-100">{planToExport?.title || 'Workout Plan'}</h3>
                    <p className="text-xs text-purple-400 font-medium">{planToExport?.goal || 'Hypertrophy'} • {planToExport?.days.length || 0} Training Days</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-1 rounded-md font-bold">
                    Printable PDF Layout
                  </span>
                </div>

                <div className="text-xs text-zinc-400 space-y-1.5">
                  <p>• Cleanly formatted HTML & CSS stylesheet styled specifically for high-density PDF printing.</p>
                  <p>• Includes exercise breakdown, set/rep ranges, target muscles, rest periods, and execution cues.</p>
                </div>

                {/* Day Overview List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {planToExport?.days.map((day, dIdx) => (
                    <div key={day.id || dIdx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs flex items-center justify-between">
                      <span className="font-bold text-zinc-200">Day {dIdx + 1}: {day.name}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">{day.exercises.length} Exercises</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => planToExport && printPlanAsPdf(planToExport)}
                  leftIcon={<Printer className="w-4 h-4 text-white" />}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black shadow-lg shadow-purple-600/20"
                >
                  Print / Export to PDF
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => planToExport && printPlanAsPdf(planToExport)}
                  leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
                  className="border-zinc-800 text-zinc-200 hover:bg-zinc-900 font-bold"
                >
                  Save as PDF Document
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: JSON CODE VIEW */}
          {exportFormat === 'json' && (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  readOnly
                  rows={10}
                  value={jsonText}
                  className="w-full p-3.5 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-purple-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCopyJson}
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied JSON!' : 'Copy JSON to Clipboard'}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownloadJson}
                  leftIcon={<Download className="w-4 h-4 text-zinc-950" />}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black"
                >
                  Download .json File
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: AI JSON PROMPT */}
          {exportFormat === 'prompt' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-400" />
                <span>Copy this AI prompt with your plan's JSON data to analyze or generate variations in Gemini / ChatGPT.</span>
              </div>

              <textarea
                readOnly
                rows={9}
                value={aiPromptText}
                className="w-full p-3.5 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none"
              />

              <Button
                variant="primary"
                size="lg"
                onClick={handleCopyAiPrompt}
                leftIcon={copiedPrompt ? <Check className="w-4 h-4 text-zinc-950" /> : <Copy className="w-4 h-4 text-zinc-950" />}
                className="w-full font-black bg-purple-500 hover:bg-purple-400 text-zinc-950"
              >
                {copiedPrompt ? 'Copied AI Prompt!' : 'Copy AI Prompt with Plan JSON'}
              </Button>
            </div>
          )}

          {/* TAB 4: SIMPLE NOTE FORM */}
          {exportFormat === 'note' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Editable Text Note Form
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">You can edit the text directly before copying</span>
              </div>

              <textarea
                rows={10}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-3.5 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-purple-500 leading-relaxed"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCopyNote}
                  leftIcon={copiedNote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedNote ? 'Copied Note Text!' : 'Copy Text Note'}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownloadNote}
                  leftIcon={<Download className="w-4 h-4 text-zinc-950" />}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black"
                >
                  Download Note (.txt)
                </Button>
              </div>
            </div>
          )}
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
                onClick={handleCopyAiPrompt}
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


