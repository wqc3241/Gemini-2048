import React from 'react';
import { Direction } from '../types';

interface GeminiControlsProps {
  onAskAI: () => void;
  loading: boolean;
  suggestion: { direction: Direction; reasoning: string } | null;
}

const GeminiControls: React.FC<GeminiControlsProps> = ({ onAskAI, loading, suggestion }) => {
  return (
    <div className="w-full max-w-[500px] mt-8 flex flex-col items-center space-y-4">
       <div className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col">
            <span className="font-bold text-gray-700 flex items-center gap-2">
               <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a3.5 3.5 0 0 0-3.5 3.5 1 1 0 0 0 2 0A1.5 1.5 0 1 1 12 8a1 1 0 0 0 0-2zM11 14h2v2h-2z"/></svg>
               Gemini Assistant
            </span>
            <span className="text-sm text-gray-500">Stuck? Ask AI for the best move.</span>
          </div>
          
          <button
            onClick={onAskAI}
            disabled={loading}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-md
              ${loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 hover:shadow-lg active:scale-95'
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </span>
            ) : 'Ask AI'}
          </button>
       </div>

       {suggestion && (
         <div className="w-full bg-blue-50 border-l-4 border-blue-500 p-4 rounded animate-slide">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-blue-800">Suggested Move: {suggestion.direction}</p>
                <p className="text-blue-600 text-sm mt-1">{suggestion.reasoning}</p>
              </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default GeminiControls;
