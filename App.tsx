
import React, { useState, useCallback, useEffect } from 'react';
import { generateContentFromApi } from './services/geminiService';
import { Button, ButtonVariant } from './components/Button';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { TONE_PRESETS, NICHE_OPTIONS } from './constants';
import { SparklesIcon, ExclamationTriangleIcon, SettingsIcon } from './components/Icons';

interface ButtonConfig {
  label: string;
  subLabel?: string;
  variant: ButtonVariant;
  action: 'generate' | 'notImplemented';
}

const BUTTONS: ButtonConfig[] = [
  { label: 'Generate', subLabel: '(Online AI)', variant: 'primary', action: 'generate' },
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

  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyInput(storedKey);
    } else {
      setIsSettingsOpen(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    setApiKey(apiKeyInput);
    localStorage.setItem('gemini_api_key', apiKeyInput);
    setIsSettingsOpen(false);
    setError(null); // Clear previous errors about missing key
  };

  const handleOpenSettings = () => {
    setApiKeyInput(apiKey);
    setIsSettingsOpen(true);
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('Please set your Gemini API key in the settings before generating content.');
      handleOpenSettings();
      return;
    }
    if (!topic.trim()) {
      setError('Topic cannot be empty.');
      return;
    }
    setIsLoading(true);
    setGeneratedContent('');
    setError(null);
    try {
      const content = await generateContentFromApi(topic, tone, apiKey);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, tone, apiKey]);

  const handleNotImplemented = () => {
    alert('This feature is not implemented yet.');
  };

  const getAction = (action: 'generate' | 'notImplemented') => {
    return action === 'generate' ? handleGenerate : handleNotImplemented;
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center font-sans p-4 text-gray-300">
      <div className="w-full max-w-3xl bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700 relative">
        <button 
          onClick={handleOpenSettings} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Open Settings"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>

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
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center justify-center text-center">
            <SparklesIcon className="w-10 h-10 text-blue-400 animate-pulse" />
            <p className="mt-4 text-gray-300 font-semibold">Generating content...</p>
            <p className="text-gray-400 text-sm">Please wait a moment.</p>
          </div>
        )}
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-md">
            <div className="flex">
              <div className="py-1">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mr-3" />
              </div>
              <div>
                <p className="font-bold text-red-200">Error</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        {generatedContent && !isLoading && (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Generated Content:</h3>
            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{generatedContent}</div>
          </div>
        )}
      </div>

      <footer className="text-center mt-8 text-xs text-gray-500">
        <p>Shorts Generator v11 — Pro Edition • Save this HTML and open in browser. For Online AI, run via local server for best results.</p>
      </footer>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-2">Settings</h2>
            <p className="text-gray-400 mb-4 text-sm">
              Please enter your Gemini API key. Your key is stored securely in your browser's local storage.
            </p>
            <InputField
              id="apiKey"
              label="Gemini API Key"
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your API key"
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveApiKey}>Save Key</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
