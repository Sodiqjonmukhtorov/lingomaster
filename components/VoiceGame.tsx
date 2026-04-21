
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceGameProps {
  words: Word[];
  lang: Language;
  onExit: () => void;
  direction: 'EN_UZ' | 'UZ_EN' | 'EN_READ';
}

const VoiceGame: React.FC<VoiceGameProps> = ({ words, lang, onExit, direction }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textDict = t[lang];

  const currentWord = words[currentIdx];
  const question = direction === 'EN_READ' ? currentWord.en : (direction === 'EN_UZ' ? currentWord.en : currentWord.uz);
  const target = direction === 'EN_READ' ? currentWord.en : (direction === 'EN_UZ' ? currentWord.uz : currentWord.en);

  const speak = useCallback((text: string, l: 'en' | 'uz') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = l === 'en' ? 'en-US' : 'uz-UZ';
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (!isFinished && currentWord) {
      if (direction !== 'EN_READ') {
        speak(question, direction === 'EN_UZ' ? 'en' : 'uz');
      }
    }
  }, [currentIdx, isFinished, question, direction, speak, currentWord]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      if (direction === 'EN_UZ') {
        recognitionRef.current.lang = 'uz-UZ';
      } else {
        recognitionRef.current.lang = 'en-US';
      }

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        checkAnswer(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, [direction]);

  const checkAnswer = (userInput: string) => {
    const clean = (s: string) => s.toLowerCase().trim().replace(/[.,?!]/g, '').replace(/\s+/g, ' ');
    const user = clean(userInput);
    
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
    
    const isCorrect = Array.from(allPossible).some(v => user.includes(v) || v.includes(user));

    if (isCorrect) {
      setFeedback('CORRECT');
      setScore(prev => prev + 1);
      setTimeout(() => nextQuestion(), 1500);
    } else {
      setFeedback('WRONG');
      setTimeout(() => nextQuestion(), 2500);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setTranscript('');
    if (currentIdx < words.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(lang === 'uz' ? "Kechirasiz, brauzeringiz ovozli tanib olishni qo'llab-quvvatlamaydi." : "Sorry, your browser does not support speech recognition.");
      return;
    }
    if (recognitionRef.current && !isListening && !feedback) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center animate-fadeIn">
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 border-4 border-blue-100">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase tracking-tighter italic">{textDict.congrats}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest mb-10">{textDict.score}: {score} / {words.length}</p>
          <button 
            onClick={onExit}
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            {textDict.backToMenu}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-800 transition font-black uppercase tracking-widest text-xs">✕ {textDict.exit}</button>
        <div className="flex flex-col items-center">
          <div className="text-blue-600 font-black tracking-widest text-[10px] uppercase">
            {direction === 'EN_READ' ? 'PRONUNCIATION' : 'VOICE PRACTICE'}
          </div>
          <div className="bg-slate-100 h-1.5 w-32 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${((currentIdx) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="font-black text-slate-400 text-sm">{currentIdx + 1} / {words.length}</div>
      </div>

      <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border-b-8 border-blue-50 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
        
        <button 
          onClick={() => speak(question, direction === 'EN_UZ' ? 'en' : 'uz')}
          className="mb-8 text-blue-400 hover:text-blue-600 transition-colors"
        >
          <span className="text-4xl">🔊</span>
        </button>

        <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-12 text-center leading-tight uppercase tracking-tighter italic">
          {question}
        </h2>

        <div className="w-full flex flex-col items-center gap-8">
          <AnimatePresence mode="wait">
            {feedback === 'CORRECT' ? (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-5xl shadow-xl shadow-emerald-100"
              >
                ✓
              </motion.div>
            ) : feedback === 'WRONG' ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white text-5xl shadow-xl shadow-rose-100 mx-auto mb-4">
                  ✕
                </div>
                <p className="text-rose-600 font-black text-lg uppercase tracking-widest mb-1">{textDict.wrong}</p>
                <p className="text-emerald-600 font-black text-2xl italic">{target}</p>
              </motion.div>
            ) : (
              <motion.button
                key="listen-btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={startListening}
                disabled={isListening}
                className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all shadow-2xl active:scale-95 ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {isListening ? '🛑' : '🎤'}
              </motion.button>
            )}
          </AnimatePresence>

          <div className="h-12 text-center">
            {isListening && (
              <p className="text-rose-500 font-black uppercase tracking-widest text-xs animate-pulse">
                {lang === 'uz' ? 'Eshitilmoqda...' : 'Listening...'}
              </p>
            )}
            {transcript && !feedback && (
              <p className="text-slate-400 font-bold italic text-xl">"{transcript}"</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          {direction === 'EN_READ'
            ? (lang === 'uz' ? 'So\'zni to\'g\'ri o\'qing (Talaffuz)' : 'Read the word correctly (Pronunciation)')
            : (direction === 'EN_UZ' 
                ? (lang === 'uz' ? 'Inglizcha eshiting va o\'zbekcha javob bering' : 'Listen in English and answer in Uzbek')
                : (lang === 'uz' ? 'O\'zbekcha eshiting va inglizcha javob bering' : 'Listen in Uzbek and answer in English')
              )
          }
        </p>
      </div>
    </div>
  );
};

export default VoiceGame;
