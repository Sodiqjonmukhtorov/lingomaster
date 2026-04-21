import React, { useState } from 'react';
import { Language, Tense } from '../types';
import { t } from '../translations';
import { TENSE_DATA } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface TenseGameProps {
  lang: Language;
  onExit: () => void;
}

const TenseGame: React.FC<TenseGameProps> = ({ lang, onExit }) => {
  const [selectedTense, setSelectedTense] = useState<Tense | null>(null);
  const text = t[lang];

  return (
    <div className="w-full min-h-[80vh] bg-[#0f172a] rounded-[40px] mt-12 mb-12 flex flex-col overflow-hidden shadow-2xl animate-fadeIn relative">
      {/* HEADER */}
      <div className="p-8 md:p-12 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
            English Tenses
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
            Master the 12 basic tenses
          </p>
        </div>
        <button 
          onClick={onExit} 
          className="text-white/50 hover:text-white transition-all text-xl font-black uppercase tracking-widest"
        >
          ✕ {text.exit}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TENSE_DATA.map((tense, index) => (
            <motion.button
              key={tense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTense(tense)}
              className="group bg-white/5 border border-white/10 p-8 rounded-3xl text-left hover:bg-white/10 hover:border-indigo-500/50 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full -z-10 group-hover:bg-indigo-500/20 transition-colors"></div>
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
                Tense {index + 1}
              </span>
              <h3 className="text-white text-2xl font-black uppercase tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                {tense.title}
              </h3>
            </motion.button>
          ))}
        </div>
      </div>

      {/* TENSE DETAIL MODAL */}
      <AnimatePresence>
        {selectedTense && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e293b] w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative"
            >
              <button 
                onClick={() => setSelectedTense(null)}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>

              <div className="p-10 md:p-16">
                <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.5em] mb-4 block">
                  Detailed View
                </span>
                <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-12">
                  {selectedTense.title}
                </h2>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-4">Formula</h4>
                    <div className="bg-black/30 p-8 rounded-2xl border border-white/5 min-h-[80px] flex items-center">
                      <p className="text-indigo-300 text-2xl font-mono italic whitespace-pre-wrap">
                        {selectedTense.formula || 'Content will be added soon...'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-4">Example</h4>
                      <div className="bg-black/30 p-8 rounded-2xl border border-white/5 min-h-[80px]">
                        <p className="text-white text-xl font-bold italic whitespace-pre-wrap">
                          {selectedTense.example || 'Content will be added soon...'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-4">Usage</h4>
                      <div className="bg-black/30 p-8 rounded-2xl border border-white/5 min-h-[80px]">
                        <p className="text-slate-400 text-lg font-medium leading-relaxed whitespace-pre-wrap">
                          {selectedTense.description || 'Content will be added soon...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={() => setSelectedTense(null)}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}} />
    </div>
  );
};

export default TenseGame;
