import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { ThemeContext } from '../../context/ThemeContext';

export function CompareChart({ data, symbols }) {
    const { isDark } = useContext(ThemeContext);

    if (!data || data.length === 0 || !symbols || symbols.length === 0) return null;

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b']; // Green, Blue, Amber

    const formatYAxis = (tickItem) => {
         if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(1)}L`;
         if (tickItem >= 1000) return `₹${(tickItem / 1000).toFixed(0)}k`;
         return `₹${tickItem}`;
    };

    const formatXAxis = (tickItem) => {
         const date = new Date(tickItem);
         return date.getFullYear();
    };

    const CustomTooltip = ({ active, payload, label }) => {
         if (active && payload && payload.length) {
           return (
             <div className="bg-white dark:bg-dark-surface p-3 border border-slate-200 dark:border-dark-border shadow-lg rounded-md text-sm">
               <p className="font-bold text-slate-900 dark:text-white mb-2">{label}</p>
               <div className="space-y-1">
                   {/* Invested is the last payload item usually because of Line order, but let's find it explicitly or just use the first item's invested amount since it's the same for all */}
                   <p className="text-slate-500 mb-2">Invested: <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(payload[0]?.payload.invested || 0)}</span></p>
                   {payload.map((entry, index) => {
                       if (entry.dataKey === 'invested') return null;
                       return (
                           <p key={index} style={{ color: entry.color }}>
                               <span className="font-medium">{entry.name}:</span> {formatCurrency(entry.value)}
                           </p>
                       );
                   })}
               </div>
             </div>
           );
         }
         return null;
     };

    return (
        <div className="card h-[500px] animate-pop-in">
             <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-4">SIP Multi-Stock Comparison</h3>
             <ResponsiveContainer width="100%" height="90%">
                 {/* Using LineChart as it's cleaner for >2 overlapping series than AreaChart */}
                 <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                     <XAxis 
                         dataKey="date" 
                         tickFormatter={formatXAxis} 
                         stroke={isDark ? '#94a3b8' : '#64748b'} 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false} 
                         minTickGap={30}
                     />
                     <YAxis 
                         tickFormatter={formatYAxis} 
                         stroke={isDark ? '#94a3b8' : '#64748b'} 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false} 
                         width={60} 
                     />
                     <Tooltip content={<CustomTooltip />} />
                     <Legend verticalAlign="top" height={36} />
                     
                     <Line type="monotone" dataKey="invested" name="Invested Amount" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                     
                     {symbols.map((symbol, index) => (
                          <Line 
                              key={symbol}
                              type="monotone" 
                              dataKey={`val_${symbol}`} 
                              name={symbol} 
                              stroke={COLORS[index % COLORS.length]} 
                              strokeWidth={2} 
                              dot={false}
                              activeDot={{ r: 6 }} 
                          />
                     ))}
                 </LineChart>
             </ResponsiveContainer>
        </div>
    );
}
