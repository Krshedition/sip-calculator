import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';

export function StepUpResults({ result }) {
   const { isDark } = React.useContext(ThemeContext);

   if (!result) return null;

   const formatYAxis = (tickItem) => {
        if (tickItem >= 10000000) return `₹${(tickItem / 10000000).toFixed(1)}Cr`;
        if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(1)}L`;
        if (tickItem >= 1000) return `₹${(tickItem / 1000).toFixed(0)}k`;
        return `₹${tickItem}`;
   };

   const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white dark:bg-dark-surface p-3 border border-slate-200 dark:border-dark-border shadow-lg rounded-md text-sm">
              <p className="font-bold text-slate-900 dark:text-white mb-2">Year {label}</p>
              <div className="space-y-1">
                 <p className="text-[#f59e0b]">Value: <span className="font-medium">{formatCurrency(payload[1]?.value || 0)}</span></p>
                 <p className="text-[#64748b]">Invested: <span className="font-medium">{formatCurrency(payload[0]?.value || 0)}</span></p>
                 <p className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-200 dark:border-dark-border">
                    Monthly SIP this year: {formatCurrency(payload[0]?.payload.monthlyAmount || 0)}
                 </p>
              </div>
            </div>
          );
        }
        return null;
    };

   return (
       <div className="flex flex-col gap-6 h-full animate-pop-in">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-center">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Maturity Value</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(result.maturityValue)}</p>
               </div>
               <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Invested</p>
                    <p className="text-xl font-bold dark:text-white">{formatCurrency(result.totalInvested)}</p>
               </div>
               <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Est. Returns</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-500">{formatCurrency(result.estimatedReturns)}</p>
               </div>
           </div>

           <div className="card flex-grow h-[400px]">
               <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-4">Accelerated Growth Curve</h3>
               <ResponsiveContainer width="100%" height="90%">
                   <AreaChart data={result.yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                       <defs>
                           <linearGradient id="colorStepValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorStepInvested" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                           </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                       <XAxis dataKey="year" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis tickFormatter={formatYAxis} stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} width={60} />
                       <Tooltip content={<CustomTooltip />} />
                       <Legend verticalAlign="top" height={36} />
                       <Area type="monotone" dataKey="value" name="Total Value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorStepValue)" />
                       <Area type="stepAfter" dataKey="invested" name="Invested Amount" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorStepInvested)" />
                   </AreaChart>
               </ResponsiveContainer>
           </div>
       </div>
   );
}
