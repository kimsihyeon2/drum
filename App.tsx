import React, { useState } from 'react';
import { Search, Sparkles, Activity, Download, Settings2, Github, Drum, Lightbulb, Loader2 } from 'lucide-react';
import { ProcessStatus, ProcessingStep, TranscriptionResult, SongMetadata } from './types';
import { MOCK_DRUM_XML, PROCESSING_STEPS_TEMPLATE } from './constants';
import ProcessingPipeline from './components/ProcessingPipeline';
import ScoreViewer from './components/ScoreViewer';
import AudioPlayer from './components/AudioPlayer';
import { generateDrumCoachAdvice } from './services/geminiService';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [steps, setSteps] = useState<ProcessingStep[]>(
    PROCESSING_STEPS_TEMPLATE.map(s => ({ ...s, status: 'pending' }))
  );
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [coachTip, setCoachTip] = useState<string | null>(null);

  // Simulation of the backend pipeline
  const startProcessing = async () => {
    if (!url.trim()) {
      alert('Please enter a YouTube URL to start.');
      return;
    }
    
    // Reset state
    setResult(null);
    setCoachTip(null);
    setSteps(PROCESSING_STEPS_TEMPLATE.map(s => ({ ...s, status: 'pending' })));

    setStatus(ProcessStatus.DOWNLOADING);
    updateStepStatus('download', 'active');

    // 1. Simulate Download (yt-dlp)
    setTimeout(() => {
      updateStepStatus('download', 'completed');
      setStatus(ProcessStatus.SEPARATING);
      updateStepStatus('separate', 'active');
      
      // 2. Simulate Separation (Demucs)
      setTimeout(() => {
        updateStepStatus('separate', 'completed');
        setStatus(ProcessStatus.TRANSCRIBING);
        updateStepStatus('transcribe', 'active');
        
        // 3. Simulate Transcription (Omnizart)
        setTimeout(() => {
          updateStepStatus('transcribe', 'completed');
          setStatus(ProcessStatus.RENDERING);
          updateStepStatus('render', 'active');
          
          // 4. Simulate Rendering & Gemini
          setTimeout(async () => {
            updateStepStatus('render', 'completed');
            setStatus(ProcessStatus.COMPLETE);
            
            // Mock Result based on standard rock song structure
            const mockMeta: SongMetadata = {
              title: "Neon Groove",
              artist: "Synthwave Collective",
              duration: "3:45",
              bpm: 120,
              difficulty: "Intermediate",
              youtubeId: "dQw4w9WgXcQ"
            };
            
            setResult({
              metadata: mockMeta,
              musicXml: MOCK_DRUM_XML,
              drumAudioUrl: '#',
              originalAudioUrl: '#'
            });

            // Call Gemini Service
            const tip = await generateDrumCoachAdvice(mockMeta.title, mockMeta.artist, mockMeta.difficulty);
            setCoachTip(tip);

          }, 1200);
        }, 2500);
      }, 3000); // Heavy model takes longer
    }, 1500);
  };

  const updateStepStatus = (id: string, status: 'pending' | 'active' | 'completed') => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleReset = () => {
    setStatus(ProcessStatus.IDLE);
    setResult(null);
    setCoachTip(null);
    setSteps(PROCESSING_STEPS_TEMPLATE.map(s => ({ ...s, status: 'pending' })));
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-300 font-sans selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-dark-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-500 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleReset}>
            <Activity className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-white">Groove<span className="text-brand-400">Extract</span> AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Architecture</span>
            <span className="hover:text-white transition-colors cursor-pointer">Models</span>
            <a href="#" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-full transition-all text-white">
              <Github className="w-4 h-4" />
              <span>View Source</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 pb-40">
        
        {/* HERO SECTION (Visible when IDLE) */}
        {status === ProcessStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10 animate-fade-in px-4">
            <div className="relative group cursor-default">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-accent-600/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-dark-900/80 backdrop-blur-xl rounded-full p-6 border border-white/10 shadow-2xl transform group-hover:scale-105 transition duration-300">
                <Drum className="w-16 h-16 text-brand-400" />
              </div>
            </div>
            
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Turn YouTube into <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400">Professional Drum Sheets</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Experience the SOTA pipeline: <span className="text-slate-300 font-semibold">yt-dlp</span> download, 
                <span className="text-slate-300 font-semibold"> Demucs</span> source separation, and 
                <span className="text-slate-300 font-semibold"> Omnizart</span> transcription.
              </p>
            </div>

            <div className="w-full max-w-xl relative group z-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-accent-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative flex items-center bg-dark-900 rounded-xl p-1.5 border border-white/10 shadow-2xl">
                <div className="pl-4 text-slate-500">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Paste YouTube URL (e.g. https://youtu.be/...)"
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startProcessing()}
                />
                <button 
                  onClick={startProcessing}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-brand-500/25 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 text-sm text-slate-500 mt-12 border-t border-white/5 pt-12">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-dark-800 rounded-lg"><Settings2 className="w-5 h-5 text-brand-400" /></div>
                <span>Hybrid Transformer (HT) Demucs</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-dark-800 rounded-lg"><Activity className="w-5 h-5 text-accent-400" /></div>
                <span>Onset Detection (Omnizart)</span>
              </div>
               <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
                <div className="p-2 bg-dark-800 rounded-lg"><Download className="w-5 h-5 text-green-400" /></div>
                <span>MIDI & MusicXML Export</span>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING STATE */}
        {status !== ProcessStatus.IDLE && status !== ProcessStatus.COMPLETE && (
          <div className="py-20 animate-fade-in flex flex-col items-center">
             <ProcessingPipeline steps={steps} />
             <button 
               onClick={handleReset} 
               className="mt-8 text-slate-500 hover:text-white underline text-sm transition-colors"
             >
               Cancel Operation
             </button>
          </div>
        )}

        {/* RESULT DASHBOARD */}
        {status === ProcessStatus.COMPLETE && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            
            {/* Left Col: Sheet Music (Wider) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900/50 p-6 rounded-xl border border-white/5">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-1">{result.metadata.title}</h2>
                   <p className="text-brand-400 font-medium">{result.metadata.artist}</p>
                </div>
                <div className="flex gap-3">
                   <button className="flex-1 sm:flex-none px-5 py-2.5 bg-dark-800 hover:bg-dark-700 border border-white/10 rounded-lg text-sm font-medium text-white transition-all hover:border-white/20 flex items-center justify-center gap-2">
                     <Download className="w-4 h-4" /> MIDI
                   </button>
                   <button className="flex-1 sm:flex-none px-5 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2">
                     <Download className="w-4 h-4" /> PDF
                   </button>
                </div>
              </div>

              {/* SHEET MUSIC RENDERER */}
              <ScoreViewer musicXml={result.musicXml} />
              
            </div>

            {/* Right Col: Stats & AI Coach */}
            <div className="space-y-6">
              
              {/* Metadata Card */}
              <div className="bg-dark-900 border border-white/5 rounded-xl p-6 shadow-xl">
                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Track Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-950/50 rounded-lg border border-white/5">
                    <div className="text-xs text-slate-400 mb-1">Detected BPM</div>
                    <div className="text-2xl font-mono text-white font-bold">{result.metadata.bpm}</div>
                  </div>
                  <div className="p-4 bg-dark-950/50 rounded-lg border border-white/5">
                    <div className="text-xs text-slate-400 mb-1">Complexity</div>
                    <div className={`text-xl font-bold ${
                      result.metadata.difficulty === 'Expert' ? 'text-red-400' : 
                      result.metadata.difficulty === 'Advanced' ? 'text-orange-400' : 'text-emerald-400'
                    }`}>
                      {result.metadata.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Coach */}
              <div className="group relative bg-gradient-to-br from-brand-900/80 to-dark-900 border border-brand-500/30 rounded-xl p-6 overflow-hidden shadow-lg transition-all hover:border-brand-500/50">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Lightbulb className="w-32 h-32 text-white transform rotate-12" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <h3 className="text-lg font-bold text-white">Gemini Coach Tips</h3>
                  </div>

                  {coachTip ? (
                    <div className="prose prose-invert prose-sm">
                      <div className="text-slate-200 whitespace-pre-line leading-relaxed text-sm bg-black/20 p-4 rounded-lg border border-white/5">
                        {coachTip}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 py-4">
                       <div className="flex items-center gap-3 text-slate-400 text-sm animate-pulse">
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Analyzing groove patterns...
                       </div>
                       <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                       <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Model Info */}
              <div className="bg-dark-900/50 border border-white/5 rounded-xl p-6">
                 <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Pipeline Telemetry</h4>
                 <ul className="space-y-3 text-xs text-slate-400 font-mono">
                   <li className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span>Source Separation</span>
                     <span className="text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded">HTDemucs v4</span>
                   </li>
                   <li className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span>Transcription</span>
                     <span className="text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded">Omnizart</span>
                   </li>
                   <li className="flex justify-between items-center">
                     <span>Inference Time</span>
                     <span className="text-green-400">1.2s (Simulated)</span>
                   </li>
                 </ul>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Persistent Audio Player */}
      {status === ProcessStatus.COMPLETE && result && (
        <AudioPlayer originalUrl={result.originalAudioUrl} drumUrl={result.drumAudioUrl} />
      )}

      {/* CSS Animation Extras */}
      <style>{`
        @keyframes progress-indeterminate {
          0% { margin-left: -50%; width: 50%; }
          50% { margin-left: 25%; width: 50%; }
          100% { margin-left: 100%; width: 50%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        .shadow-glow-green {
          filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.5));
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;