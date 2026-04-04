
import React from 'react';
import { SearchIcon, XIcon } from './Icons';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Buscar negocios, productos...', 
  value = '', 
  onChange,
  onClick 
}) => {
  return (
    <div className="relative transition-colors duration-300" onClick={onClick}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
      </div>
      <input
        type="text"
        className="w-full bg-gray-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-full py-4 pl-12 pr-10 text-gray-700 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-yellow-400/20 focus:border-blue-500 dark:focus:border-yellow-400 transition-all shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!!onClick && !onChange}
      />
      {value && onChange && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
        >
          <XIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
