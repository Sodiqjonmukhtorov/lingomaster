import React, { useState, useEffect, useRef } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface ErrorCorrectionProps {
  mistakes: Word[];
  onExit: () => void;
  lang: Language;
}

const ErrorCorrection: React.FC<ErrorCorrectionProps> = ({ mistakes, onExit, lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'EN' | 'UZ'>('EN');
  const [count, setCount] = useState(0); // 0 to 2 (correct entries)
  const [wrongAttempts, setWrongAttempts] = useState(0); // 0 to 3 (fails)
  const [input, setInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isWrongAnimation, setIsWrongAnimation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textDict = t[lang];

  const currentWord = mistakes[currentIdx];
  const targetText = phase === 'EN' ? currentWord.en : currentWord.uz;
  const questionText = phase === 'EN' ? currentWord.uz : currentWord.en;

  useEffect(() => {
    // Only focus if not on a mobile device to prevent keyboard jumping
    if (!('ontouchstart' in window)) {
        inputRef.current?.focus();
    }
  }, [currentIdx, phase, count, showConfirm, wrongAttempts]);

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    if (validateAnswer(input, targetText)) {
      setIsWrongAnimation(false);
      setWrongAttempts(0); 
      const nextCount = count + 1;
      if (nextCount < 3) {
        setCount(nextCount);
      } else {
        if (phase === 'EN') {
          setPhase('UZ');
          setCount(0);
          setWrongAttempts(0);
        } else {
          if (currentIdx < mistakes.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setPhase('EN');
            setCount(0);
            setWrongAttempts(0);
          } else {
            setShowConfirm(true);
          }
        }
      }
      setInput('');
    } else {
      setIsWrongAnimation(true);
      setWrongAttempts(prev => prev + 1);
      setTimeout(() => setIsWrongAnimation(false), 500);
      setInput('');
    }
  };

  const handleSkip = () => {
    setWrongAttempts(3); // Show hint immediately
    setInput('');
  };

  if (showConfirm) {
    return (
      <div className="w-full max-w-md mx-auto p-10 bg-white rounded-[40px] shadow-2xl border-4 border-indigo-100 flex flex-col items-center animate-fadeIn">
        <div className="text-6xl mb-6">🤔</div>
        <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">{textDict.remembered}</h2>
        <div className="grid grid-cols-1 gap-4 w-full">
          <button 
            onClick={onExit}
            className="bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
          >
            {textDict.yes} ✅
          </button>
          <button 
            onClick={() => {
              setCurrentIdx(0);
              setPhase('EN');
              setCount(0);
              setWrongAttempts(0);
              setShowConfirm(false);
            }}
            className="bg-rose-100 text-rose-600 py-4 rounded-2xl font-black hover:bg-rose-200 transition"
          >
            {textDict.no} ❌
          </button>
        </div>
      </div>
    );
  }

  const isHintVisible = wrongAttempts >= 3;

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 animate-fadeIn pb-24">
      <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border-b-8 border-indigo-100 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
            <span className="text-indigo-600 font-black text-[10px] md:text-xs uppercase tracking-widest">{textDict.learningProgress}</span>
            <span className="text-slate-400 font-bold text-sm">{currentIdx + 1} / {mistakes.length}</span>
        </div>

        <div className="text-center mb-6 w-full">
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase mb-3 tracking-widest">
                {phase === 'EN' ? textDict.writeEn3 : textDict.writeUz3}
            </p>
            
            <div className="bg-slate-50 p-4 md:p-6 rounded-3xl mb-4 border-2 border-slate-100">
                <p className="text-slate-400 text-[10px] mb-1 font-bold uppercase">{lang === 'uz' ? 'Savol' : 'Question'}</p>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">{questionText}</h3>
            </div>

            <div className="min-h-[80px] flex items-center justify-center">
                {isHintVisible ? (
                    <div className="animate-bounceIn text-center">
                        <p className="text-rose-500 text-[10px] font-black mb-1 uppercase tracking-widest">{lang === 'uz' ? 'MASLAHAT' : 'HINT'}</p>
                        <h2 className="text-2xl md:text-4xl font-black text-indigo-600 leading-tight">{targetText}</h2>
                    </div>
                ) : (
                    <div className="flex flex-col items-center opacity-40">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-200 tracking-[0.5em]">????</h2>
                        <p className="text-[10px] text-slate-400 font-bold mt-2">
                            {lang === 'uz' ? `${3 - wrongAttempts} ta imkoniyat qoldi` : `${3 - wrongAttempts} attempts left`}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-2 justify-center mt-6">
                {[0, 1, 2].map(i => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < count ? 'bg-indigo-600 scale-125' : 'bg-slate-200'}`}></div>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input 
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                placeholder={isHintVisible ? (lang === 'uz' ? "Endi to'g'risini yozing..." : "Type correctly...") : (lang === 'uz' ? "Yodingizdagini yozing..." : "Type from memory...")}
                className={`w-full p-5 md:p-6 rounded-3xl border-4 text-xl md:text-2xl font-black text-center transition-all outline-none 
                    ${isWrongAnimation ? 'border-rose-500 bg-rose-50 animate-shake' : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-indigo-400'}
                `}
            />
            
            <div className="flex flex-col gap-2">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  {textDict.submit} ➔
                </button>
                
                {!isHintVisible && (
                  <button 
                    type="button"
                    onClick={handleSkip}
                    className="w-full py-2 text-slate-400 font-bold text-xs hover:text-rose-500 transition-colors"
                  >
                    {lang === 'uz' ? "Bilmayman, ko'rsat!" : "I don't know, show me!"}
                  </button>
                )}
            </div>
        </form>
      </div>
      
      <p className="mt-4 text-center text-slate-400 text-[10px] md:text-xs">
        {count === 0 ? (lang === 'uz' ? '1-chi urinish' : '1st try') : count === 1 ? (lang === 'uz' ? 'Yaxshi, davom eting' : 'Good, keep going') : (lang === 'uz' ? 'Deyarli tugadi!' : 'Almost there!')}
      </p>
    </div>
  );
};

export default ErrorCorrection;