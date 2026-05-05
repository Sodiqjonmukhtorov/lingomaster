import React, { useState } from 'react';
import { Language, Tense } from '../types';
import { t } from '../translations';
import { TENSE_DATA } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface TenseGameProps {
  lang: Language;
  onExit: () => void;
}

const TenseGame: React.FC<TenseGameProps> = ({ lang, onExit }) => {
  const [selectedTense, setSelectedTense] = useState<Tense | null>(null);
  const text = t[lang];

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[60vh] bg-white rounded-none md:rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-fadeIn relative mb-20 md:mt-4">
      {/* HEADER */}
      <header className="px-6 py-6 md:px-10 md:py-8 border-b border-slate-50 bg-white flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-indigo-100 italic font-black text-white">
            T
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">
              Tense Master
            </h1>
            <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
              {lang === 'uz' ? 'O\'rgatuvchi' : 'Curriculum'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onExit}
          className="p-2 md:p-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all border border-slate-100 active:scale-90"
        >
          <span className="text-sm font-bold">✕</span>
        </button>
      </header>

      {/* TENSE GROUPS - COMPACT GRID */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#FBFBFE]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TENSE_DATA_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-1 mb-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${group.color.replace('text-', 'bg-')}`}></div>
                 <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.35em] italic">
                   {group.name}
                 </h2>
              </div>

              <div className="flex flex-col gap-3">
                {group.items.map((tense, idx) => (
                  <motion.button
                    key={tense.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (groupIdx * 4 + idx) * 0.03 }}
                    onClick={() => setSelectedTense(tense)}
                    className="group relative w-full bg-white border border-slate-100 p-4 md:p-5 rounded-2xl text-left hover:border-indigo-400 hover:shadow-lg transition-all active:scale-[0.97]"
                  >
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        LEVEL {idx + 1}
                      </span>
                      <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">
                        {tense.title}
                      </h3>
                      <div className="mt-2 text-[9px] font-mono text-indigo-400/80 uppercase truncate">
                        {tense.formula.split('\n')[0]}
                      </div>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      →
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* DETAIL DRAWER - FULL SCREEN & COLORFUL */}
      <AnimatePresence>
        {selectedTense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ y: "15%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "15%", opacity: 0 }}
              className="w-full h-full flex flex-col"
            >
              {/* MODAL HEADER */}
              <div className="px-6 py-4 md:px-12 md:py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg">
                     {selectedTense.id.charAt(0).toUpperCase()}
                   </div>
                   <h2 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                     {selectedTense.title}
                   </h2>
                </div>
                <button 
                  onClick={() => setSelectedTense(null)}
                  className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm"
                >
                  ✕
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="flex-1 overflow-y-auto p-6 md:p-16 scroll-smooth bg-[#FDFEFE]">
                <div className="max-w-4xl mx-auto space-y-10">
                  
                  {/* FORMULA HIGHLIGHT */}
                  <section className="relative p-6 md:p-10 bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border-4 md:border-6 border-indigo-500 overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="relative">
                      <h4 className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[8px] mb-6 opacity-60">Structure Diagram</h4>
                      <div className="space-y-3">
                        {selectedTense.formula.split('\n').map((line, lIdx) => (
                           <div key={lIdx} className="flex items-center justify-center gap-3">
                              <span className="text-white text-lg md:text-3xl font-black italic tracking-tighter uppercase">{line.replace('Subject', 'S').replace('Verb', 'V')}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* RICH CONTENT */}
                  <section className="markdown-body px-2 md:px-8">
                    <Markdown components={{
                      h3: ({children}) => <h3 className="text-rose-500 font-black tracking-tighter text-lg md:text-xl mt-12 mb-6 uppercase italic border-b border-rose-100 pb-2">{children}</h3>,
                      p: ({children}) => {
                        const content = children?.toString() || '';
                         if (content.includes('⚠️')) return <div className="p-5 md:p-6 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-r-2xl font-bold text-sm md:text-base my-6"><span className="mr-2">🚨</span> {children}</div>;
                         if (content.includes('🔥')) return <div className="p-5 md:p-6 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-2xl font-black italic text-base md:text-lg my-6 shadow-sm"><span className="mr-2">⚡</span> {children}</div>;
                         if (content.includes('✅')) return <div className="px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black italic inline-flex items-center gap-3 mb-6 shadow-md"><span className="text-xl">✨</span> {children}</div>;
                         if (content.includes('👉')) return <div className="font-black text-indigo-600 text-base md:text-xl mt-8 mb-4 border-b border-indigo-50 pb-2 italic leading-none">{children}</div>;
                        return <p className="text-sm md:text-base leading-relaxed text-slate-600 font-bold mb-4">{children}</p>;
                      },
                      strong: ({children}) => <span className="text-emerald-600 font-black underline decoration-emerald-200 underline-offset-4">{children}</span>,
                      ul: ({children}) => <ul className="space-y-3 my-6 list-none pl-1">{children}</ul>,
                      li: ({children}) => <li className="flex items-start gap-3 text-slate-700 font-bold text-sm">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-none shadow-sm"></div>
                        <div className="flex-1">{children}</div>
                      </li>,
                      code: ({children}) => <code className="bg-slate-100 text-rose-600 px-2 py-0.5 rounded-lg font-mono text-xs font-black border border-slate-200 mx-0.5">{children}</code>,
                      table: ({children}) => <div className="overflow-x-auto my-8 rounded-2xl border border-slate-100 shadow-sm"><table className="w-full text-left">{children}</table></div>,
                      thead: ({children}) => <thead className="bg-slate-900 text-white uppercase tracking-widest text-[8px] font-black">{children}</thead>,
                      th: ({children}) => <th className="px-5 py-3">{children}</th>,
                      td: ({children}) => <td className="px-5 py-3 text-slate-800 font-bold text-xs border-b border-slate-50 italic">{children}</td>,
                    }}>
                      {selectedTense.description}
                    </Markdown>
                  </section>

                  {/* EXAMPLE BLOCK */}
                  <div className="p-8 md:p-16 bg-slate-50 rounded-[3rem] border border-slate-200 mb-20">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                        <h4 className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px]">Real World Context</h4>
                        <div className="h-0.5 flex-1 bg-slate-200 hidden md:block"></div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTense.example.split('\n').map((ex, i) => (
                           <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-400 transition-all group cursor-default">
                             <p className="text-slate-800 font-black text-lg md:text-2xl italic tracking-tight group-hover:text-indigo-600 transition-colors">"{ex}"</p>
                           </div>
                        ))}
                     </div>
                  </div>

                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 md:p-10 border-t border-slate-50 bg-white flex justify-center sticky bottom-0 z-10">
                 <button 
                  onClick={() => setSelectedTense(null)}
                  className="w-full md:w-auto px-16 py-6 bg-indigo-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] transition-all shadow-2xl shadow-indigo-200 active:scale-95"
                 >
                    {lang === 'uz' ? 'Tushundim, Master!' : 'Mastered it!'}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        
        .markdown-body a { color: #4F46E5 !important; font-weight: 800; text-decoration: none; }
        .markdown-body a:hover { text-decoration: underline; }
        .markdown-body strong { color: #1E293B; font-weight: 900 !important; }
      `}} />
    </div>
  );
};

const TENSE_DATA_GROUPS = [
  {
    name: "Present (Hozir)",
    items: TENSE_DATA.slice(0, 4),
    color: "bg-indigo-600"
  },
  {
    name: "Past (O'tgan)",
    items: TENSE_DATA.slice(4, 8),
    color: "bg-rose-500"
  },
  {
    name: "Future (Kelajak)",
    items: TENSE_DATA.slice(8, 12),
    color: "bg-amber-500"
  }
];

export default TenseGame;

