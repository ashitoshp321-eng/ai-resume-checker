import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  minScore: number;
  setMinScore: (s: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  searchQuery, setSearchQuery, minScore, setMinScore 
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center mb-6">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
          placeholder="Search by name or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <SlidersHorizontal size={18} className="text-slate-400 shrink-0" />
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Min Score:</span>
        <input
          type="range"
          min="0"
          max="100"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="w-32 md:w-40 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
        <span className="text-sm font-bold w-8 text-right text-slate-900">{minScore}%</span>
      </div>
    </div>
  );
};
