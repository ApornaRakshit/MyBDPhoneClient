import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-6 flex-wrap" aria-label="Breadcrumb">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#12544F] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast || !item.url ? (
              <span className="text-[#12544F] font-bold truncate max-w-xs sm:max-w-md">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.url}
                className="text-slate-500 hover:text-[#12544F] transition-colors truncate max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

