/**
 * This file contains the main application component.
 * It provides the UI for generating YouTube copywriting content using the Gemini API.
 */
import React, { useState } from 'react';
import { Button } from './components/Button';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { SparklesIcon, ExclamationTriangleIcon, SearchIcon, ClipboardIcon } from './components/Icons';
import { TONE_PRESETS, NICHE_OPTIONS } from './constants';
import { generateCopy, CopywritingResult } from './services/geminiService';

const ResultSection = ({ title, content }: { title: string; content: string | string[] }) => {
    const [copied, setCopied] = useState(false);
    const textToCopy = Array.isArray(content) ? content.join(', ') : content;

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-purple-300">{title}</h3>
                <div className="relative">
                    <button 
                      onClick={handleCopy} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label={`Copy ${title}`}
                    >
                        <ClipboardIcon className="w-5 h-5" />
                    </button>
                    {copied && <span className="absolute -top-7 right-0 text-xs bg-gray-900 text-green-400 px-2 py-1 rounded shadow-lg">Copied!</span>}
                </div>
            </div>
            <div className="bg-gray-900/70 p-4 rounded-md text-gray-300 whitespace-pre-wrap font-mono text-sm break-words">
                {Array.isArray(content) ? content.join(', ') : content}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [niche, setNiche] = useState('auto-detect');
    const [tone, setTone] = useState('Conversational (default)');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CopywritingResult | null>(null);

    const handleSearchImage = () => {
        if (!topic.trim()) return;
        const encodedTopic = encodeURIComponent(topic);
        const searchUrl = `https://yandex.com/images/search?text=${encodedTopic}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please enter a video topic.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const generatedResult = await generateCopy(topic, niche, tone);
            setResult(generatedResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
            <main className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        YT Copywriting AI
                    </h1>
                    <p className="text-gray-400">
                        Generate catchy titles, descriptions, and more for your YouTube videos.
                    </p>
                </header>

                <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField id="topic" label="Video Topic" placeholder="e.g., How to make a sourdough starter" value={topic} onChange={(e) => setTopic(e.target.value)} required />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <SelectField id="niche" label="Video Niche" value={niche} onChange={(e) => setNiche(e.target.value)} options={NICHE_OPTIONS} />
                           <SelectField id="tone" label="Desired Tone" value={tone} onChange={(e) => setTone(e.target.value)} options={TONE_PRESETS.map(t => ({ value: t, label: t }))} />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Thumbnail Idea
                            </label>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleSearchImage}
                                disabled={!topic.trim()}
                            >
                                Search for ideas on Yandex Images
                                <SearchIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </div>

                        <Button type="submit" variant="primary" disabled={loading || !topic.trim()}>
                            {loading && !result ? 'Generating...' : (
                                <>
                                    Generate Copy
                                    <SparklesIcon className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {error && (
                    <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center" role="alert">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-3" />
                        <span>{error}</span>
                    </div>
                )}
                
                {loading && !result && (
                    <div className="mt-8 text-center">
                        <div role="status" className="flex justify-center items-center space-x-2">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-600 animate-spin fill-purple-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="text-lg text-gray-400">Generating ideas... this may take a moment.</span>
                        </div>
                    </div>
                )}

                {result && !loading && (
                    <div className="mt-8 bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 space-y-6">
                        <h2 className="text-2xl font-bold text-center text-gray-200">Generated Copy</h2>
                        <ResultSection title="Video Title" content={result.title} />
                        <ResultSection title="Thumbnail Idea" content={result.thumbnailIdea} />
                        <ResultSection title="Script Hook" content={result.scriptHook} />
                        <ResultSection title="Description" content={result.description} />
                        <ResultSection title="Tags" content={result.tags} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;