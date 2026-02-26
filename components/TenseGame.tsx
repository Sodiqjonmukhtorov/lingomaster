import React from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface TenseGameProps {
  lang: Language;
  onExit: () => void;
}

const TenseGame: React.FC<TenseGameProps> = ({ lang, onExit }) => {
  const text = t[lang];

  return (
    <div className="w-full min-h-[80vh] bg-[#0f172a] rounded-[40px] mt-12 mb-12 flex overflow-hidden shadow-2xl animate-fadeIn relative">
      {/* LEFT LOGO SIDEBAR */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/4 bg-white/5 border-r border-white/10 p-12 relative">
          <div className="absolute top-10 left-10">
              <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-2xl">
                  <path d="M20,25 Q15,25 15,30 L15,65 Q15,70 20,70 L35,70 L30,85 L50,70 L80,70 Q85,70 85,65 L85,30 Q85,25 80,25 Z" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="55" cy="55" r="22" fill="none" stroke="#f97316" strokeWidth="4" />
              </svg>
          </div>
          <h1 className="text-white text-9xl font-black uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180 opacity-20 select-none">
            LINGOMASTER
          </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative">
          <button 
            onClick={onExit} 
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-all text-xl font-black uppercase tracking-widest"
          >
            ✕ {text.exit}
          </button>
          
          <div className="max-w-3xl w-full text-center lg:text-left">
              <span className="text-indigo-400 font-black text-xl uppercase tracking-[0.5em] mb-6 block animate-fadeIn">
                Coming Soon
              </span>
              <h2 className="text-white text-5xl md:text-[80px] font-black uppercase leading-[0.9] mb-10 tracking-tighter animate-slideUp">
                  {text.notAvailable}
              </h2>
              <div className="w-20 h-2 bg-indigo-500 rounded-full mb-10 hidden lg:block animate-slideUp" style={{ animationDelay: '0.2s' }}></div>
              <p className="text-slate-400 text-lg md:text-2xl font-medium mb-10 max-w-xl leading-tight animate-slideUp" style={{ animationDelay: '0.3s' }}>
                  {lang === 'uz' 
                    ? 'Ushbu bo\'lim hozirda tayyorlanmoqda. Tez orada yangi va qiziqarli mashqlar qo\'shiladi!' 
                    : 'This section is currently under development. New and exciting exercises will be added soon!'}
              </p>
              <button 
                  onClick={onExit}
                  className="group bg-white text-indigo-900 px-8 py-4 rounded-2xl text-xl font-black hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95 animate-slideUp"
                  style={{ animationDelay: '0.4s' }}
              >
                  ← {text.backToHome}
              </button>
          </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideUp {
              from { opacity: 0; transform: translateY(50px); }
              to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
          .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
      `}} />
    </div>
  );
};

export default TenseGame;