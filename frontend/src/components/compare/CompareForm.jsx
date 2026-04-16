import React, { useState } from 'react';
import { StockSearch } from '../stock-simulator/StockSearch';
import { InputField } from '../shared/InputField';
import { SliderInput } from '../shared/SliderInput';

export function CompareForm({ onCompare, loading }) {
    const [selectedStocks, setSelectedStocks] = useState([]);
    const [sipAmount, setSipAmount] = useState(5000);
    const [startDate, setStartDate] = useState('2020-01-01');
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

    const handleAddStock = (stock) => {
        // Prevent dupes and max 3
        if (selectedStocks.length >= 3) return;
        if (selectedStocks.find(s => s.symbol === stock.symbol)) return;
        setSelectedStocks([...selectedStocks, stock]);
    };

    const handleRemove = (symbol) => {
        setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedStocks.length > 0 && sipAmount > 0 && startDate && endDate) {
            onCompare(selectedStocks, sipAmount, startDate, endDate);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 className="text-xl font-bold mb-6">Compare Stocks</h2>
            
            <div className="mb-6">
                <StockSearch onSelect={handleAddStock} />
                
                {/* Selected Stocks Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedStocks.map(stock => (
                        <div key={stock.symbol} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-800 text-sm">
                            <span className="font-semibold">{stock.symbol}</span>
                            <button type="button" onClick={() => handleRemove(stock.symbol)} className="text-primary-400 hover:text-primary-600 dark:hover:text-primary-200 focus:outline-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {selectedStocks.length === 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">No stocks selected (Max 3)</p>
                    )}
                </div>
            </div>

            <SliderInput
                label="Monthly SIP Amount"
                value={sipAmount}
                onChange={setSipAmount}
                min={500}
                max={100000}
                step={500}
                prefix="₹"
                formatValue={(val) => `₹${val.toLocaleString('en-IN')}`}
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
                <InputField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate}
                />
                <InputField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>

            <button 
                type="submit" 
                className="primary-btn relative"
                disabled={selectedStocks.length === 0 || loading}
            >
               {loading ? 'Running Comparison...' : 'Compare Performance'}
            </button>
        </form>
    );
}
