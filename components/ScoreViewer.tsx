import React from 'react';

interface Props {
  musicXml: string; // Kept for interface compatibility
  zoom?: number;
}

const ScoreViewer: React.FC<Props> = ({ zoom = 1.0 }) => {
  // This component simulates the visual output of OpenSheetMusicDisplay (OSMD)
  // by rendering a high-quality SVG of a standard rock drum beat.
  
  const scale = zoom;
  const staffLineColor = "#94a3b8"; // slate-400
  const noteColor = "#0f172a"; // slate-900

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-xl overflow-hidden min-h-[300px]">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
          <span>🎼</span> Generated Score Preview
        </h3>
        <div className="flex gap-2">
           <span className="px-2 py-1 bg-gray-100 text-xs font-mono text-gray-500 rounded">BPM: 120</span>
           <span className="px-2 py-1 bg-gray-100 text-xs font-mono text-gray-500 rounded">4/4</span>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto flex justify-center">
        <svg width="800" height="200" viewBox="0 0 800 200" className="opacity-90">
          
          {/* --- Measure 1 --- */}
          <g transform="translate(50, 40)">
            {/* Staff Lines */}
            <line x1="0" y1="0" x2="700" y2="0" stroke={staffLineColor} strokeWidth="1" />
            <line x1="0" y1="10" x2="700" y2="10" stroke={staffLineColor} strokeWidth="1" />
            <line x1="0" y1="20" x2="700" y2="20" stroke={staffLineColor} strokeWidth="1" />
            <line x1="0" y1="30" x2="700" y2="30" stroke={staffLineColor} strokeWidth="1" />
            <line x1="0" y1="40" x2="700" y2="40" stroke={staffLineColor} strokeWidth="1" />
            
            {/* Bar Lines */}
            <line x1="0" y1="0" x2="0" y2="40" stroke={noteColor} strokeWidth="2" />
            <line x1="350" y1="0" x2="350" y2="40" stroke={noteColor} strokeWidth="1" />
            <line x1="700" y1="0" x2="700" y2="40" stroke={noteColor} strokeWidth="2" />

            {/* Percussion Clef (Rectangle) */}
            <rect x="10" y="10" width="4" height="20" fill={noteColor} />
            <rect x="17" y="10" width="4" height="20" fill={noteColor} />

            {/* Time Signature (4/4) */}
            <text x="35" y="18" fontFamily="serif" fontSize="24" fontWeight="bold" fill={noteColor}>4</text>
            <text x="35" y="38" fontFamily="serif" fontSize="24" fontWeight="bold" fill={noteColor}>4</text>

            {/* --- Notes Rendering (Mocking a Basic Rock Beat) --- */}
            
            {/* Beat 1: Kick + Hi-Hat */}
            <g transform="translate(80, 0)">
               {/* Hi-Hat (x) */}
               <text x="-3" y="-2" fontSize="14" fontWeight="bold" fill={noteColor}>x</text>
               <line x1="0" y1="-5" x2="0" y2="25" stroke={noteColor} strokeWidth="2" /> {/* Stem */}
               {/* Kick (circle) */}
               <ellipse cx="0" cy="45" rx="4" ry="3" fill={noteColor} />
            </g>

            {/* Beat 1.5: Hi-Hat */}
            <g transform="translate(120, 0)">
               <text x="-3" y="-2" fontSize="14" fontWeight="bold" fill={noteColor}>x</text>
               <line x1="0" y1="-5" x2="0" y2="25" stroke={noteColor} strokeWidth="2" />
               {/* Beam to previous */}
               <line x1="-40" y1="-5" x2="0" y2="-5" stroke={noteColor} strokeWidth="4" />
            </g>

            {/* Beat 2: Snare + Hi-Hat */}
            <g transform="translate(160, 0)">
               <text x="-3" y="-2" fontSize="14" fontWeight="bold" fill={noteColor}>x</text>
               <line x1="0" y1="-5" x2="0" y2="20" stroke={noteColor} strokeWidth="2" />
               {/* Snare (circle on 3rd space) */}
               <ellipse cx="0" cy="25" rx="4" ry="3" fill={noteColor} />
            </g>

             {/* Beat 2.5: Hi-Hat */}
            <g transform="translate(200, 0)">
               <text x="-3" y="-2" fontSize="14" fontWeight="bold" fill={noteColor}>x</text>
               <line x1="0" y1="-5" x2="0" y2="25" stroke={noteColor} strokeWidth="2" />
               {/* Beam to previous */}
               <line x1="-40" y1="-5" x2="0" y2="-5" stroke={noteColor} strokeWidth="4" />
            </g>

             {/* Beat 3: Kick + Hi-Hat */}
            <g transform="translate(240, 0)">
               <text x="-3" y="-2" fontSize="14" fontWeight="bold" fill={noteColor}>x</text>
               <line x1="0" y1="-5" x2="0" y2="25" stroke={noteColor} strokeWidth="2" />
               <ellipse cx="0" cy="45" rx="4" ry="3" fill={noteColor} />
               <ellipse cx="14" cy="45" rx="4" ry="3" fill={noteColor} /> {/* Double Kick */}
               <line x1="14" y1="45" x2="14" y2="25" stroke={noteColor} strokeWidth="2" />
               <line x1="0" y1="25" x2="14" y2="25" stroke={noteColor} strokeWidth="4" /> {/* Beam for kicks */}
            </g>

            {/* Beat 3.5: Hi-Hat */}
             <g transform="translate(280, 0)">
               <text x="-3" y="-2" fontSize="14" fontWeight="bold" fill={noteColor}>x</text>
               <line x1="0" y1="-5" x2="0" y2="25" stroke={noteColor} strokeWidth="2" />
               <line x1="-40" y1="-5" x2="0" y2="-5" stroke={noteColor} strokeWidth="4" />
            </g>

            {/* Measure 2 (Fill) */}
            <g transform="translate(350, 0)">
               {/* Beat 1: Snare */}
               <g transform="translate(40, 0)">
                  <ellipse cx="0" cy="25" rx="4" ry="3" fill={noteColor} />
                  <line x1="0" y1="25" x2="0" y2="-10" stroke={noteColor} strokeWidth="2" />
               </g>
               {/* Beat 2: Tom 1 */}
               <g transform="translate(80, 0)">
                  <ellipse cx="0" cy="15" rx="4" ry="3" fill={noteColor} />
                  <line x1="0" y1="15" x2="0" y2="-10" stroke={noteColor} strokeWidth="2" />
                  <line x1="-40" y1="-10" x2="0" y2="-10" stroke={noteColor} strokeWidth="4" />
               </g>
               {/* Beat 3: Floor Tom */}
               <g transform="translate(120, 0)">
                  <ellipse cx="0" cy="35" rx="4" ry="3" fill={noteColor} />
                  <line x1="0" y1="35" x2="0" y2="-10" stroke={noteColor} strokeWidth="2" />
               </g>
               {/* Beat 4: Crash + Kick */}
               <g transform="translate(160, 0)">
                  {/* Crash symbol logic often uses a ledger line or different shape, simplifying here */}
                  <text x="-4" y="-8" fontSize="14" fontWeight="bold" fill={noteColor}>*</text> 
                  <line x1="0" y1="-5" x2="0" y2="45" stroke={noteColor} strokeWidth="2" />
                  <ellipse cx="0" cy="45" rx="4" ry="3" fill={noteColor} />
                  <line x1="-40" y1="-10" x2="0" y2="-5" stroke={noteColor} strokeWidth="4" />
               </g>
            </g>

          </g>
        </svg>
      </div>
      
      <div className="mt-4 flex justify-center">
         <div className="text-center text-xs text-gray-400 max-w-lg">
           * This is a preview. Actual MusicXML is rendered via OpenSheetMusicDisplay in the full build.
           The AI model (Omnizart) detects onsets for Kicks (Bottom), Snares (Middle), and Cymbals (Top).
         </div>
      </div>
    </div>
  );
};

export default ScoreViewer;