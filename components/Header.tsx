import React from 'react';

interface HeaderProps {
  score: number;
  bestScore: number;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ score, bestScore, onReset }) => {
  return (
    <div className="flex flex-col w-full max-w-[500px] mb-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-6xl font-bold text-[#776e65]">2048</h1>
        <div className="flex space-x-2">
          <div className="bg-[#bbada0] rounded px-6 py-2 flex flex-col items-center min-w-[100px]">
            <span className="text-[#eee4da] text-xs font-bold uppercase tracking-wider">Score</span>
            <span className="text-white text-2xl font-bold">{score}</span>
          </div>
          <div className="bg-[#bbada0] rounded px-6 py-2 flex flex-col items-center min-w-[100px]">
            <span className="text-[#eee4da] text-xs font-bold uppercase tracking-wider">Best</span>
            <span className="text-white text-2xl font-bold">{bestScore}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-[#776e65] text-lg">Join the numbers and get to the <strong>2048 tile!</strong></p>
        <button
          onClick={onReset}
          className="bg-[#8f7a66] text-white font-bold py-2 px-6 rounded hover:bg-[#7f6a56] transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Header;
