// src/components/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, onSearch, value }) => {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 text-slate-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
      />
    </div>
  );
};

export default SearchBar;
