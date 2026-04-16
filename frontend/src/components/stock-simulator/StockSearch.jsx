import React, { useState, useRef, useEffect } from 'react';
import { useStockSearch } from '../../hooks/useStockSearch';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function StockSearch({ onSelect }) {
    const { query, setQuery, results, loading, error } = useStockSearch(400);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (stock) => {
        setQuery(stock.name);
        setIsOpen(false);
        onSelect(stock);
    };

    return (
        <div ref={wrapperRef} className="relative mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Search Stock symbol or name
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-dark-border rounded-md leading-5 bg-white dark:bg-dark-bg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g. RELIANCE, TCS"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {loading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>

            {isOpen && (query.trim().length > 0) && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-surface shadow-lg rounded-md border border-slate-200 dark:border-dark-border py-1 text-base overflow-auto max-h-60 sm:text-sm">
                    {error ? (
                        <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-red-600 dark:text-red-400">
                             {error}
                        </div>
                    ) : results.length === 0 && !loading ? (
                         <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-slate-500 dark:text-slate-400">
                            No stocks found.
                        </div>
                    ) : (
                        results.map((stock, i) => (
                            <div
                                key={`${stock.symbol}-${i}`}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"
                                onClick={() => handleSelect(stock)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium truncate">{stock.name}</span>
                                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                                        {stock.symbol} &bull; {stock.exchange}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
