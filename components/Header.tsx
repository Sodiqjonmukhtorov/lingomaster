
import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface HeaderProps {
  onHome: () => void;
  onTense: () => void;
  onIrregular: () => void;
  onMegaExam: () => void;
  onVocabulary: () => void;
  onHelp: () => void;
  onFaq: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onHome, onTense, onIrregular, onMegaExam, onVocabulary, onHelp, onFaq, lang, setLang, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const text = t[lang];

  const handleNav = (fn: () => void) => {
    fn();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-2 sm:top-4 z-[100] w-full px-2 sm:px-6 pointer-events-none">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-1">
        {/* Creator Info */}
        <div className="flex justify-center">
          <p className="text-[7.5px] sm:text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] bg-rose-50/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-rose-200 shadow-sm shadow-rose-100/50">
            {lang === 'uz' ? 'Yaratuvchi' : 'Creator'}: <span className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-2 py-0.5 rounded-md ml-1 shadow-md">Sodiqjon Mukhtorov</span>
          </p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 p-2 sm:p-3 md:px-8 rounded-[2rem] sm:rounded-full shadow-lg shadow-emerald-900/5 flex flex-col pointer-events-auto transition-all duration-500">
        
        {/* ASOSIY QATOR: LOGO + AKSALAR */}
        <div className="w-full flex items-center justify-between gap-2">
          {/* LOGO (Desktopda ko'rinadi, mobilda yashiriladi) */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer group" onClick={() => handleNav(onHome)}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#059669] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
              <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 fill-white">
                  <path d="M20,25 Q15,25 15,30 L15,65 Q15,70 20,70 L35,70 L30,85 L50,70 L80,70 Q85,70 85,65 L85,30 Q85,25 80,25 Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[10px] sm:text-sm font-black text-[#064e3b] tracking-tighter leading-none uppercase">LINGOMASTER</h1>
              <p className="text-[6px] sm:text-[8px] font-bold text-[#10b981] uppercase tracking-widest">Expert</p>
            </div>
          </div>

          {/* MOBILE HAMBURGER BUTTON (Mobilda chapda logo o'rnida) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-[#059669] hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* DESKTOP NAVIGATSIYA (Planhet/PC uchun) */}
          <nav className="hidden md:flex items-center justify-center gap-2">
            <NavBtn active={currentView === 'HOME'} onClick={onHome} label="HOME" />
            <NavBtn active={currentView === 'VOCABULARY'} onClick={onVocabulary} label="VOCABULARY" />
            <NavBtn active={currentView === 'IRREGULAR'} onClick={onIrregular} label="VERBS" />
            <NavBtn active={currentView === 'TENSE'} onClick={onTense} label="TENSES" />
            <NavBtn active={currentView === 'MEGA'} onClick={onMegaExam} label="MEGA EXAM" />
          </nav>

          {/* AKSALAR (Yordam + Til) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={onHelp}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#065f46] bg-[#ecfdf5] hover:bg-[#d1fae5] transition-all border border-[#d1fae5]"
            >
              ?
            </button>
            <div className="flex bg-[#ecfdf5] p-0.5 rounded-full border border-[#d1fae5]">
              <button onClick={() => setLang('uz')} className={`px-2 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black transition-all ${lang === 'uz' ? 'bg-[#059669] text-white' : 'text-[#10b981]'}`}>UZ</button>
              <button onClick={() => setLang('en')} className={`px-2 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black transition-all ${lang === 'en' ? 'bg-[#059669] text-white' : 'text-[#10b981]'}`}>EN</button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* MOBILE SIDEBAR MENU (Moved outside pill container to prevent clipping) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden pointer-events-auto">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-[#064e3b]/40 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Sidebar Content */}
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl animate-slideRight flex flex-col rounded-r-[20px] overflow-hidden">
            
            {/* Header inside Sidebar */}
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#059669] rounded-xl flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
                      <path d="M20,25 Q15,25 15,30 L15,65 Q15,70 20,70 L35,70 L30,85 L50,70 L80,70 Q85,70 85,65 L85,30 Q85,25 80,25 Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-sm font-black text-[#064e3b] tracking-tighter leading-none uppercase">LINGOMASTER</h1>
                  <p className="text-[8px] font-bold text-[#10b981] uppercase tracking-widest">Expert</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              <NavBtnSidebar active={currentView === 'HOME'} onClick={() => handleNav(onHome)} label="HOME" icon="🏠" />
              <NavBtnSidebar active={currentView === 'VOCABULARY'} onClick={() => handleNav(onVocabulary)} label="VOCABULARY" icon="📚" />
              <NavBtnSidebar active={currentView === 'IRREGULAR'} onClick={() => handleNav(onIrregular)} label="VERBS" icon="⚡" />
              <NavBtnSidebar active={currentView === 'TENSE'} onClick={() => handleNav(onTense)} label="TENSES" icon="⏳" />
              <NavBtnSidebar active={currentView === 'MEGA'} onClick={() => handleNav(onMegaExam)} label="FULL EXAM" icon="🏆" />
              
              <div className="h-px bg-slate-100 my-4 mx-2"></div>
              
              <NavBtnSidebar active={false} onClick={() => handleNav(onHelp)} label={lang === 'uz' ? 'BIZ HAQIMIZDA' : 'ABOUT US'} icon="ℹ️" />
              <NavBtnSidebar active={false} onClick={() => window.open('https://t.me/thesodiqjon', '_blank')} label="ADMIN" icon="👨‍💻" />
              
              {/* FAQ Button - Styled like the image */}
              <button 
                onClick={() => handleNav(onFaq)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <span className="text-lg w-6 flex items-center justify-center">❓</span>
                <span className="flex-1 text-left">FAQ</span>
              </button>
            </div>

            {/* Language Switcher at bottom */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button onClick={() => setLang('uz')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${lang === 'uz' ? 'bg-[#059669] text-white shadow-md' : 'text-slate-400'}`}>UZBEK</button>
                <button onClick={() => setLang('en')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-[#059669] text-white shadow-md' : 'text-slate-400'}`}>ENGLISH</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideRight { animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </header>
  );
};

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: string;
}

const NavBtn: React.FC<NavBtnProps> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick} 
    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap flex-1 text-center ${
      active ? 'bg-[#064e3b] text-white shadow-md' : 'text-[#059669] hover:bg-[#f0fdf4] border border-transparent'
    }`}
  >
    {label}
  </button>
);

const NavBtnSidebar: React.FC<NavBtnProps> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick} 
    className={`w-full py-4 px-6 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 text-left flex items-center gap-4 ${
      active ? 'bg-emerald-50 text-[#059669]' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <span className="text-lg w-6 flex items-center justify-center">{icon}</span>
    <span className="flex-1">{label}</span>
    {active && <span className="text-lg opacity-50">➔</span>}
  </button>
);

export default Header;
