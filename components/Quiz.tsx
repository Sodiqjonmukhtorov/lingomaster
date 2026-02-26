
import React, { useState, useMemo } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface QuizProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
}

const Quiz: React.FC<QuizProps> = ({ words, onExit, lang }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const textDict = t[lang];

  const shuffledWords = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const questionType = useMemo(() => Math.random() > 0.5 ? 'EN_TO_UZ' : 'UZ_TO_EN', [currentQuestionIndex]);
  const currentWord = shuffledWords[currentQuestionIndex];

  const options = useMemo(() => {
    if (!currentWord) return [];
    const otherWords = words.filter(w => w.id !== currentWord.id);
    const distractors = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
    const correctAns = questionType === 'EN_TO_UZ' ? currentWord.uz : currentWord.en;
    
    return [currentWord, ...distractors].map(w => ({
      id: w.id,
      text: questionType === 'EN_TO_UZ' ? w.uz : w.en
    })).sort(() => Math.random() - 0.5);
  }, [currentWord, words, questionType]);

  const handleOptionClick = (optionText: string) => {
    if (isAnswered) return;
    setSelectedOption(optionText);
    setIsAnswered(true);
    const correctText = questionType === 'EN_TO_UZ' ? currentWord.uz : currentWord.en;
    if (optionText === correctText) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledWords.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const percentage = Math.round((score / words.length) * 100);
    return (
      <div className="flex flex-col items-center p-8 md:p-12 bg-white rounded-[3rem] shadow-2xl max-w-lg mx-auto text-center border-4 border-slate-50 animate-fadeIn">
        <h2 className="text-3xl font-black mb-2 text-slate-800 uppercase tracking-tighter italic">{lang === 'uz' ? 'Natija' : 'Result'}</h2>
        <div className="text-7xl my-8">
          {percentage > 70 ? '🏆' : percentage > 40 ? '⭐' : '📚'}
        </div>
        <div className="text-6xl font-black text-blue-600 mb-10">{score} / {words.length}</div>
        <button 
          onClick={onExit}
          className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all w-full shadow-xl"
        >
          {textDict.backToMenu}
        </button>
      </div>
    );
  }

  const questionTitle = questionType === 'EN_TO_UZ' ? currentWord.en : currentWord.uz;
  const correctText = questionType === 'EN_TO_UZ' ? currentWord.uz : currentWord.en;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 md:py-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <button 
          onClick={onExit} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-black transition uppercase tracking-widest flex items-center gap-2"
        >
          ✕ {textDict.exit}
        </button>
        <div className="bg-slate-100 rounded-full h-2.5 flex-1 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-700" 
            style={{ width: `${((currentQuestionIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
        <div className="font-black text-slate-400 text-xs">{currentQuestionIndex + 1} / {words.length}</div>
      </div>

      {/* Question Card */}
      <div className="bg-blue-600 p-10 md:p-16 rounded-[3.5rem] shadow-2xl border-4 border-blue-500 mb-8 flex flex-col items-center text-center">
        <span className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          {questionType === 'EN_TO_UZ' ? (lang === 'uz' ? 'Tarjima qiling' : 'Translate') : (lang === 'uz' ? 'Inglizchasini toping' : 'Find English')}
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-tight italic">{questionTitle}</h2>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, idx) => {
          let btnStyle = 'bg-white border-slate-100 text-slate-700 hover:border-blue-400 hover:bg-blue-50';
          if (isAnswered) {
            if (option.text === correctText) {
              btnStyle = 'bg-emerald-500 border-emerald-500 text-white scale-[1.02] shadow-xl';
            } else if (selectedOption === option.text) {
              btnStyle = 'bg-rose-500 border-rose-500 text-white opacity-90';
            } else {
              btnStyle = 'bg-slate-50 border-slate-50 text-slate-300 opacity-40';
            }
          }

          return (
            <button
              key={option.id + idx}
              onClick={() => handleOptionClick(option.text)}
              className={`p-5 md:p-6 rounded-[2rem] border-4 text-sm md:text-base font-black uppercase tracking-tight transition-all duration-300 ${btnStyle} ${!isAnswered ? 'active:scale-95 shadow-lg' : 'cursor-default shadow-none'}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button
          onClick={handleNext}
          className="mt-10 w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl"
        >
          {currentQuestionIndex === words.length - 1 ? (lang === 'uz' ? 'Yakunlash' : 'Finish') : `${textDict.next} ➔`}
        </button>
      )}
    </div>
  );
};

export default Quiz;
