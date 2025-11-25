import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Layers, Disc } from 'lucide-react';

interface Props {
  originalUrl: string;
  drumUrl: string;
}

const AudioPlayer: React.FC<Props> = ({ originalUrl, drumUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'mix' | 'drums'>('mix');
  const [progress, setProgress] = useState(0);
  
  // In a real app, use Web Audio API or multiple audio elements synced.
  // For demo, we just toggle the source text essentially.
  
  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-dark-800 border-t border-gray-800 p-4 fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-400 text-white shadow-lg transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm">Currently Playing</span>
            <span className="text-brand-400 text-xs font-mono">
              {mode === 'mix' ? 'Original Mix (MP3)' : 'Separated Drums (Demucs HT)'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 w-full md:mx-8">
           <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden cursor-pointer group">
              <div 
                className="absolute top-0 left-0 h-full bg-brand-500 group-hover:bg-brand-400 transition-all" 
                style={{ width: `${progress}%` }}
              />
           </div>
           <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
              <span>0:00</span>
              <span>3:45</span>
           </div>
        </div>

        {/* Stem Toggle */}
        <div className="flex items-center gap-2 bg-dark-900 p-1 rounded-lg border border-gray-800">
          <button 
            onClick={() => setMode('mix')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'mix' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Disc className="w-4 h-4" />
            <span className="hidden sm:inline">Original</span>
          </button>
          <button 
            onClick={() => setMode('drums')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'drums' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Drums Only</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AudioPlayer;