
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';
import ErrorCorrection from './ErrorCorrection';

interface ExamProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
}

interface ExamQuestion {
  id: string;
  word: Word;
  question: string;
  correct: string;
  direction: 'EN_UZ' | 'UZ_EN';
}

interface UserAnswer {
  word: Word;
  question: string;
  correct: string;
  user: string;
  isCorrect: boolean;
}

const Exam: React.FC<ExamProps> = ({ words, onExit, lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isCorrectingMistakes, setIsCorrectingMistakes] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textDict = t[lang];

  const examQuestions = useMemo(() => {
    const pool = [...words].sort(() => Math.random() - 0.5);
    const questions: ExamQuestion[] = [];
    const size = Math.min(10, pool.length);
    for (let i = 0; i < size; i++) {
      questions.push({ id: pool[i].id, word: pool[i], question: pool[i].en, correct: pool[i].uz, direction: 'EN_UZ' });
    }
    const pool2 = [...words].sort(() => Math.random() - 0.5).slice(0, size);
    for (let i = 0; i < size; i++) {
      questions.push({ id: pool2[i].id, word: pool2[i], question: pool2[i].uz, correct: pool2[i].en, direction: 'UZ_EN' });
    }
    return questions;
  }, [words]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIdx, isFinished]);

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
    setAnswers([...answers, { word: current.word, question: current.question, correct: current.correct, user: input.trim(), isCorrect }]);
    setInput('');
    if (currentIdx < examQuestions.length - 1) setCurrentIdx(currentIdx + 1);
    else setIsFinished(true);
  };

  const mistakes = answers.filter(a => !a.isCorrect).map(a => a.word);
  if (isCorrectingMistakes) return <ErrorCorrection mistakes={mistakes} lang={lang} onExit={onExit} />;

  if (isFinished) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-[2.5rem] shadow-2xl text-center border-4 border-slate-50 animate-fadeIn">
        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Imtihon Natijasi</h2>
        <div className="text-6xl font-black text-rose-600 mb-4">{correctCount} / {answers.length}</div>
        
        {/* Mistakes List */}
        <div className="mb-6 text-left max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-lg font-black text-slate-700 mb-2 uppercase tracking-tight border-b-2 border-slate-100 pb-1">
            {lang === 'uz' ? 'Xatolar Tahlili' : 'Mistakes Analysis'}
          </h3>
          <div className="space-y-2">
            {answers.map((ans, i) => (
              <div key={i} className={`p-3 rounded-xl border-2 ${ans.isCorrect ? 'bg-emerald-50 border-emerald-50' : 'bg-rose-50 border-rose-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-slate-800 text-sm">{ans.question}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${ans.isCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                    {ans.isCorrect ? textDict.correct : textDict.wrong}
                  </span>
                </div>
                {!ans.isCorrect && (
                  <div className="text-[11px] leading-tight">
                    <p className="text-slate-500 font-medium">
                      {lang === 'uz' ? 'Sizning javobingiz' : 'Your answer'}: <span className="text-rose-600 font-bold">{ans.user || '---'}</span>
                    </p>
                    <p className="text-emerald-700 font-bold italic">
                      {lang === 'uz' ? 'To\'g\'ri javob' : 'Correct answer'}: {ans.correct}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mistakes.length > 0 && (
            <button onClick={() => setIsCorrectingMistakes(true)} className="col-span-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">🚀 {textDict.correctMistakes}</button>
          )}
          <button onClick={onExit} className="col-span-2 bg-slate-950 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">{textDict.backToMenu}</button>
        </div>
      </div>
    );
  }

  const current = examQuestions[currentIdx];
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
        <div className="font-black text-rose-500 text-xs uppercase tracking-widest">{textDict.officialExam}</div>
        <div className="font-black text-slate-400 text-xs">{currentIdx + 1} / {examQuestions.length}</div>
      </div>

      {/* Card */}
      <div className="bg-rose-600 p-10 md:p-16 rounded-[3.5rem] shadow-2xl border-4 border-rose-500 flex flex-col items-center">
        <span className="text-rose-100 text-[10px] font-black uppercase mb-6 tracking-[0.3em] opacity-80">Imtihon</span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center uppercase tracking-tight italic leading-tight">{current.question}</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <input 
            ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="..."
            className="w-full p-6 rounded-[2rem] border-4 border-rose-400 bg-rose-700 text-white text-2xl md:text-3xl font-black text-center outline-none shadow-inner placeholder-rose-300"
          />
          <button type="submit" className="mt-8 w-full bg-white text-rose-600 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95">Tasdiqlash ➔</button>
        </form>
      </div>
    </div>
  );
};

export default Exam;
