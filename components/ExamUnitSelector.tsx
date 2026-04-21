
import React, { useState } from 'react';
import { Unit } from '../types';
import { t } from '../translations';

interface ExamUnitSelectorProps {
  units: Unit[];
  lang: 'uz' | 'en';
  onStart: (selectedUnits: Unit[], filterMode: 'all' | 'strict') => void;
  onCancel: () => void;
}

const ExamUnitSelector: React.FC<ExamUnitSelectorProps> = ({ units, lang, onStart, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(units.map(u => u.id));
  const [filterMode, setFilterMode] = useState<'all' | 'strict'>('all');
  const [isListView, setIsListView] = useState(false);
  const text = t[lang];

  const getStrictSingleWordsCount = (words: any[]) => words.filter(w => !w.en.trim().includes(' ') && !w.en.includes('-')).length;

  const totalWordsInSelected = units
    .filter(u => selectedIds.includes(u.id))
    .reduce((acc, u) => {
      if (filterMode === 'strict') return acc + getStrictSingleWordsCount(u.words);
      return acc + u.words.length;
    }, 0);

  const toggleUnit = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectRange = (start: number, end: number) => {
    const rangeIds = units.slice(start - 1, end).map(u => u.id);
    setSelectedIds(rangeIds);
  };

  const selectAll = () => {
    setSelectedIds(units.map(u => u.id));
  };

  const handleStart = () => {
    const selected = units.filter(u => selectedIds.includes(u.id));
    if (selected.length === 0) {
      alert(lang === 'uz' ? "Kamida bitta bo'limni tanlang!" : "Select at least one unit!");
      return;
    }

    if (filterMode !== 'all') {
      const wordsCount = selected.flatMap(u => u.words).filter(w => {
        return !w.en.trim().includes(' ') && !w.en.includes('-');
      }).length;

      if (wordsCount === 0) {
        alert(lang === 'uz' ? "Tanlangan bo'limlarda mos so'zlar topilmadi!" : "No matching words found in selected units!");
        return;
      }
    }

    onStart(selected, filterMode);
  };

  const getFilteredWords = () => {
    const selected = units.filter(u => selectedIds.includes(u.id));
    return selected.flatMap(u => u.words).filter(w => {
      if (filterMode === 'strict') return !w.en.trim().includes(' ') && !w.en.includes('-');
      return true;
    });
  };

  if (isListView) {
    const filteredWords = getFilteredWords();
    return (
      <div className="w-full max-w-4xl mx-auto py-8 animate-fadeIn px-4">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border-4 border-indigo-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic">
              {lang === 'uz' ? `So'zlar ro'yxati (${filteredWords.length})` : `Word List (${filteredWords.length})`}
            </h2>
            <button onClick={() => setIsListView(false)} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
              {lang === 'uz' ? 'Orqaga' : 'Back'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto px-2 py-4 custom-scrollbar">
             {filteredWords.map((word, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 transition-all">
                   <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg font-black text-[10px] shrink-0">{idx + 1}</span>
                   <div className="overflow-hidden">
                      <div className="font-black text-slate-800 uppercase tracking-tight text-sm truncate">{word.en}</div>
                      <div className="text-slate-500 font-bold italic text-xs truncate">{word.uz}</div>
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
             <button 
               onClick={handleStart}
               className="w-full bg-rose-600 text-white py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest hover:bg-rose-700 transition-all shadow-2xl shadow-rose-100 active:scale-95"
             >
               {lang === 'uz' ? "Shu ro'yxatdan imtihon boshlash" : "Start Exam from this list"} 🚀
             </button>
             <button onClick={() => setIsListView(false)} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition">
                {lang === 'uz' ? "Sozlamalarga qaytish" : "Back to settings"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 animate-fadeIn px-4">
      <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border-4 border-indigo-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic">
            {lang === 'uz' ? "Imtihon bo'limlarini tanlang" : "Select Exam Units"}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-800 font-black transition">✕</button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button 
            onClick={selectAll}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            {lang === 'uz' ? "Barchasi (ALL)" : "Select All"}
          </button>
          <button 
            onClick={() => selectRange(1, 5)}
            className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-200 transition-all"
          >
            Units 1-5
          </button>
          <button 
            onClick={() => selectRange(6, 24)}
            className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-200 transition-all"
          >
            Units 6-24
          </button>

          <button 
            onClick={() => setIsListView(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
          >
            <span>📜</span>
            {lang === 'uz' ? "Ro'yxatni ko'rish" : "View List"}
          </button>

          <div className="flex-1"></div>

          <button 
            onClick={() => setFilterMode(filterMode === 'strict' ? 'all' : 'strict')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
              filterMode === 'strict' 
                ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-100' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200'
            }`}
          >
            <span>{filterMode === 'strict' ? '✨' : '⭕'}</span>
            {lang === 'uz' ? "Sof 1-lik so'zlar" : "Pure Words"}
            {filterMode === 'strict' && <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-lg text-[10px]">{totalWordsInSelected}</span>}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {units.map((unit, index) => (
            <button
              key={unit.id}
              onClick={() => toggleUnit(unit.id)}
              className={`p-6 rounded-3xl border-4 transition-all flex items-center gap-4 text-left group ${
                selectedIds.includes(unit.id) 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-100' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200'
              }`}
            >
              <span className={`text-2xl transition-transform group-hover:scale-125 ${selectedIds.includes(unit.id) ? '' : 'grayscale'}`}>
                {unit.icon}
              </span>
              <div>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedIds.includes(unit.id) ? 'text-indigo-200' : 'text-slate-300'}`}>
                  Unit {index + 1}
                </div>
                <div className="font-black text-sm uppercase tracking-tight leading-none">
                  {unit.title.split(': ')[1] || unit.title}
                </div>
                <div className={`text-[9px] font-bold mt-1 ${selectedIds.includes(unit.id) ? 'text-indigo-100/80' : 'text-slate-400'}`}>
                  {getStrictSingleWordsCount(unit.words)} {lang === 'uz' ? "ta so'z" : "words"}
                </div>
              </div>
              <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedIds.includes(unit.id) ? 'bg-white border-white text-indigo-600' : 'border-slate-200'
              }`}>
                {selectedIds.includes(unit.id) && <span className="text-[10px]">✓</span>}
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-rose-600 text-white py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest hover:bg-rose-700 transition-all shadow-2xl shadow-rose-100 active:scale-95"
        >
          {lang === 'uz' ? "Imtihonni boshlash" : "Start Exam"} 🚀
        </button>
        
        <p className="mt-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          {filterMode === 'strict' && (lang === 'uz' ? `Sof bir bo'lakli so'zlar (Chiziqcha va bo'sh joylarsiz) (Jami: ${totalWordsInSelected}, 20 tasodifiy)` : `Pure single words (No hyphens/spaces) (Total: ${totalWordsInSelected}, 20 random)`)}
          {filterMode === 'all' && (lang === 'uz' ? "Tanlangan bo'limlardan 20 ta tasodifiy savol" : "20 random questions from selected units")}
        </p>
      </div>
    </div>
  );
};

export default ExamUnitSelector;
