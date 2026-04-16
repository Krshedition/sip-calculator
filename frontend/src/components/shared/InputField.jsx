import React from 'react';

export function InputField({ label, value, onChange, type = 'number', min, max, prefix, suffix, error }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              {prefix}
            </span>
          </div>
        )}
        <input
          type={type}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className={`block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-slate-300 dark:border-dark-border rounded-md dark:bg-dark-bg dark:text-white transition-colors
            ${prefix ? 'pl-7' : 'pl-3'} 
            ${suffix ? 'pr-12' : 'pr-3'}
            ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : ''}
          `}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              {suffix}
            </span>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
