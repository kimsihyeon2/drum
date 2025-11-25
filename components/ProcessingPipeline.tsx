import React from 'react';
import { CheckCircle2, Circle, Loader2, Cpu } from 'lucide-react';
import { ProcessingStep } from '../types';

interface Props {
  steps: ProcessingStep[];
}

const ProcessingPipeline: React.FC<Props> = ({ steps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-dark-900/50 backdrop-blur-md border border-brand-500/20 rounded-xl p-8 shadow-2xl animate-fade-in">
      <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
        <Cpu className="w-6 h-6 text-brand-500" />
        Processing Audio Pipeline
      </h3>
      
      <div className="space-y-8 relative">
        {/* Vertical Line Background */}
        <div className="absolute left-[19px] top-2 bottom-4 w-[2px] bg-dark-700/50 z-0"></div>

        {steps.map((step, index) => {
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';
          const isPending = step.status === 'pending';

          return (
            <div key={step.id} className={`relative z-10 flex items-start gap-5 transition-all duration-500 ${isPending ? 'opacity-40 grayscale' : 'opacity-100'}`}>
              
              <div className="mt-0.5 bg-dark-900 rounded-full p-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-7 h-7 text-green-400 shadow-glow-green" />
                ) : isActive ? (
                  <div className="relative">
                    <Loader2 className="w-7 h-7 text-brand-400 animate-spin" />
                    <div className="absolute inset-0 bg-brand-400/20 blur-lg rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <Circle className="w-7 h-7 text-gray-600" />
                )}
              </div>

              <div className="flex-1 bg-dark-800/40 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`text-lg font-medium tracking-wide ${isActive ? 'text-brand-100' : isCompleted ? 'text-green-50' : 'text-gray-400'}`}>
                    {step.label}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 animate-pulse bg-brand-500/10 px-2 py-0.5 rounded">
                      Processing
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 font-mono leading-relaxed">
                  {step.detail}
                </p>
                
                {/* Visualizer for 'Active' state only */}
                {isActive && (
                  <div className="mt-4 h-1.5 w-full bg-dark-950 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-brand-600 to-accent-500 animate-progress-indeterminate shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingPipeline;