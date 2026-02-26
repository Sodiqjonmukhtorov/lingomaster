
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
    VOCAB_DATA.forEach(unit => {
      unit.words.forEach(w => {
        wordToUnitMap[w.id] = unit.title;
      });
    });

    const pool = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = pool.slice(0, 20);
    const questions: ExamQuestion[] = [];
    
    selectedWords.forEach((w, i) => {
      const isEnToUz = i < 10;
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
      <div className="w-full max-w-4xl mx-auto py-8 animate-fadeIn">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border-4 border-indigo-100 flex flex-col items-center">
          <div className="text-7xl mb-4">
            {scorePercentage >= 90 ? '🦁' : scorePercentage >= 70 ? '🦅' : scorePercentage >= 50 ? '🦊' : '🐢'}
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase tracking-tighter">{textDict.megaExamResults}</h2>
          
          <div className="flex items-baseline gap-2 mb-10">
            <span className="text-8xl font-black text-indigo-600">{scorePercentage}</span>
            <span className="text-2xl font-black text-indigo-300">%</span>
          </div>

          <div className="w-full space-y-6">
            <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
               <h3 className="text-xl font-bold text-slate-700">{lang === 'uz' ? 'Xatolar Tahlili' : 'Mistakes Analysis'}</h3>
               <span className="text-slate-400 font-bold">{correctCount} / {answers.length} {lang === 'uz' ? 'To\'g\'ri' : 'Correct'}</span>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {answers.map((ans, i) => (
                <div key={i} className={`p-6 rounded-3xl border-2 relative overflow-hidden transition-all ${ans.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                  {/* Unit Badge */}
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">
                    {ans.unitTitle}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[80%]">
                        <div className="font-black text-slate-800 text-xl">{ans.question}</div>
                    </div>
                    <div className={`mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ans.isCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                      {ans.isCorrect ? textDict.correct : textDict.wrong}
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <p className="text-slate-500 font-medium">
                        {lang === 'uz' ? 'Sizning javobingiz' : 'Your answer'}: 
                        <span className={`ml-2 font-black ${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-10">
            {mistakes.length > 0 && (
                <button 
                    onClick={() => setIsCorrectingMistakes(true)}
                    className="md:col-span-2 bg-indigo-600 text-white px-8 py-5 rounded-3xl font-black text-xl hover:bg-black transition-all shadow-xl shadow-indigo-100 mb-2"
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
              className="bg-indigo-100 text-indigo-700 px-8 py-5 rounded-3xl font-black text-lg hover:bg-indigo-200 transition-all"
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
              className="bg-slate-900 text-white px-8 py-5 rounded-3xl font-black text-lg hover:bg-black transition-all shadow-lg"
            >
              NEXT EXAM ➔
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
          <div className="text-indigo-600 font-black tracking-widest text-xs uppercase">MEGA EXAM (20 Qs)</div>
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
        {lang === 'uz' ? 'Barcha 12 bo\'limdan tasodifiy savollar' : 'Random questions from all 12 units'}
      </p>
    </div>
  );
};

export default GlobalExam;
