import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IRREGULAR_VERBS } from '../data';
import { Language } from '../types';
import IrregularTrainer from './IrregularTrainer';

interface IrregularVerbsViewProps {
  lang: Language;
  onExit: () => void;
}

const IrregularVerbsView: React.FC<IrregularVerbsViewProps> = ({ lang, onExit }) => {
  const [isTraining, setIsTraining] = useState(false);

  if (isTraining) {
    return <IrregularTrainer lang={lang} onExit={() => setIsTraining(false)} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-white rounded-none md:rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-fadeIn relative mb-20 md:mt-4">
      <header className="px-6 py-6 md:px-10 md:py-8 border-b border-slate-50 bg-white flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-600 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-rose-100 italic font-black text-white">
            V
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">
              Irregular Verbs
            </h1>
            <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></span>
              {lang === 'uz' ? '3 xil shakli va tarjimasi' : '3 forms and translation'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsTraining(true)}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg active:scale-95"
          >
             <span>⚡</span> {lang === 'uz' ? 'MASHQ QILISH' : 'START TRAINING'}
          </button>
          <button 
            onClick={onExit}
            className="p-2 md:p-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all border border-slate-100 active:scale-90"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#FBFBFE]">
        <div className="md:hidden mb-6">
           <button 
            onClick={() => setIsTraining(true)}
            className="w-full py-5 bg-rose-600 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
             <span>⚡</span> {lang === 'uz' ? 'MASHQ QILISH' : 'TRAINING GAME'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IRREGULAR_VERBS.map((verb, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-rose-200 transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                    Verb {idx + 1}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                    <span className="text-[7px] font-black text-blue-400 uppercase mb-1">V1</span>
                    <span className="text-sm md:text-base font-black text-blue-700 italic tracking-tight uppercase leading-none">{verb.v1.split(' ')[0]}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
                    <span className="text-[7px] font-black text-amber-400 uppercase mb-1">V2</span>
                    <span className="text-sm md:text-base font-black text-amber-700 italic tracking-tight uppercase leading-none">{verb.v2.split('/')[0]}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                    <span className="text-[7px] font-black text-emerald-400 uppercase mb-1">V3</span>
                    <span className="text-sm md:text-base font-black text-emerald-700 italic tracking-tight uppercase leading-none">{verb.v3}</span>
                  </div>
                </div>

                <div className="mt-2 p-4 bg-slate-900 rounded-2xl shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-[2rem]"></div>
                   <h4 className="text-white/40 font-black uppercase tracking-[0.3em] text-[7px] mb-2">Translation</h4>
                   <p className="text-white text-sm md:text-base font-bold italic tracking-tight leading-snug">
                     {verb.uz}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <div className="p-8 md:p-12 border-t border-slate-50 flex justify-center bg-white sticky bottom-0 z-10">
         <button 
          onClick={onExit}
          className="w-full md:w-auto px-16 py-6 bg-slate-900 hover:bg-rose-600 text-white rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95"
         >
           {lang === 'uz' ? 'Bosh sahifaga qaytish' : 'Back to Home'}
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}} />
    </div>
  );
};

export default IrregularVerbsView;
