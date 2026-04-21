
import React, { useState } from 'react';
import { VOCAB_DATA, CUSTOM_VOCAB } from './data';
import { GameMode, Unit, Language, Word } from './types';
import { t } from './translations';
import Header from './components/Header';
import UnitSelector from './components/UnitSelector';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import MatchGame from './components/MatchGame';
import WrittenGame from './components/WrittenGame';
import Exam from './components/Exam';
import ScrambleGame from './components/ScrambleGame';
import VoiceGame from './components/VoiceGame';
import GlobalExam from './components/GlobalExam';
import ExamUnitSelector from './components/ExamUnitSelector';
import TenseGame from './components/TenseGame';
import SprintGame from './components/SprintGame';
import HelpModal from './components/HelpModal';
import SupportWidget from './components/SupportWidget';

type ViewType = 'HOME' | 'VOCABULARY' | 'TENSE';
type WordCategory = 'SHORT' | 'B_PLUS' | 'C_PLUS';

const App: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.IDLE);
  const [lang, setLang] = useState<Language>('uz');
  const [view, setView] = useState<ViewType>('HOME');
  const [vocabCategory, setVocabCategory] = useState<WordCategory>('SHORT');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVocabExamActive, setIsVocabExamActive] = useState(false);
  const [isSelectingExamUnits, setIsSelectingExamUnits] = useState(false);
  const [examWords, setExamWords] = useState<Word[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpMode, setHelpMode] = useState<'FAQ' | 'ABOUT'>('FAQ');

  const text = t[lang];

  const resetGame = () => {
    setGameMode(GameMode.IDLE);
    setSelectedUnit(null);
    setView('HOME');
    setSearchQuery('');
    setIsVocabExamActive(false);
    setIsSelectingExamUnits(false);
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setView('HOME');
    setGameMode(GameMode.IDLE);
  };

  const handleVocabulary = () => {
    setSelectedUnit(null);
    setGameMode(GameMode.IDLE);
    setView('VOCABULARY');
    setSearchQuery('');
    setIsVocabExamActive(false);
  };

  const handleTense = () => {
    setView('TENSE');
    setGameMode(GameMode.IDLE);
    setSelectedUnit(null);
  };

  const handleMegaExam = () => {
    setIsSelectingExamUnits(true);
    setGameMode(GameMode.IDLE);
    setView('HOME');
    setSelectedUnit(null);
  };

  const startGlobalExam = (selectedUnits: Unit[], onlySingleWords: boolean) => {
    let words = selectedUnits.flatMap(u => u.words);
    
    if (onlySingleWords) {
      // Filter for single words (no spaces in English version)
      words = words.filter(w => !w.en.trim().includes(' '));
    }
    
    setExamWords(words);
    setIsSelectingExamUnits(false);
    setGameMode(GameMode.GLOBAL_EXAM);
  };

  const allWords = VOCAB_DATA.flatMap(unit => unit.words);

  const getFilteredWords = () => {
    let words = CUSTOM_VOCAB[vocabCategory] || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      words = words.filter(w => w.en.toLowerCase().includes(q) || w.uz.toLowerCase().includes(q));
    }
    return words;
  };

  const getCurrentViewId = () => {
    if (view === 'TENSE') return 'TENSE';
    if (gameMode === GameMode.GLOBAL_EXAM) return 'MEGA';
    if (view === 'VOCABULARY') return 'VOCABULARY';
    return 'HOME';
  };

  const speak = (txt: string, l: 'en' | 'uz') => {
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.lang = l === 'en' ? 'en-US' : 'uz-UZ';
    window.speechSynthesis.speak(utterance);
  };

  const isGameActive = gameMode !== GameMode.IDLE || isVocabExamActive;
  const currentViewId = getCurrentViewId();

  const renderContent = () => {
    if (view === 'TENSE') {
      return <TenseGame lang={lang} onExit={resetGame} />;
    }

    if (isSelectingExamUnits) {
      return (
        <ExamUnitSelector 
          units={VOCAB_DATA} 
          lang={lang} 
          onStart={startGlobalExam} 
          onCancel={() => setIsSelectingExamUnits(false)} 
        />
      );
    }

    if (view === 'VOCABULARY') {
      const activeWords = getFilteredWords();

      if (isVocabExamActive) {
        return <Exam words={activeWords} lang={lang} onExit={() => setIsVocabExamActive(false)} />;
      }

      if (gameMode === GameMode.PRACTICE_EN_UZ) {
        return <WrittenGame words={activeWords} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} fixedDirection="EN_UZ" />;
      }

      if (gameMode === GameMode.PRACTICE_UZ_EN) {
        return <WrittenGame words={activeWords} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} fixedDirection="UZ_EN" />;
      }

      return (
        <div className="animate-fadeIn space-y-8 md:space-y-12 max-w-7xl mx-auto px-4 pb-20">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 pt-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic">Vocabulary Bank</h2>
            
            {/* QIDIRUV MAYDONI */}
            <div className="w-full max-w-md relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'uz' ? "So'zni qidiring..." : "Search for words..."}
                className="w-full px-6 py-4 bg-white border-2 border-blue-50 rounded-full text-sm font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/5 transition-all shadow-sm"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-400 transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
              {(['SHORT', 'B_PLUS', 'C_PLUS'] as WordCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setVocabCategory(cat); setIsVocabExamActive(false); setSearchQuery(''); }}
                  className={`px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${vocabCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-400 hover:text-blue-700'}`}
                >
                  {cat === 'SHORT' ? text.shortWords : cat === 'B_PLUS' ? text.bPlusWords : text.cPlusWords}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => setIsVocabExamActive(true)}
                className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-rose-600 text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.15em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 active:scale-95 group"
              >
                <span>🎓</span>
                {vocabCategory === 'SHORT' ? text.shortWords : vocabCategory === 'B_PLUS' ? text.bPlusWords : text.cPlusWords} {text.unitExam}
              </button>
              <button 
                onClick={() => setGameMode(GameMode.PRACTICE_EN_UZ)}
                className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 group"
              >
                <span>🇺🇿</span>
                {text.uzWords}
              </button>
              <button 
                onClick={() => setGameMode(GameMode.PRACTICE_UZ_EN)}
                className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 group"
              >
                <span>🇬🇧</span>
                {text.enWords}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {activeWords.length > 0 ? (
              activeWords.map((word, idx) => (
                <div 
                  key={word.id + idx} 
                  className="group bg-blue-600 px-4 py-3 rounded-xl border-2 border-blue-500 shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <p className="text-white font-black text-[11px] md:text-[12px] uppercase tracking-tight shrink-0">
                        {word.en}
                      </p>
                      <span className="text-white/30 text-[10px] shrink-0">→</span>
                      <p className="text-white text-[10px] md:text-[11px] font-bold italic truncate leading-tight">
                        {word.uz}
                      </p>
                  </div>
                  
                  <button 
                    onClick={() => speak(word.en, 'en')} 
                    className="text-white/60 hover:text-white transition-colors bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0 active:scale-90"
                  >
                    <span className="text-[10px]">🔊</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-300 font-black uppercase tracking-[0.2em]">{lang === 'uz' ? "Hech narsa topilmadi" : "Nothing found"}</p>
              </div>
            )}
          </div>
          
          <div className="text-center pt-10">
            <button onClick={resetGame} className="text-blue-600 font-black text-sm md:text-lg hover:underline transition-all">← {text.backToHome}</button>
          </div>
        </div>
      );
    }

    if (gameMode === GameMode.GLOBAL_EXAM) {
      return <GlobalExam words={examWords} onExit={resetGame} lang={lang} />;
    }

    if (selectedUnit) {
      if (gameMode === GameMode.IDLE) {
        return (
          <div className="space-y-10 animate-fadeIn max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <button onClick={() => setSelectedUnit(null)} className="text-blue-600 font-black mb-4 flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-widest text-xs">
                  ← {text.backToTopics}
                </button>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic">{selectedUnit.title}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GameCard onClick={() => setGameMode(GameMode.SPRINT)} title={text.sprint} desc={text.sprintDesc} icon="⚡" isNew />
              <GameCard onClick={() => setGameMode(GameMode.FLASHCARDS)} title={text.flashcards} desc={text.flashcardsDesc} icon="🃏" />
              <GameCard onClick={() => setGameMode(GameMode.QUIZ)} title={text.quiz} desc={text.quizDesc} icon="❓" />
              <GameCard onClick={() => setGameMode(GameMode.MATCH)} title={text.match} desc={text.matchDesc} icon="🔥" />
              <GameCard onClick={() => setGameMode(GameMode.SCRAMBLE)} title={text.scramble} desc={text.scrambleDesc} icon="🧩" />
              <GameCard onClick={() => setGameMode(GameMode.WRITTEN)} title={text.written} desc={text.writtenDesc} icon="✍️" />
              <GameCard onClick={() => setGameMode(GameMode.VOICE_EN_UZ)} title={text.voiceEnUz} desc={text.voiceEnUzDesc} icon="🎤" isNew />
              <GameCard onClick={() => setGameMode(GameMode.VOICE_UZ_EN)} title={text.voiceUzEn} desc={text.voiceUzEnDesc} icon="🗣️" isNew />
              <GameCard onClick={() => setGameMode(GameMode.PRONUNCIATION)} title={text.pronunciation} desc={text.pronunciationDesc} icon="📖" isNew />
              <GameCard onClick={() => setGameMode(GameMode.PRACTICE_EN_UZ)} title={text.uzWords} desc={text.uzWordsDesc} icon="🇺🇿" />
              <GameCard onClick={() => setGameMode(GameMode.PRACTICE_UZ_EN)} title={text.enWords} desc={text.enWordsDesc} icon="🇬🇧" />
              <div className="lg:col-span-1">
                <button onClick={() => setGameMode(GameMode.EXAM)} className="w-full h-full p-10 rounded-[3rem] bg-rose-600 text-white flex flex-col items-center justify-center gap-6 hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 group">
                  <span className="text-7xl group-hover:scale-125 transition-transform duration-500">🎓</span>
                  <div className="text-center">
                    <h3 className="text-3xl font-black uppercase tracking-widest">{text.unitExam}</h3>
                    <p className="text-rose-100 text-sm font-bold opacity-80 mt-2">{text.unitExamDesc}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      } else {
        const words = selectedUnit.words;
        switch (gameMode) {
          case GameMode.SPRINT: return <SprintGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          case GameMode.FLASHCARDS: return <Flashcards words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          case GameMode.QUIZ: return <Quiz words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          case GameMode.MATCH: return <MatchGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          case GameMode.WRITTEN: return <WrittenGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          case GameMode.PRACTICE_EN_UZ: return <WrittenGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} fixedDirection="EN_UZ" />;
          case GameMode.PRACTICE_UZ_EN: return <WrittenGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} fixedDirection="UZ_EN" />;
          case GameMode.SCRAMBLE: return <ScrambleGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          case GameMode.VOICE_EN_UZ: return <VoiceGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} direction="EN_UZ" />;
          case GameMode.VOICE_UZ_EN: return <VoiceGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} direction="UZ_EN" />;
          case GameMode.PRONUNCIATION: return <VoiceGame words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} direction="EN_READ" />;
          case GameMode.EXAM: return <Exam words={words} lang={lang} onExit={() => setGameMode(GameMode.IDLE)} />;
          default: return null;
        }
      }
    }

    return (
      <div className="space-y-16 max-w-6xl mx-auto px-4 flex flex-col items-center pb-20">
        <div className="text-center py-12 md:py-24 animate-fadeIn">
          <h2 className="text-5xl md:text-[11rem] font-black tracking-tighter leading-none mb-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent select-none animate-gradient-slow bg-[length:200%_auto]">
            WELCOME
          </h2>
          <p className="text-slate-900 font-black text-sm md:text-2xl max-w-xl mx-auto uppercase tracking-[0.3em] opacity-80 px-4">
            {text.selectTopic}
          </p>
        </div>
        <div className="w-full">
            <UnitSelector units={VOCAB_DATA} onSelect={handleUnitSelect} lang={lang} />
        </div>
        <div className="w-full mt-20">
          <button 
            onClick={handleMegaExam}
            className="group relative w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-10 md:py-16 bg-slate-950 text-white rounded-[2.5rem] md:rounded-[4rem] font-black text-xl md:text-5xl uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-blue-700 transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.3)] active:scale-[0.97] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            <div className="flex items-center gap-4 md:gap-6">
               <span className="text-3xl md:text-7xl transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-500">🏆</span>
               <div className="text-center md:text-left flex flex-col">
                  <span className="leading-none">{text.megaExamTitle.split(' (')[0]}</span>
                  <span className="text-[8px] md:text-sm font-bold text-emerald-400 tracking-[0.3em] md:tracking-[0.5em] mt-2 md:mt-3 opacity-80 uppercase">Customizable • Pro Exam</span>
               </div>
            </div>
          </button>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes gradient-slow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-slow { animation: gradient-slow 8s linear infinite; }
        `}} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] flex flex-col">
      {!isGameActive && (
        <Header 
          onHome={resetGame} 
          onTense={handleTense}
          onMegaExam={handleMegaExam}
          onVocabulary={handleVocabulary}
          onHelp={() => { setHelpMode('ABOUT'); setIsHelpOpen(true); }}
          onFaq={() => { setHelpMode('FAQ'); setIsHelpOpen(true); }}
          lang={lang} 
          setLang={setLang} 
          currentView={currentViewId}
        />
      )}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} lang={lang} mode={helpMode} setMode={setHelpMode} />
      
      <main className={`flex-1 w-full mx-auto ${view === 'TENSE' || isGameActive ? '' : 'py-6 md:py-10'}`}>
        {renderContent()}
      </main>

      {!isGameActive && <SupportWidget />}
      
      <footer className="py-16 md:py-24 border-t border-blue-50 bg-blue-50/10 text-center">
          <h4 className="text-slate-900 font-black text-2xl md:text-3xl uppercase tracking-tighter italic">LINGOMASTER</h4>
          <p className="text-blue-600 font-bold text-[8px] md:text-xs uppercase tracking-[0.4em] mt-3 opacity-60">© 2025 Sodiqjon Mukhtorov</p>
      </footer>
    </div>
  );
};

interface GameCardProps {
  onClick: () => void;
  title: string;
  desc: string;
  icon: string;
  isNew?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ onClick, title, desc, icon, isNew }) => (
  <button 
    onClick={onClick} 
    className="group bg-blue-600 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-blue-500 shadow-xl hover:shadow-blue-300 hover:bg-blue-700 hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full relative overflow-hidden"
  >
    {isNew && (
        <div className="absolute top-6 right-6 bg-yellow-400 text-slate-900 text-[8px] md:text-[10px] font-black px-3 md:px-4 py-1.5 rounded-full animate-bounce shadow-lg uppercase tracking-widest">
            NEW
        </div>
    )}
    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl mb-8 md:mb-10 group-hover:scale-110 transition-transform duration-500">
        {icon}
    </div>
    <h3 className="text-2xl md:text-[32px] font-black text-white mb-2 md:mb-3 uppercase tracking-tight group-hover:text-emerald-300 transition-colors leading-none">
        {title}
    </h3>
    <p className="text-blue-100 text-base md:text-xl font-bold leading-snug mb-8 md:mb-12 opacity-90 italic">
        {desc}
    </p>
    <div className="mt-auto pt-6 md:pt-8 border-t border-white/10 text-white font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-3 group-hover:gap-6 transition-all duration-300">
        PLAY NOW <span>➔</span>
    </div>
  </button>
);

export default App;
