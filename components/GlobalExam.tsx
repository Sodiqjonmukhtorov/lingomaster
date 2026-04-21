
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Word, Language, Unit } from '../types';
import { VOCAB_DATA } from '../data';
import { t } from '../translations';
import ErrorCorrection from './ErrorCorrection';

interface GlobalExamProps {
  words: Word[]; // All words combined
  onExit: () => void;
  lang: Language;
}

interface ExamQuestion {
  id: string;
  word: Word;
  question: string;
  correct: string;
  direction: 'EN_UZ' | 'UZ_EN';
  unitTitle: string; // Added to track which unit it belongs to
}

interface UserAnswer {
  word: Word;
  question: string;
  correct: string;
  user: string;
  isCorrect: boolean;
  unitTitle: string; // Store unit title for analysis
}

const GlobalExam: React.FC<GlobalExamProps> = ({ words, onExit, lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [isCorrectingMistakes, setIsCorrectingMistakes] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textDict = t[lang];

  const generateQuestions = useCallback(() => {
    // Create a flattened map of wordId to unitTitle for easy lookup
    const wordToUnitMap: Record<string, string> = {};
    const unitToWordsMap: Record<string, Word[]> = {};
    
    VOCAB_DATA.forEach(unit => {
      unitToWordsMap[unit.title] = unit.words;
      unit.words.forEach(w => {
        wordToUnitMap[w.id] = unit.title;
      });
    });

    // Identify which units are in the current words pool
    const unitsInPool = Array.from(new Set(words.map(w => wordToUnitMap[w.id])));
    
    // We want at least one word from each unit if possible
    const selectedWords: Word[] = [];
    const targetCount = unitsInPool.length > 20 ? Math.min(words.length, 30) : 20;

    // First, pick one word from each unit
    unitsInPool.forEach(uTitle => {
      const unitWordsInPool = words.filter(w => wordToUnitMap[w.id] === uTitle);
      if (unitWordsInPool.length > 0) {
        const randomWord = unitWordsInPool[Math.floor(Math.random() * unitWordsInPool.length)];
        selectedWords.push(randomWord);
      }
    });

    // If we need more words to reach targetCount, fill with random ones
    const remainingWords = words.filter(w => !selectedWords.some(sw => sw.id === w.id));
    const shuffledRemaining = remainingWords.sort(() => Math.random() - 0.5);
    
    while (selectedWords.length < targetCount && shuffledRemaining.length > 0) {
      selectedWords.push(shuffledRemaining.pop()!);
    }

    // Final shuffle of selected words
    selectedWords.sort(() => Math.random() - 0.5);

    const questions: ExamQuestion[] = [];
    selectedWords.forEach((w, i) => {
      const isEnToUz = i % 2 === 0; // Alternating directions for better variety
      questions.push({
        id: w.id,
        word: w,
        question: isEnToUz ? w.en : w.uz,
        correct: isEnToUz ? w.uz : w.en,
        direction: isEnToUz ? 'EN_UZ' : 'UZ_EN',
        unitTitle: wordToUnitMap[w.id] || 'General'
      });
    });
    
    setExamQuestions(questions);
  }, [words]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  useEffect(() => {
    if (!isFinished && !isCorrectingMistakes) {
      inputRef.current?.focus();
    }
  }, [currentIdx, isFinished, isCorrectingMistakes]);

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
    if (!input.trim()) return;

    const current = examQuestions[currentIdx];
    const isCorrect = validateAnswer(input, current.correct);

    const newAnswer: UserAnswer = {
      word: current.word,
      question: current.question,
      correct: current.correct,
      user: input.trim(),
      isCorrect,
      unitTitle: current.unitTitle
    };

    setAnswers([...answers, newAnswer]);
    setInput('');

    if (currentIdx < examQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const mistakes = answers.filter(a => !a.isCorrect).map(a => a.word);

  if (isCorrectingMistakes) {
    return <ErrorCorrection mistakes={mistakes} lang={lang} onExit={onExit} />;
  }

  if (isFinished) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const scorePercentage = Math.round((correctCount / answers.length) * 100);

    return (
      <div className="w-full max-w-4xl mx-auto py-2 md:py-4 animate-fadeIn">
        <div className="bg-white rounded-[32px] shadow-2xl p-5 md:p-8 border-4 border-indigo-100 flex flex-col items-center">
          <div className="text-5xl mb-2">
            {scorePercentage >= 90 ? '🦁' : scorePercentage >= 70 ? '🦅' : scorePercentage >= 50 ? '🦊' : '🐢'}
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-1 uppercase tracking-tighter">{textDict.megaExamResults}</h2>
          
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-full w-40 h-40 border-4 border-indigo-100 mb-4 shadow-inner">
            <span className="text-5xl font-black text-indigo-600 leading-none">{scorePercentage}</span>
            <span className="text-lg font-black text-indigo-300 uppercase tracking-widest mt-1">%</span>
          </div>

          <div className="w-full space-y-4">
            <div className="flex justify-between items-end border-b-2 border-slate-100 pb-1">
               <h3 className="text-lg font-bold text-slate-700">{lang === 'uz' ? 'Xatolar Tahlili' : 'Mistakes Analysis'}</h3>
               <span className="text-slate-400 text-xs font-bold">{correctCount} / {answers.length} {lang === 'uz' ? 'To\'g\'ri' : 'Correct'}</span>
            </div>
            
            <div className="max-h-[300px] md:max-h-[350px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {answers.map((ans, i) => (
                <div key={i} className={`p-3 rounded-2xl border-2 relative overflow-hidden transition-all ${ans.isCorrect ? 'bg-emerald-50 border-emerald-50' : 'bg-rose-50 border-rose-50'}`}>
                  {/* Unit Badge */}
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-600/80 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl backdrop-blur-sm">
                    {ans.unitTitle}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div className="max-w-[80%]">
                        <div className="font-black text-slate-800 text-base leading-tight">{ans.question}</div>
                    </div>
                    <div className={`mt-0.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${ans.isCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                      {ans.isCorrect ? textDict.correct : textDict.wrong}
                    </div>
                  </div>

                  <div className="text-[11px] space-y-0.5 leading-tight">
                    <p className="text-slate-500 font-medium">
                        {lang === 'uz' ? 'Sizning javobingiz' : 'Your answer'}: 
                        <span className={`ml-1 font-black ${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {ans.user || '---'}
                        </span>
                    </p>
                    {!ans.isCorrect && (
                      <p className="text-emerald-700 font-black italic">
                        {lang === 'uz' ? 'To\'g\'ri javob' : 'Correct answer'}: {ans.correct}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            {mistakes.length > 0 && (
                <button 
                    onClick={() => setIsCorrectingMistakes(true)}
                    className="col-span-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg active:scale-95"
                >
                    🚀 {textDict.correctMistakes}
                </button>
            )}
            <button 
              onClick={() => {
                generateQuestions();
                setCurrentIdx(0);
                setAnswers([]);
                setInput('');
                setIsFinished(false);
              }}
              className="bg-indigo-50 text-indigo-700 px-6 py-4 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              🔄 {textDict.retry}
            </button>
            <button 
              onClick={() => {
                generateQuestions();
                setCurrentIdx(0);
                setAnswers([]);
                setInput('');
                setIsFinished(false);
              }}
              className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
            >
              NEXT EXAM ➔
            </button>
            <button 
              onClick={onExit}
              className="col-span-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-600 transition-colors py-2"
            >
              {textDict.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = examQuestions[currentIdx];
  if (!current) return <div className="p-20 text-center font-black text-indigo-600 animate-pulse text-2xl">{lang === 'uz' ? 'Tayyorlanmoqda...' : 'Preparing...'}</div>;

  return (
    <div className="w-full max-w-2xl mx-auto py-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-10 px-4">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-800 transition font-black">✕ {textDict.exit}</button>
        <div className="flex flex-col items-center">
          <div className="text-indigo-600 font-black tracking-widest text-xs uppercase">EXAM ({examQuestions.length} Qs)</div>
          <div className="bg-slate-200 h-2 w-48 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${((currentIdx) / examQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="font-black text-slate-400 text-lg">{currentIdx + 1} / {examQuestions.length}</div>
      </div>

      <div className="bg-white p-12 rounded-[50px] shadow-2xl border-b-8 border-indigo-100 flex flex-col items-center relative overflow-hidden">
        {/* Dynamic Unit Indicator during Exam */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{current.unitTitle}</span>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
        
        <span className="text-indigo-400 text-xs font-black uppercase mb-6 tracking-[0.3em] mt-4">
          {current.direction === 'EN_UZ' ? (lang === 'uz' ? 'O\'zbekchasini yozing' : 'Write in Uzbek') : (lang === 'uz' ? 'Inglizchasini yozing' : 'Write in English')}
        </span>
        
        <h2 className="text-5xl font-black text-slate-800 mb-12 text-center leading-tight">{current.question}</h2>
        
        <form onSubmit={handleSubmit} className="w-full">
          <input 
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === 'uz' ? "Shu yerga yozing..." : "Type here..."}
            className="w-full p-6 rounded-3xl border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-indigo-400 text-2xl font-black text-center transition-all outline-none shadow-inner"
          />
          <button 
            type="submit"
            className="mt-8 w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95"
          >
            {currentIdx === examQuestions.length - 1 ? (lang === 'uz' ? 'Tugatish 🏁' : 'Finish 🏁') : `${textDict.submit} ➔`}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        {lang === 'uz' ? 'Tanlangan bo\'limlardan tasodifiy savollar' : 'Random questions from selected units'}
      </p>
    </div>
  );
};

export default GlobalExam;
