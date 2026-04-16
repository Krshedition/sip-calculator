import React, { useState, useEffect, useRef } from 'react';

export function FundSearch({ selectedFund, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }
    
    // Don't search if the query is just the selected fund name (from an initial load or selection)
    if (selectedFund && query === selectedFund.schemeName && !isOpen) {
        return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to fetch funds", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Set initial text if a fund is pre-selected
  useEffect(() => {
     if (selectedFund && !query) {
         setQuery(selectedFund.schemeName);
     }
  }, [selectedFund]);

  const handleSelect = (fund) => {
    setQuery(fund.schemeName);
    setIsOpen(false);
    onSelect(fund);
  };

  const handleChange = (e) => {
      setQuery(e.target.value);
      setIsOpen(true);
      if (selectedFund && e.target.value !== selectedFund.schemeName) {
          onSelect(null); // Clear selected if they start typing something else
      }
  };

  return (
    <div className="mb-6 relative" ref={wrapperRef}>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Search Mutual Fund
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          placeholder="e.g. SBI Small Cap..."
          value={query}
          onChange={handleChange}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
        {isLoading && (
          <div className="absolute right-3 top-3.5">
             <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((fund) => (
            <li
              key={fund.schemeCode}
              className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
              onClick={() => handleSelect(fund)}
            >
              {fund.schemeName}
            </li>
          ))}
        </ul>
      )}
      
      {isOpen && query.length >= 3 && !isLoading && results.length === 0 && (
         <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 text-center text-slate-500 text-sm">
             No funds found.
         </div>
      )}
    </div>
  );
}
