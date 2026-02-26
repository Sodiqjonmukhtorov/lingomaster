import React, { useState, useEffect, useMemo } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface ScrambleGameProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
}

const ScrambleGame: React.FC<ScrambleGameProps> = ({ words, onExit, lang }) => {
  const [index, setIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userGuess, setUserGuess] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const textDict = t[lang];
  
  const shuffledWords = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const currentWord = shuffledWords[index];
  
  const targetEn = currentWord.en.toLowerCase().replace(/[^a-z]/g, ''); // Simplified for scramble

  useEffect(() => {
    if (!currentWord) return;
    const letters = targetEn.split('');
    setScrambledLetters([...letters].sort(() => Math.random() - 0.5));
    setUserGuess([]);
    setIsCorrect(null);
  }, [index, currentWord, targetEn]);

  const handleLetterClick = (letter: string, i: number) => {
    if (isCorrect !== null) return;
    setUserGuess([...userGuess, letter]);
    const newScrambled = [...scrambledLetters];
    newScrambled.splice(i, 1);
    setScrambledLetters(newScrambled);
  };

  const handleUndo = (letter: string, i: number) => {
    if (isCorrect !== null) return;
    const newUserGuess = [...userGuess];
    newUserGuess.splice(i, 1);
    setUserGuess(newUserGuess);
    setScrambledLetters([...scrambledLetters, letter].sort());
  };

  useEffect(() => {
    if (userGuess.length === targetEn.length && targetEn.length > 0) {
      if (userGuess.join('') === targetEn) {
        setIsCorrect(true);
        setTimeout(() => {
          if (index < words.length - 1) {
            setIndex(prev => prev + 1);
          } else {
            // Finished all
            onExit();
          }
        }, 1200);
      } else {
        setIsCorrect(false);
        setTimeout(() => {
          setIsCorrect(null);
          // Return letters to scrambled
          setScrambledLetters(targetEn.split('').sort(() => Math.random() - 0.5));
          setUserGuess([]);
        }, 1000);
      }
    }
  }, [userGuess, targetEn, index, words.length, onExit]);

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="flex justify-between items-center mb-8 px-4">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 font-medium">✕ {textDict.exit}</button>
        <div className="text-violet-600 font-black tracking-widest text-xs uppercase">{lang === 'uz' ? 'SO\'Z TERISH' : 'WORD BUILDER'}</div>
        <div className="font-bold text-slate-400">{index + 1} / {words.length}</div>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center mb-8">
        <span className="text-slate-400 text-xs font-black uppercase mb-4 tracking-widest">{textDict.targetMeaning}</span>
        <h2 className="text-4xl font-black text-slate-800 mb-4 text-center">{currentWord.uz}</h2>
        
        {currentWord.imageUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 mb-8">
            <img src={currentWord.imageUrl} alt="hint" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Answer area */}
        <div className="flex flex-wrap justify-center gap-2 min-h-[60px] w-full border-b-2 border-dashed border-slate-100 pb-4 mb-8">
          {userGuess.map((char, i) => (
            <button
              key={i}
              onClick={() => handleUndo(char, i)}
              className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-black transition-all shadow-sm
                ${isCorrect === true ? 'bg-emerald-500 text-white scale-110' : 
                  isCorrect === false ? 'bg-rose-500 text-white animate-shake' : 
                  'bg-indigo-600 text-white hover:bg-indigo-500'}
              `}
            >
              {char.toUpperCase()}
            </button>
          ))}
          {Array.from({ length: targetEn.length - userGuess.length }).map((_, i) => (
            <div key={i} className="w-12 h-14 rounded-xl border-2 border-slate-100 bg-slate-50"></div>
          ))}
        </div>

        {/* Letters pool */}
        <div className="flex flex-wrap justify-center gap-3">
          {scrambledLetters.map((char, i) => (
            <button
              key={i}
              onClick={() => handleLetterClick(char, i)}
              className="w-12 h-14 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700 hover:border-violet-400 hover:text-violet-600 hover:-translate-y-1 transition-all active:scale-90 shadow-sm"
            >
              {char.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrambleGame;