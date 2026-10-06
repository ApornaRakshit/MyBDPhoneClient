import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchFilter = ({
  searchQuery = '',
  onSearchChange,
  categories = [],
  activeCategory = 'All',
  onCategoryChange,
  placeholder = 'Search articles, topics or specifications...',
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#12544F] focus:ring-2 focus:ring-[#12544F]/10 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat, idx) => {
            const isSelected = (activeCategory || 'All').toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#12544F] text-white shadow-sm shadow-[#12544F]/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

