
import React, { useState } from 'react';
import { Unit } from '../types';
import { t } from '../translations';

interface ExamUnitSelectorProps {
  units: Unit[];
  lang: 'uz' | 'en';
  onStart: (selectedUnits: Unit[], onlySingleWords: boolean) => void;
  onCancel: () => void;
}

const ExamUnitSelector: React.FC<ExamUnitSelectorProps> = ({ units, lang, onStart, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(units.map(u => u.id));
  const [onlySingleWords, setOnlySingleWords] = useState(false);
  const text = t[lang];

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

    if (onlySingleWords) {
      const singleWordsCount = selected.flatMap(u => u.words).filter(w => !w.en.trim().includes(' ')).length;
      if (singleWordsCount === 0) {
        alert(lang === 'uz' ? "Tanlangan bo'limlarda bittalik so'zlar topilmadi!" : "No single words found in selected units!");
        return;
      }
    }

    onStart(selected, onlySingleWords);
  };

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

          <div className="flex-1"></div>

          <button 
            onClick={() => setOnlySingleWords(!onlySingleWords)}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
              onlySingleWords 
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-100' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'
            }`}
          >
            <span>{onlySingleWords ? '✅' : '⭕'}</span>
            {lang === 'uz' ? "Faqat bittalik so'zlar" : "Single Words Only"}
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
          {onlySingleWords 
            ? (lang === 'uz' ? "Tanlangan bo'limlardan faqat bittalik so'zlar (20 ta tasodifiy)" : "Only single words from selected units (20 random)")
            : (lang === 'uz' ? "Tanlangan bo'limlardan 20 ta tasodifiy savol" : "20 random questions from selected units")
          }
        </p>
      </div>
    </div>
  );
};

export default ExamUnitSelector;
