import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IRREGULAR_VERBS } from '../data';
import { Language, IrregularVerb } from '../types';

interface IrregularTrainerProps {
  lang: Language;
  onExit: () => void;
}

type Step = 'START' | 'QUIZ' | 'SEQUENCE' | 'RESULT';

const IrregularTrainer: React.FC<IrregularTrainerProps> = ({ lang, onExit }) => {
  const [step, setStep] = useState<Step>('START');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<IrregularVerb | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<'V2' | 'V3' | 'UZ'>('V2');
  
  // Sequence Mode State
  const [sequenceStep, setSequenceStep] = useState<0 | 1 | 2>(0); // 0: V1, 1: V2, 2: V3
  const [sequenceValid, setSequenceValid] = useState<boolean | null>(null);

  const startQuiz = (mode: 'QUIZ' | 'SEQUENCE') => {
    setScore(0);
    setCurrentIndex(0);
    if (mode === 'QUIZ') {
      generateQuestion(0);
    } else {
      generateSequence(0);
    }
    setStep(mode);
  };

  const generateQuestion = (index: number) => {
    const verb = IRREGULAR_VERBS[index];
    setSelectedVerb(verb);
    setIsAnswered(false);
    setSelectedOption(null);

    const types: ('V2' | 'V3' | 'UZ')[] = ['V2', 'V3', 'UZ'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setQuizType(randomType);

    let correct = '';
    if (randomType === 'V2') correct = verb.v2;
    if (randomType === 'V3') correct = verb.v3;
    if (randomType === 'UZ') correct = verb.uz;

    const others = IRREGULAR_VERBS
      .filter(v => v.v1 !== verb.v1)
      .map(v => {
        if (randomType === 'V2') return v.v2;
        if (randomType === 'V3') return v.v3;
        return v.uz;
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setOptions([...others, correct].sort(() => Math.random() - 0.5));
  };

  const generateSequence = (index: number) => {
    const verb = IRREGULAR_VERBS[index];
    setSelectedVerb(verb);
    setSequenceStep(0);
    setSequenceValid(null);
    setIsAnswered(false);

    // Pool of options for all 3 forms
    const pool = [verb.v1, verb.v2, verb.v3];
    const decoys = IRREGULAR_VERBS
      .filter(v => v.v1 !== verb.v1)
      .flatMap(v => [v.v1, v.v2, v.v3])
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setOptions([...pool, ...decoys].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = quizType === 'V2' ? selectedVerb?.v2 : quizType === 'V3' ? selectedVerb?.v3 : selectedVerb?.uz;
    
    if (option === correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIndex < IRREGULAR_VERBS.length - 1) {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        generateQuestion(next);
      } else {
        setStep('RESULT');
      }
    }, 1000);
  };

  const handleSequenceChoice = (option: string) => {
    if (sequenceValid === false) return;
    if (!selectedVerb) return;

    const target = sequenceStep === 0 ? selectedVerb.v1 : sequenceStep === 1 ? selectedVerb.v2 : selectedVerb.v3;

    if (option === target) {
      setSequenceValid(true);
      if (sequenceStep < 2) {
        setTimeout(() => {
          setSequenceStep(s => (s + 1) as 0 | 1 | 2);
          setSequenceValid(null);
        }, 600);
      } else {
        setScore(s => s + 1);
        setTimeout(() => {
          if (currentIndex < IRREGULAR_VERBS.length - 1) {
            const next = currentIndex + 1;
            setCurrentIndex(next);
            generateSequence(next);
          } else {
            setStep('RESULT');
          }
        }, 800);
      }
    } else {
      setSequenceValid(false);
      setTimeout(() => {
        if (currentIndex < IRREGULAR_VERBS.length - 1) {
          const next = currentIndex + 1;
          setCurrentIndex(next);
          generateSequence(next);
        } else {
          setStep('RESULT');
        }
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl text-center bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border-4 border-slate-50 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-xl shadow-rose-100 italic font-black text-white">
              V
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter italic mb-4">
              Irregular Master
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">
              {lang === 'uz' ? "Fellarni 3 xil shaklini mukammal o'rganing" : "Master all three forms of irregular verbs"}
            </p>

            <div className="grid grid-cols-1 gap-4 w-full">
              <button 
                onClick={() => startQuiz('QUIZ')}
                className="group w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-600 transition-all shadow-xl flex items-center justify-between px-10"
              >
                <span>{lang === 'uz' ? 'TEZKOR TEST' : 'QUICK QUIZ'}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
              <button 
                onClick={() => startQuiz('SEQUENCE')}
                className="group w-full py-6 bg-white border-4 border-indigo-50 text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center justify-between px-10"
              >
                <span>{lang === 'uz' ? 'TRINITY MASTER' : 'TRINITY MASTER'}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
              </button>
            </div>

            <button 
              onClick={onExit}
              className="mt-12 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-slate-500 transition-colors"
            >
              EXIT ✕
            </button>
          </motion.div>
        )}

        {step === 'QUIZ' && selectedVerb && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full max-w-md h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
               <motion.div 
                className="h-full bg-rose-600"
                animate={{ width: `${((currentIndex + 1) / IRREGULAR_VERBS.length) * 100}%` }}
               />
            </div>

            <div className="bg-white w-full max-w-4xl p-10 md:p-20 rounded-[4rem] shadow-2xl border-4 border-slate-50 text-center">
              <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                Find {quizType}
              </span>
              <h2 className="text-6xl md:text-9xl font-black text-slate-950 uppercase tracking-tighter italic mb-16">
                {selectedVerb.v1.split(' ')[0]}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt, i) => {
                  const correct = quizType === 'V2' ? selectedVerb.v2 : quizType === 'V3' ? selectedVerb.v3 : selectedVerb.uz;
                  const isCorrect = opt === correct;
                  const isSelected = opt === selectedOption;

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={isAnswered}
                      className={`p-6 md:p-8 rounded-[2.5rem] text-sm md:text-xl font-black uppercase tracking-tight transition-all ${
                        isAnswered 
                        ? (isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : isSelected ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-300 border-slate-100')
                        : 'bg-white border-2 border-slate-50 hover:border-rose-400 text-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={onExit} className="mt-8 text-slate-400 font-black text-[10px] uppercase tracking-widest">QUIT</button>
          </motion.div>
        )}

        {step === 'SEQUENCE' && selectedVerb && (
          <motion.div key="sequence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
            <div className="w-full max-w-md h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
               <motion.div 
                className="h-full bg-indigo-600"
                animate={{ width: `${((currentIndex + 1) / IRREGULAR_VERBS.length) * 100}%` }}
               />
            </div>

            <div className="bg-white w-full max-w-4xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-4 border-slate-50 flex flex-col lg:flex-row gap-12">
              <div className="flex-1 text-center lg:text-left flex flex-col justify-center">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">TRANSALATION</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic mb-6">
                  {selectedVerb.uz}
                </h2>
                
                <div className="flex gap-4 mt-8">
                  <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${sequenceStep >= 0 ? 'bg-blue-50 border-blue-400 shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 opacity-20'}`}>
                    <span className="text-[8px] font-black text-blue-400 block mb-1">V1</span>
                    <span className="text-lg font-black text-blue-700 italic">{sequenceStep > 0 ? selectedVerb.v1 : sequenceStep === 0 ? '???' : ''}</span>
                  </div>
                  <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${sequenceStep >= 1 ? 'bg-amber-50 border-amber-400 shadow-lg shadow-amber-100' : 'bg-slate-50 border-slate-100 opacity-20'}`}>
                    <span className="text-[8px] font-black text-amber-400 block mb-1">V2</span>
                    <span className="text-lg font-black text-amber-700 italic">{sequenceStep > 1 ? selectedVerb.v2 : sequenceStep === 1 ? '???' : ''}</span>
                  </div>
                  <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${sequenceStep >= 2 ? 'bg-emerald-50 border-emerald-400 shadow-lg shadow-emerald-100' : 'bg-slate-50 border-slate-100 opacity-20'}`}>
                    <span className="text-[8px] font-black text-emerald-400 block mb-1">V3</span>
                    <span className="text-lg font-black text-emerald-700 italic">{sequenceStep === 2 ? '???' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[400px] grid grid-cols-2 gap-3 bg-slate-50 p-6 rounded-[2.5rem]">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSequenceChoice(opt)}
                    className={`p-4 rounded-xl text-xs font-black uppercase tracking-tight transition-all flex items-center justify-center text-center shadow-sm ${
                      sequenceValid === false && sequenceStep === 0 ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 hover:border-indigo-400 hover:bg-white text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'RESULT' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border-4 border-slate-50 flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-5xl mb-8 shadow-xl shadow-emerald-100">🏆</div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter italic mb-4">COMPLETE!</h1>
            <div className="flex items-end gap-3 mb-10">
               <span className="text-9xl font-black text-indigo-600 tracking-tighter leading-none">{score}</span>
               <span className="text-3xl font-black text-slate-300 uppercase leading-none pb-4">/ {IRREGULAR_VERBS.length}</span>
            </div>
            <button onClick={() => setStep('START')} className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-rose-600 transition-all">TRY AGAIN</button>
            <button onClick={onExit} className="mt-8 text-slate-300 font-black text-[10px] uppercase tracking-widest">BACK HOME</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IrregularTrainer;
