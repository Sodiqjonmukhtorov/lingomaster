
import React, { useState, useEffect, useRef } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface FlashcardsProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
}

const Flashcards: React.FC<FlashcardsProps> = ({ words, onExit, lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<'EN_UZ' | 'UZ_EN'>('EN_UZ');
  const [userInput, setUserInput] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textDict = t[lang];

  const currentWord = words[currentIndex];

  useEffect(() => {
    setUserInput('');
    setIsCorrect(null);
    setShowCheck(false);
  }, [currentIndex]);

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  const speak = (text: string, l: 'en' | 'uz') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = l === 'en' ? 'en-US' : 'uz-UZ';
    window.speechSynthesis.speak(utterance);
  };

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

  const checkWriting = (e: React.FormEvent) => {
    e.preventDefault();
    const target = direction === 'EN_UZ' ? currentWord.en : currentWord.uz;
    const isRight = validateAnswer(userInput, target);
    setIsCorrect(isRight);
    setShowCheck(true);
    if (isRight) {
      speak(target, direction === 'EN_UZ' ? 'en' : 'uz');
    }
  };

  const frontText = direction === 'EN_UZ' ? currentWord.en : currentWord.uz;
  const backText = direction === 'EN_UZ' ? currentWord.uz : currentWord.en;
  const frontLang = direction === 'EN_UZ' ? 'English' : 'O\'zbekcha';
  const backLang = direction === 'EN_UZ' ? 'O\'zbekcha' : 'English';

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-6 md:py-10 animate-fadeIn">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-6 md:mb-10">
        <button 
          onClick={onExit} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs md:text-sm font-black transition uppercase tracking-widest flex items-center gap-2"
        >
          ✕ {textDict.exit}
        </button>
        <button 
          onClick={() => setDirection(d => d === 'EN_UZ' ? 'UZ_EN' : 'EN_UZ')}
          className="bg-blue-100 px-4 py-2 rounded-full text-[10px] md:text-xs font-black text-blue-600 hover:bg-blue-600 hover:text-white transition uppercase tracking-widest"
        >
          🔄 {direction === 'EN_UZ' ? 'EN → UZ' : 'UZ → EN'}
        </button>
        <div className="text-slate-400 font-black text-sm">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      {/* Card Container */}
      <div 
        className={`card-flip w-full h-[450px] sm:h-[550px] cursor-pointer ${flipped ? 'card-flipped' : ''}`}
      >
        <div className="card-inner w-full h-full">
          {/* FRONT */}
          <div 
            className="card-front flex flex-col items-center justify-between bg-blue-600 rounded-[3rem] shadow-2xl border-4 border-blue-500 p-6 md:p-8 text-center"
            onClick={() => setFlipped(true)}
          >
            <div className="w-full">
              <span className="text-blue-200 text-[10px] font-black mb-4 uppercase tracking-[0.3em] opacity-80 block">{frontLang}</span>
              
              {/* Image Section */}
              <div className="w-full h-32 sm:h-48 bg-blue-700/50 rounded-2xl mb-6 overflow-hidden border-2 border-blue-400/30 flex items-center justify-center relative group">
                <img 
                  src={currentWord.imageUrl || `https://picsum.photos/seed/${currentWord.en}/400/300`} 
                  alt={currentWord.en}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight">{frontText}</h2>
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(frontText, direction === 'EN_UZ' ? 'en' : 'uz'); }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
                >
                  🔊
                </button>
              </div>
            </div>

            {/* Writing Practice */}
            <div className="w-full mt-4" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={checkWriting} className="relative">
                <input 
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={lang === 'uz' ? "So'zni yozing..." : "Type the word..."}
                  className={`w-full bg-blue-700/50 border-2 rounded-2xl px-6 py-3 text-white font-bold placeholder-blue-300/50 focus:outline-none transition-all ${isCorrect === true ? 'border-emerald-400' : isCorrect === false ? 'border-rose-400 animate-shake' : 'border-blue-400/50'}`}
                />
                {showCheck && (
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 font-black ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? '✓' : '✕'}
                  </div>
                )}
              </form>
            </div>

            <p className="mt-6 text-blue-100/50 text-[10px] font-bold uppercase tracking-widest animate-pulse">{lang === 'uz' ? "Tarjimani ko'rish uchun bosing" : "Tap to flip"}</p>
          </div>

          {/* BACK */}
          <div 
            className="card-back flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border-4 border-slate-50 p-8 text-center"
            onClick={() => setFlipped(false)}
          >
            <span className="text-slate-400 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">{backLang}</span>
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-2xl sm:text-4xl font-black text-blue-600 leading-tight uppercase tracking-tight">{backText}</h2>
              <button 
                onClick={(e) => { e.stopPropagation(); speak(backText, direction === 'EN_UZ' ? 'uz' : 'en'); }}
                className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center text-blue-600 transition-all active:scale-90"
              >
                🔊
              </button>
            </div>
            <div className="mt-8 w-16 h-1.5 bg-blue-100 rounded-full"></div>
            <p className="mt-12 text-slate-300 text-[10px] font-bold uppercase tracking-widest">{lang === 'uz' ? "Oldiga qaytish uchun bosing" : "Tap to flip back"}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-10 w-full">
        <button 
          onClick={handlePrev}
          className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
        >
          ← {textDict.prev}
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          {textDict.next} →
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
