import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export function SimulatorResults({ result }) {
   if (!result) return null;

   const isPositive = result.absoluteReturnPercent >= 0;

   return (
       <div className="card mb-6 animate-pop-in">
           <div className="flex justify-between items-start mb-6">
               <div>
                   <h2 className="text-2xl font-bold dark:text-white">{result.stock.name}</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">
                      {result.stock.symbol} • Current Price: {formatCurrency(result.currentPrice)}
                   </p>
               </div>
               <div className="text-right">
                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400">XIRR (Annualized)</p>
                   <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                       {result.xirrPercent}
                   </p>
               </div>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Invested</p>
                    <p className="text-xl font-bold dark:text-white">{formatCurrency(result.totalInvested)}</p>
               </div>
               <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Value</p>
                    <p className="text-xl font-bold animated-value">{formatCurrency(result.currentValue)}</p>
               </div>
               <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Absolute Return</p>
                    <p className={`text-xl font-bold flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(result.absoluteReturnPercent)}%
                    </p>
               </div>
               <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Units</p>
                    <p className="text-xl font-bold dark:text-white">{result.totalUnits}</p>
               </div>
           </div>
       </div>
   );
}
