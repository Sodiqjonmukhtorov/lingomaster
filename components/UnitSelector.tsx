
import React from 'react';
import { Unit, Language } from '../types';
import { t } from '../translations';

interface UnitSelectorProps {
  units: Unit[];
  onSelect: (unit: Unit) => void;
  lang: Language;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ units, onSelect, lang }) => {
  const text = t[lang];
  
  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {units.map((unit) => (
          <div 
            key={unit.id}
            onClick={() => onSelect(unit)}
            className="group relative bg-blue-600 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border-2 md:border-4 border-blue-500 shadow-xl hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-24 h-24 md:w-36 md:h-36 bg-white/10 rounded-full flex items-center justify-center opacity-40 group-hover:scale-150 transition-transform duration-1000">
                <span className="text-4xl md:text-7xl mt-2 mr-2 md:mt-4 md:mr-4">{unit.icon}</span>
            </div>
            <div className="relative z-10 flex-1">
              <span className="inline-block px-3 py-1 md:px-5 md:py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-4 md:mb-8">
                {unit.id.toUpperCase()}
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4 group-hover:text-emerald-300 transition-colors leading-tight uppercase tracking-tighter italic">
                {unit.title.split(': ')[1] || unit.title}
              </h3>
              <p className="text-emerald-400 text-sm md:text-xl font-bold mb-8 md:mb-14 opacity-90 italic">
                {unit.words.length} {text.essentialWords}
              </p>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-full py-4 md:py-6 px-6 md:px-10 bg-slate-950 text-white rounded-2xl md:rounded-[2.5rem] font-black text-xs md:text-sm group-hover:bg-white group-hover:text-blue-700 transition-all shadow-2xl uppercase tracking-[0.2em] active:scale-95">
                {text.startLearning}
                <span className="ml-3 md:ml-4 group-hover:translate-x-3 transition-transform text-xl md:text-2xl">➔</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitSelector;
