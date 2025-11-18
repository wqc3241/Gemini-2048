import React from 'react';

interface GameOverModalProps {
  won: boolean;
  onRetry: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ won, onRetry }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#faf8ef]/80 backdrop-blur-sm rounded-lg animate-fade-in">
      <h2 className="text-6xl font-bold text-[#776e65] mb-6">
        {won ? 'You Win!' : 'Game Over!'}
      </h2>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-[#8f7a66] text-white font-bold rounded text-xl hover:bg-[#7f6a56] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default GameOverModal;
