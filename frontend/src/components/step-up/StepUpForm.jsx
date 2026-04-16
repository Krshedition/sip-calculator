import React from 'react';
import { SliderInput } from '../shared/SliderInput';
import { FundSearch } from '../sip-calculator/FundSearch';

export function StepUpForm({ params, onChange }) {
  return (
    <div className="card h-full">
      <h2 className="text-xl font-bold mb-6">Step-Up Details</h2>
      
      <FundSearch
        selectedFund={params.selectedFund}
        onSelect={(fund) => onChange({ selectedFund: fund })}
      />

      <SliderInput
        label="Initial Monthly Investment"
        value={params.monthlyAmount}
        onChange={(val) => onChange({ monthlyAmount: val })}
        min={500}
        max={100000}
        step={500}
        prefix="₹"
        formatValue={(val) => `₹${val.toLocaleString('en-IN')}`}
      />

      <SliderInput
        label="Annual Step-Up"
        value={params.stepUpPercent}
        onChange={(val) => onChange({ stepUpPercent: val })}
        min={1}
        max={50}
        step={1}
        suffix="%"
        formatValue={(val) => `${val}%/yr`}
      />

      <SliderInput
        label="Time Period"
        value={params.years}
        onChange={(val) => onChange({ years: val })}
        min={1}
        max={40}
        step={1}
        suffix="Yr"
        formatValue={(val) => `${val} Yr`}
      />
    </div>
  );
}
