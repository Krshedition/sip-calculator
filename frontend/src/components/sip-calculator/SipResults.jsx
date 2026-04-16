import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { adjustForInflation } from '../../utils/sipFormula';

export function SipResults({ totalInvested, estimatedReturns, maturityValue, inflationEnabled, inflationRate, years }) {
  
  const displayMaturity = inflationEnabled 
    ? adjustForInflation(maturityValue, inflationRate, years)
    : maturityValue;

  const displayReturns = inflationEnabled
    ? displayMaturity - totalInvested
    : estimatedReturns;

  return (
    <div className="card h-full flex flex-col justify-center animate-pop-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        
        <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Maturity Value {inflationEnabled && '(Real)'}</h3>
           <p className="text-3xl md:text-4xl animated-value">{formatCurrency(displayMaturity)}</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Invested</h3>
           <p className="text-xl md:text-2xl font-bold dark:text-white">{formatCurrency(totalInvested)}</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Est. Returns</h3>
           <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-500">{formatCurrency(displayReturns)}</p>
        </div>

      </div>
    </div>
  );
}
