import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/formatCurrency';

export function SaveLoadPanel({ currentData, onLoad }) {
    // Each object saved has: id, timestamp, type, name, data
    const [savedList, setSavedList] = useLocalStorage('sip_wealth_saves', []);
    const [saveName, setSaveName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = () => {
        if (!currentData || !saveName.trim()) return;

        const newItem = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            name: saveName.trim(),
            data: currentData
        };

        setSavedList([...savedList, newItem]);
        setSaveName('');
        setIsOpen(false);
    };

    const handleDelete = (id) => {
        setSavedList(savedList.filter(item => item.id !== id));
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="secondary-btn text-sm px-3 py-1.5 flex items-center gap-2 w-auto"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save / Load
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface shadow-xl border border-slate-200 dark:border-dark-border rounded-lg p-4 z-20">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white">Saved Scenarios</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Save Section */}
                    {currentData ? (
                        <div className="mb-4 flex gap-2">
                            <input 
                                type="text"
                                placeholder="Enter name to save..."
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                className="flex-1 block w-full px-3 py-1.5 border border-slate-300 dark:border-dark-border rounded-md text-sm bg-slate-50 dark:bg-dark-bg focus:ring-primary-500 focus:border-primary-500 dark:text-white"
                            />
                            <button 
                                onClick={handleSave}
                                disabled={!saveName.trim()}
                                className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium disabled:opacity-50 hover:bg-primary-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 italic">No active scenario to save.</p>
                    )}

                    {/* List Section */}
                    <div className="max-h-60 overflow-y-auto pr-1">
                        {savedList.length === 0 ? (
                            <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">No saved scenarios yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {savedList.slice().reverse().map(item => (
                                    <div key={item.id} className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm text-slate-900 dark:text-white truncate pr-2">{item.name}</span>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition focus:outline-none"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    onLoad(item.data);
                                                    setIsOpen(false);
                                                }}
                                                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
                                            >
                                                Load →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
