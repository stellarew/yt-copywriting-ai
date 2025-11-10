import React, { useState, useCallback, useEffect } from 'react';
import { generateContentFromApi, getSmartSuggestions } from './services/geminiService';
import { Button, ButtonVariant } from './components/Button';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { TONE_PRESETS, NICHE_OPTIONS } from './constants';
import { SparklesIcon, ExclamationTriangleIcon, SettingsIcon, ImageIcon, ClipboardIcon } from './components/Icons';

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
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<boolean>(false);
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState<boolean>(false);
  
  const [isCopied, setIsCopied] = useState(false);

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
    setError(null);
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

  const handleSmartSuggest = useCallback(async () => {
    if (!apiKey.trim()) {
        setError('Please set your Gemini API key in the settings first.');
        handleOpenSettings();
        return;
    }
    setIsSuggestionsLoading(true);
    setIsSuggestionsModalOpen(true);
    setError(null);
    setSuggestions([]);
    try {
        const suggestedTopics = await getSmartSuggestions(topic, niche, apiKey);
        setSuggestions(suggestedTopics);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching suggestions.');
        setIsSuggestionsModalOpen(false);
    } finally {
        setIsSuggestionsLoading(false);
    }
  }, [topic, niche, apiKey]);

  const handleImageSearch = () => {
    const encodedTopic = encodeURIComponent(topic);
    const searchUrl = `https://yandex.com/images/search?text=${encodedTopic}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleNotImplemented = () => {
    alert('This feature is not implemented yet.');
  };
  
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-sans p-4 text-gray-300">
      <div className="w-full max-w-5xl bg-gray-900/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative">
        <button 
          onClick={handleOpenSettings} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Open Settings"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">AI Narrative Generator</h1>
          <p className="text-gray-400 mt-2">Turn your ideas into compelling stories instantly.</p>
        </div>

        <div className="space-y-6">
          <InputField
            id="topic"
            label="TOPIC (short & specific)"
            labelDetail="(e.g. 'A cat who learns to fly')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic here..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              id="niche"
              label="NICHE"
              options={NICHE_OPTIONS}
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
            <SelectField
              id="tone"
              label="TONE"
              options={TONE_PRESETS.map(t => ({ value: t, label: t }))}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isLoading || isSuggestionsLoading}
            className="w-full text-lg py-4"
          >
            <SparklesIcon className="w-6 h-6 mr-2" />
            <span className="font-semibold">Generate Narrative</span>
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button onClick={handleSmartSuggest} disabled={isLoading || isSuggestionsLoading}>Smart Suggest</Button>
          <Button onClick={handleNotImplemented}>Random Example</Button>
          <Button onClick={handleNotImplemented}>Batch Export</Button>
          <Button onClick={handleNotImplemented}>Save Draft</Button>
          <Button onClick={handleNotImplemented}>Load Draft</Button>
          <Button onClick={handleNotImplemented}>Hosted Demo</Button>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-700/50">
            <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-3 text-blue-400 bg-blue-900/20 p-4 rounded-lg">
            <SparklesIcon className="w-6 h-6 animate-spin" />
            <p className="font-semibold">Generating your narrative... please wait.</p>
          </div>
        )}
        
        {generatedContent && !isLoading && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Generated Narrative</h3>
                <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                >
                    <ClipboardIcon className="w-4 h-4" />
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto border border-gray-700">
              {generatedContent}
            </div>
            <button
              onClick={handleImageSearch}
              className="mt-2 flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
              Search for relevant images on Yandex
            </button>
          </div>
        )}

      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Settings</h2>
            <p className="text-sm text-gray-400 mb-4">
              Please enter your Gemini API key. Your key is stored locally in your browser and is never sent to our servers.
            </p>
            <InputField
              id="api-key"
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
      
      {isSuggestionsModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                  <h2 className="text-xl font-bold mb-4 text-white">Smart Suggestions for "{topic}"</h2>
                  {isSuggestionsLoading ? (
                      <div className="flex items-center justify-center gap-3 text-gray-400 h-60">
                          <SparklesIcon className="w-6 h-6 animate-spin" />
                          <p className="font-semibold">Finding creative ideas...</p>
                      </div>
                  ) : (
                      <>
                          <ul className="list-disc list-inside space-y-2 max-h-80 overflow-y-auto text-gray-300 bg-gray-900/50 p-4 rounded-md border border-gray-700">
                              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                          <div className="mt-6 flex justify-end">
                              <Button variant="primary" onClick={() => setIsSuggestionsModalOpen(false)}>
                                  Close
                              </Button>
                          </div>
                      </>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default App;