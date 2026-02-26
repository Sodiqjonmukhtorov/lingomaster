
import React, { useState, useEffect } from 'react';
import { Word, Language } from '../types';
import { t } from '../translations';

interface MatchGameProps {
  words: Word[];
  onExit: () => void;
  lang: Language;
}

interface Tile {
  id: string;
  text: string;
  type: 'en' | 'uz';
  wordId: string;
}

const MatchGame: React.FC<MatchGameProps> = ({ words, onExit, lang }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const textDict = t[lang];

  const GAME_SIZE = 8;

  useEffect(() => {
    const subset = [...words].sort(() => Math.random() - 0.5).slice(0, GAME_SIZE);
    const newTiles: Tile[] = [];
    subset.forEach(w => {
      newTiles.push({ id: `en-${w.id}`, text: w.en, type: 'en', wordId: w.id });
      newTiles.push({ id: `uz-${w.id}`, text: w.uz, type: 'uz', wordId: w.id });
    });
    setTiles(newTiles.sort(() => Math.random() - 0.5));

    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [words]);

  useEffect(() => {
    if (matchedIds.size === GAME_SIZE) {
      setIsFinished(true);
    }
  }, [matchedIds]);

  const handleTileClick = (tile: Tile) => {
    if (matchedIds.has(tile.wordId)) return;
    if (selected?.id === tile.id) {
      setSelected(null);
      return;
    }

    if (!selected) {
      setSelected(tile);
    } else {
      if (selected.wordId === tile.wordId && selected.type !== tile.type) {
        setMatchedIds(prev => new Set(prev).add(tile.wordId));
        setSelected(null);
      } else {
        setSelected(tile);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center p-12 bg-white rounded-[3rem] shadow-2xl max-w-lg mx-auto text-center border-4 border-blue-50 animate-fadeIn">
        <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase italic tracking-tighter">{textDict.congrats} ⚡</h2>
        <div className="text-6xl font-black text-blue-600 my-6">{timer}s</div>
        <button 
          onClick={onExit}
          className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all w-full shadow-xl"
        >
          {textDict.backToMenu}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
        <button 
          onClick={onExit} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-xs font-black transition uppercase tracking-widest flex items-center gap-2"
        >
          ✕ {textDict.exit}
        </button>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-blue-600 bg-blue-50 px-6 py-2 rounded-2xl shadow-inner">
            {timer}s
          </div>
        </div>
        <div className="text-slate-400 font-black text-xs uppercase tracking-widest">
          {textDict.matched}: {matchedIds.size} / {GAME_SIZE}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {tiles.map((tile) => {
          const isMatched = matchedIds.has(tile.wordId);
          const isSelected = selected?.id === tile.id;

          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              disabled={isMatched}
              className={`
                h-28 md:h-36 p-4 rounded-[1.5rem] border-4 transition-all duration-300 text-xs md:text-sm font-black uppercase tracking-tight flex items-center justify-center text-center leading-none
                ${isMatched ? 'opacity-0 scale-75 pointer-events-none' : ''}
                ${isSelected 
                  ? 'bg-blue-600 border-blue-500 text-white scale-105 shadow-2xl z-10' 
                  : 'bg-white border-slate-50 text-slate-700 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
                }
              `}
            >
              {tile.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MatchGame;
