import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Word, Language } from '../types';

interface UnitWordsListProps {
  words: Word[];
  unitTitle: string;
  lang: Language;
  onExit: () => void;
  speak: (txt: string, l: 'en' | 'uz') => void;
}

const UnitWordsList: React.FC<UnitWordsListProps> = ({ words, unitTitle, lang, onExit, speak }) => {
  const [search, setSearch] = useState('');

  const filteredWords = words.filter(word => {
    const q = search.toLowerCase();
    return word.en.toLowerCase().includes(q) || word.uz.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-white rounded-none md:rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-fadeIn relative mb-20 md:mt-4">
      {/* HEADER */}
      <header className="px-6 py-6 md:px-10 md:py-8 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-emerald-100 italic font-black text-white">
            W
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">
              {unitTitle}
            </h1>
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
              {lang === 'uz' ? "Hamma so'zlar ro'yxati" : "All Words List"} ({words.length})
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'uz' ? "So'zni qidirish..." : "Search word..."}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
        </div>

        <button
          onClick={onExit}
          className="p-2 md:p-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all border border-slate-100 active:scale-90 flex items-center gap-1 text-xs font-black uppercase tracking-wider"
        >
          <span>✕</span>
        </button>
      </header>

      {/* WORDS LIST */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#FBFBFE]">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredWords.length > 0 ? (
            filteredWords.map((word, idx) => (
              <motion.div
                key={word.id || idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                className="group w-full bg-white border border-slate-100 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 hover:border-emerald-400 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Decorative Accent border */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>

                {/* Index badge */}
                <div className="flex items-center gap-4 pl-2">
                  <span className="w-6 h-6 bg-slate-50 text-slate-400 text-[10px] font-black rounded-lg flex items-center justify-center border border-slate-100 select-none">
                    {idx + 1}
                  </span>
                  <div>
                    {/* EN part - Bigger bold in Red/Purpleish/Emerald accents */}
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="text-indigo-600 font-extrabold">{word.en}</span>
                    </h3>
                  </div>
                </div>

                {/* Right side alignment with sound & translation */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 ml-8 md:ml-0">
                  {/* UZ translation in beautiful green/amber colored tag */}
                  <div className="px-4 py-2 bg-emerald-50/80 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">UZ</span>
                    <span className="text-xs md:text-sm font-bold text-slate-700 italic">
                      {word.uz}
                    </span>
                  </div>

                  {/* Sound Trigger */}
                  <button
                    onClick={() => speak(word.en, 'en')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-slate-200 active:scale-90"
                  >
                    <span>🔊</span>
                    <span>{lang === 'uz' ? "TALAFFUZ" : "PRONOUNCE"}</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                {lang === 'uz' ? "Hech qanday so'z topilmadi" : "No words found matching search"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER ACTION */}
      <footer className="p-6 md:p-8 border-t border-slate-100 bg-white flex justify-center sticky bottom-0 z-10 shadow-inner">
        <button
          onClick={onExit}
          className="w-full md:w-auto px-16 py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95"
        >
          {lang === 'uz' ? "O'YINLAR RO'YXATIGA QAYTISH" : "BACK TO UTILITIES"}
        </button>
      </footer>
    </div>
  );
};

export default UnitWordsList;
