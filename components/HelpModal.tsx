
import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  mode: 'FAQ' | 'ABOUT';
  setMode: (mode: 'FAQ' | 'ABOUT') => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang, mode, setMode }) => {
  const text = t[lang];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-slate-950/40 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-2xl my-auto rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden animate-slideUp border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header/Close */}
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full flex items-center justify-center transition-all active:scale-90 font-black"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center p-8 md:p-12 text-center">
          
          {mode === 'FAQ' ? (
            <>
              <h2 className="text-3xl md:text-4xl font-black text-[#064e3b] uppercase tracking-tighter italic mb-2">
                {text.faqTitle}
              </h2>
              <p className="text-slate-400 font-bold text-sm mb-10">
                {text.faqSubtitle}
              </p>

              {/* FAQ ACCORDION */}
              <div className="w-full space-y-3 text-left mb-12">
                {(text as any).faqItems.map((item: any, idx: number) => (
                  <div 
                    key={idx}
                    className={`border rounded-2xl transition-all duration-300 ${openFaqIndex === idx ? 'bg-blue-50 border-blue-100 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}`}
                  >
                    <button 
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-blue-500 font-black text-lg">?</span>
                        <span className={`font-black text-sm md:text-base tracking-tight ${openFaqIndex === idx ? 'text-blue-700' : 'text-slate-700'}`}>
                          {item.q}
                        </span>
                      </div>
                      <span className={`text-xl transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180 text-blue-500' : 'text-slate-300'}`}>
                        ▼
                      </span>
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-6 pb-6 md:px-14 md:pb-8 animate-fadeIn">
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-black text-[#064e3b] uppercase tracking-tighter italic mb-2">
                {lang === 'uz' ? 'Biz haqimizda' : 'About Us'}
              </h2>
              <p className="text-slate-400 font-bold text-sm mb-10">
                {(text as any).aboutSubtitle}
              </p>

              <div className="w-full bg-blue-50/50 rounded-[2rem] border border-blue-100 overflow-hidden mb-10">
                <div className="bg-blue-100/50 px-8 py-4 flex items-center gap-3 border-b border-blue-100">
                  <span className="text-blue-600">ℹ️</span>
                  <span className="text-blue-800 font-black text-xs uppercase tracking-widest">{lang === 'uz' ? 'Biz haqimizda' : 'About Us'}</span>
                </div>
                <div className="p-8 md:p-12 flex flex-col items-center">
                  <div className="w-24 h-24 bg-[#059669] rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                    <svg viewBox="0 0 100 100" className="w-14 h-14 fill-white">
                        <path d="M20,25 Q15,25 15,30 L15,65 Q15,70 20,70 L35,70 L30,85 L50,70 L80,70 Q85,70 85,65 L85,30 Q85,25 80,25 Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#064e3b] uppercase tracking-tighter mb-2">LINGOMASTER</h3>
                  <p className="text-emerald-600 font-bold text-xs uppercase tracking-[0.3em] mb-8">{lang === 'uz' ? 'Tezkor va oson til o\'rganish platformasi' : 'Fast and easy language learning platform'}</p>
                  
                  <h4 className="text-slate-900 font-black text-lg mb-8">{(text as any).aboutWhatCanDo}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {(text as any).aboutFeatures.map((feature: any, idx: number) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex items-start gap-4 text-left hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h5 className="text-slate-900 font-black text-xs uppercase mb-1">{feature.title}</h5>
                          <p className="text-slate-500 font-medium text-[10px] leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SUPPORT BUTTON */}
          <div className="mb-12 w-full">
            <a 
              href="https://t.me/thesodiqjon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full py-5 bg-[#059669] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200 hover:bg-[#064e3b] hover:-translate-y-1 transition-all active:scale-95 animate-pulse-slow group"
            >
              <span className="text-xl">✈️</span>
              {text.supportBtn}
              <span className="opacity-40 group-hover:translate-x-1 transition-transform">➔</span>
            </a>
          </div>

          <div className="h-px bg-slate-50 w-full mb-10"></div>

          <div className="space-y-10 text-left w-full">
            {/* CREATOR SECTION */}
            <div className="bg-blue-50/30 p-6 md:p-8 rounded-[2rem] border border-blue-100">
              <h3 className="text-blue-700 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {text.creatorTitle}
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                  👨‍💻
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-lg uppercase leading-none">{text.creatorName}</h4>
                  <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mt-1">Lead Developer</p>
                </div>
              </div>
              <p className="text-slate-600 font-medium text-xs leading-relaxed italic border-l-4 border-blue-200 pl-4 py-1">
                {text.creatorDesc}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 w-full text-slate-300 font-black text-[9px] uppercase tracking-widest">
            LINGOMASTER VOCABULARY EXPERT • VERSION 1.0
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2); }
          50% { transform: scale(1.03); box-shadow: 0 25px 50px rgba(16, 185, 129, 0.4); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default HelpModal;
