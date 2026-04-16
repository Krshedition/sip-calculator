import React from 'react';
import { InputField } from './InputField';

export function SliderInput({ label, value, onChange, min, max, step = 1, prefix, suffix, formatValue }) {
  
  const handleInputChange = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = min;
    if (val > max) val = max;
    onChange(val);
  };

  const handleSliderChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="mb-6">
      <InputField
        label={label}
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        prefix={prefix}
        suffix={suffix}
      />
      <div className="mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary-600"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
           <span>{formatValue ? formatValue(min) : min}</span>
           <span>{formatValue ? formatValue(max) : max}</span>
        </div>
      </div>
    </div>
  );
}
