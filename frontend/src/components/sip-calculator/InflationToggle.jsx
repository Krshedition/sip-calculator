import React from 'react';
import { SliderInput } from '../shared/SliderInput';

export function InflationToggle({ enabled, onToggle, rate, onRateChange }) {
  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inflation Adjustment</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">See your returns in today's purchasing power.</p>
        </div>
        
        {/* Toggle Switch */}
        <button 
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-surface ${enabled ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {enabled && (
        <div className="pt-2">
            <SliderInput
                label="Expected Inflation Rate"
                value={rate}
                onChange={onRateChange}
                min={1}
                max={15}
                step={0.1}
                suffix="%"
                formatValue={(val) => `${val}%`}
            />
        </div>
      )}
    </div>
  );
}
