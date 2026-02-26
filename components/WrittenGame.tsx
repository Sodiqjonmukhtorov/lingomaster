
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface WrittenGameProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
  fixedDirection?: 'EN_UZ' | 'UZ_EN';
}

interface UserAnswer {
  question: string;
  correct: string;
  user: string;
  isCorrect: boolean;
}

const WrittenGame: React.FC<WrittenGameProps> = ({ words, onExit, lang, fixedDirection }) => {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const textDict = t[lang];
  
  const shuffledWords = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const currentWord = shuffledWords[index];
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentDirection, setCurrentDirection] = useState<'EN_UZ' | 'UZ_EN'>(
    fixedDirection || (Math.random() > 0.5 ? 'EN_UZ' : 'UZ_EN')
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, isFinished]);

  const target = currentDirection === 'EN_UZ' ? currentWord?.uz : currentWord?.en;
  const question = currentDirection === 'EN_UZ' ? currentWord?.en : currentWord?.uz;

  const validateAnswer = (userInput: string, target: string) => {
    const clean = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[‘’`´]/g, "'");
    const user = clean(userInput);
    if (!user) return false;

    const getPossibleStrings = (text: string) => {
      const variants = new Set<string>();
      const base = clean(text);
      if (!base) return variants;
      variants.add(base);
      variants.add(clean(text.replace(/[()]/g, '')));
      variants.add(clean(text.replace(/\([^)]*\)/g, '')));
      return variants;
    };

    const allPossible = new Set<string>();
    getPossibleStrings(target).forEach(v => { if (v) allPossible.add(v); });
    const parts = target.split(/[\/\\,]/);
    if (parts.length > 1) {
      parts.forEach(p => {
        getPossibleStrings(p).forEach(v => { if (v) allPossible.add(v); });
      });
    }
    allPossible.add(clean(target.replace(/[\/\\,]/g, '')));
    return allPossible.has(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCorrect !== null || !input.trim()) return;

    const success = validateAnswer(input, target);
    setIsCorrect(success);
    
    setAnswers([...answers, {
      question: question,
      correct: target,
      user: input.trim(),
      isCorrect: success
    }]);

    if (success) {
      setTimeout(() => {
        handleNext();
      }, 800);
    }
  };

  const handleNext = () => {
    if (index < shuffledWords.length - 1) {
      setIndex((prev) => prev + 1);
      setInput('');
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-10 bg-white rounded-[3rem] shadow-2xl text-center animate-fadeIn border-4 border-slate-50">
        <h2 className="text-3xl font-black text-slate-800 mb-8 uppercase italic tracking-tighter">Yakunlandi</h2>
        <div className="text-7xl font-black text-blue-600 mb-10">{answers.filter(a => a.isCorrect).length} / {answers.length}</div>
        <button 
          onClick={onExit}
          className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all w-full"
        >
          {textDict.backToMenu}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-10 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10 gap-4">
        <button 
          onClick={onExit} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-xs font-black transition uppercase tracking-widest flex items-center gap-2"
        >
          ✕ {textDict.exit}
        </button>
        <div className="font-black text-slate-400 text-xs">{index + 1} / {words.length}</div>
      </div>

      {/* Card */}
      <div className="bg-blue-600 p-10 md:p-16 rounded-[3.5rem] shadow-2xl border-4 border-blue-500 flex flex-col items-center mb-8 relative overflow-hidden">
        <span className="text-blue-200 text-[10px] font-black uppercase mb-6 tracking-[0.3em]">
          {currentDirection === 'EN_UZ' ? 'Inglizcha → O\'zbekcha' : 'O\'zbekcha → Inglizcha'}
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center uppercase tracking-tight italic">{question}</h2>
        
        <form onSubmit={handleSubmit} className="w-full">
          <input 
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isCorrect === true}
            placeholder="..."
            className={`w-full p-5 rounded-[2rem] border-4 text-xl md:text-3xl font-black text-center transition-all outline-none shadow-inner
              ${isCorrect === null ? 'border-blue-400 bg-blue-700 text-white placeholder-blue-300' : ''}
              ${isCorrect === true ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''}
              ${isCorrect === false ? 'border-rose-500 bg-rose-50 text-rose-700 animate-shake' : ''}
            `}
          />
          {isCorrect === false && (
            <div className="mt-8 text-center bg-white/10 p-6 rounded-3xl border border-white/20">
              <p className="text-blue-100 text-sm font-bold mb-1 uppercase tracking-widest">Javob:</p>
              <p className="text-white text-3xl font-black uppercase">{target}</p>
              <button 
                type="button" 
                onClick={handleNext}
                className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all"
              >
                Keyingisi ➔
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default WrittenGame;
