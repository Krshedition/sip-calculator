import React from 'react';
import { SliderInput } from '../shared/SliderInput';
import { FundSearch } from './FundSearch';

export function SipForm({ params, onChange }) {
  return (
    <div className="card h-full">
      <h2 className="text-xl font-bold mb-6">Investment Details</h2>
      
      <FundSearch
        selectedFund={params.selectedFund}
        onSelect={(fund) => onChange({ selectedFund: fund })}
      />

      <SliderInput
        label="Monthly Investment"
        value={params.monthlyAmount}
        onChange={(val) => onChange({ monthlyAmount: val })}
        min={100}
        max={1000000}
        step={100}
        prefix="₹"
        formatValue={(val) => `₹${val.toLocaleString('en-IN')}`}
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
