
import React, { useState, useCallback } from 'react';
import { generateContentFromApi } from './services/geminiService';
import { Button, ButtonVariant } from './components/Button';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { TONE_PRESETS, NICHE_OPTIONS } from './constants';
import { SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

interface ButtonConfig {
  label: string;
  subLabel?: string;
  variant: ButtonVariant;
  action: 'generate' | 'notImplemented';
}

const BUTTONS: ButtonConfig[] = [
  { label: 'Generate', subLabel: '(Online AI)', variant: 'primary', action: 'generate' },
  { label: 'Generate', subLabel: '(Offline DB)', variant: 'secondary', action: 'notImplemented' },
  { label: 'Smart Suggest', subLabel: '(20 topics)', variant: 'secondary', action: 'notImplemented' },
  { label: 'Random Example', subLabel: '', variant: 'secondary', action: 'notImplemented' },
  { label: 'Batch CSV Export', subLabel: '', variant: 'secondary', action: 'notImplemented' },
  { label: 'Save Draft', subLabel: '', variant: 'secondary', action: 'notImplemented' },
  { label: 'Load Draft', subLabel: '', variant: 'secondary', action: 'notImplemented' },
  { label: 'Hosted Demo', subLabel: 'Instructions', variant: 'secondary', action: 'notImplemented' },
];

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('kasih sayang leopard ke anaknya');
  const [niche, setNiche] = useState<string>(NICHE_OPTIONS[0].value);
  const [tone, setTone] = useState<string>(TONE_PRESETS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Topic cannot be empty.');
      return;
    }
    setIsLoading(true);
    setGeneratedContent('');
    setError(null);
    try {
      const content = await generateContentFromApi(topic, tone);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, tone]);

  const handleNotImplemented = () => {
    alert('This feature is not implemented yet.');
  };

  const getAction = (action: 'generate' | 'notImplemented') => {
    return action === 'generate' ? handleGenerate : handleNotImplemented;
  };
  
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-3xl bg-[#F0F7FF] p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
        <InputField
          id="topic"
          label="TOPIC (short & specific)"
          labelDetail="or choose Smart Suggest"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., A mother leopard's love for her cub"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <SelectField
            id="niche"
            label="Niche (auto-detect recommended)"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            options={NICHE_OPTIONS}
          />
          <SelectField
            id="tone"
            label="Tone Preset"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            options={TONE_PRESETS.map(t => ({ value: t, label: t }))}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {BUTTONS.map((btn) => (
            <Button
              key={btn.label + btn.subLabel}
              variant={btn.variant}
              onClick={getAction(btn.action)}
              disabled={isLoading && btn.action === 'generate'}
            >
              <span className="font-semibold">{btn.label}</span>
              {btn.subLabel && <span className="block text-xs font-normal">{btn.subLabel}</span>}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-3xl mt-6">
        {isLoading && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-center text-center">
            <SparklesIcon className="w-10 h-10 text-blue-500 animate-pulse" />
            <p className="mt-4 text-slate-600 font-semibold">Generating content...</p>
            <p className="text-slate-500 text-sm">Please wait a moment.</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-md">
            <div className="flex">
              <div className="py-1">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              </div>
              <div>
                <p className="font-bold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        {generatedContent && !isLoading && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Generated Content:</h3>
            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">{generatedContent}</div>
          </div>
        )}
      </div>

      <footer className="text-center mt-8 text-xs text-slate-500">
        <p>Shorts Generator v11 — Pro Edition • Save this HTML and open in browser. For Online AI, run via local server for best results.</p>
      </footer>
    </div>
  );
};

export default App;
