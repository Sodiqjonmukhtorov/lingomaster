
import React, { useState, useEffect, useCallback } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface SprintGameProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
}

const SprintGame: React.FC<SprintGameProps> = ({ words, onExit, lang }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const textDict = t[lang];

  const generatePair = useCallback(() => {
    const isCorrect = Math.random() > 0.5;
    const word = words[Math.floor(Math.random() * words.length)];
    let translation = word.uz;
    if (!isCorrect) {
      let randomWord;
      do { randomWord = words[Math.floor(Math.random() * words.length)]; } while (randomWord.id === word.id);
      translation = randomWord.uz;
    }
    return { word, translation, isCorrect };
  }, [words]);

  const [currentPair, setCurrentPair] = useState(() => generatePair());

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  const handleAnswer = (userSaidYes: boolean) => {
    if (isFinished) return;
    const correct = userSaidYes === currentPair.isCorrect;
    if (correct) {
      setScore(prev => prev + 10);
      setFeedback('CORRECT');
    } else {
      setFeedback('WRONG');
      setTimeLeft(prev => Math.max(0, prev - 3));
    }
    setTimeout(() => {
      setFeedback(null);
      setCurrentPair(generatePair());
    }, 200);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center p-12 bg-white rounded-[3rem] shadow-2xl max-w-md mx-auto text-center border-4 border-slate-50 animate-fadeIn">
        <h2 className="text-4xl font-black text-slate-800 mb-8 uppercase italic tracking-tighter">Vaqt tugadi</h2>
        <div className="text-6xl font-black text-blue-600 mb-10">{score}</div>
        <button onClick={onExit} className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all w-full">
          {textDict.backToMenu}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-10 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onExit} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-xs font-black transition uppercase tracking-widest flex items-center gap-2"
        >
          ✕ {textDict.exit}
        </button>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Time</span>
            <div className={`text-4xl font-black ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-blue-600'}`}>{timeLeft}s</div>
        </div>
      </div>

      {/* Card */}
      <div className={`bg-blue-600 p-12 rounded-[4rem] shadow-2xl border-4 transition-all duration-200 flex flex-col items-center text-center relative overflow-hidden ${
        feedback === 'CORRECT' ? 'border-emerald-400 scale-105' : 
        feedback === 'WRONG' ? 'border-rose-400 animate-shake' : 'border-blue-500'
      }`}>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10">
            <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft/60)*100}%` }}></div>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none italic">{currentPair.word.en}</h3>
        <div className="w-12 h-1 bg-white/20 rounded-full mb-6"></div>
        <h4 className="text-3xl md:text-4xl font-black text-blue-100 uppercase tracking-tight">{currentPair.translation}</h4>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-6 mt-12">
        <button 
          onClick={() => handleAnswer(false)}
          className="bg-rose-500 hover:bg-rose-600 text-white p-8 rounded-[3rem] shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
        >
          <span className="text-2xl font-black uppercase tracking-widest">{textDict.no}</span>
        </button>
        <button 
          onClick={() => handleAnswer(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-8 rounded-[3rem] shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
        >
          <span className="text-2xl font-black uppercase tracking-widest">{textDict.yes}</span>
        </button>
      </div>
    </div>
  );
};

export default SprintGame;
