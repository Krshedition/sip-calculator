import React, { useState } from 'react';
import { StockSearch } from './StockSearch';
import { InputField } from '../shared/InputField';
import { SliderInput } from '../shared/SliderInput';

export function SimulatorForm({ onSimulate, loading }) {
    const [selectedStock, setSelectedStock] = useState(null);
    const [sipAmount, setSipAmount] = useState(5000);
    const [startDate, setStartDate] = useState('2020-01-01');
    
    // Default end date is today
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedStock && sipAmount > 0 && startDate && endDate) {
            onSimulate(selectedStock, sipAmount, startDate, endDate);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 className="text-xl font-bold mb-6">Simulation Parameters</h2>
            
            <StockSearch onSelect={setSelectedStock} />

            {selectedStock && (
                <div className="mb-6 p-3 bg-primary-50 border border-primary-100 rounded-md dark:bg-primary-900/10 dark:border-primary-800">
                    <p className="text-sm font-medium text-primary-800 dark:text-primary-300">
                        Selected: <span className="font-bold">{selectedStock.name}</span> ({selectedStock.symbol})
                    </p>
                </div>
            )}

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
                disabled={!selectedStock || loading}
            >
               {loading ? 'Running Simulation...' : 'Run Simulation'}
            </button>
        </form>
    );
}
