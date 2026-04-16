import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { ThemeContext } from '../../context/ThemeContext';

export function GrowthChart({ yearlyData }) {
  const { isDark } = useContext(ThemeContext);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-surface p-3 border border-slate-200 dark:border-dark-border shadow-lg rounded-md text-sm">
          <p className="font-bold text-slate-900 dark:text-white mb-2">Year {label}</p>
          <div className="space-y-1">
             <p className="text-[#22c55e]">Total Value: <span className="font-medium">{formatCurrency(payload[1]?.value || 0)}</span></p>
             <p className="text-[#64748b]">Invested: <span className="font-medium">{formatCurrency(payload[0]?.value || 0)}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (tickItem) => {
    if (tickItem >= 10000000) return `₹${(tickItem / 10000000).toFixed(1)}Cr`;
    if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(1)}L`;
    if (tickItem >= 1000) return `₹${(tickItem / 1000).toFixed(0)}k`;
    return `₹${tickItem}`;
  };

  return (
    <div className="card h-[400px]">
        <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-4">Portfolio Growth</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            data={yearlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
               <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
               </linearGradient>
               <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
               </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="year" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatYAxis} stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            {/* Render total value area behind invested area */}
            <Area type="monotone" dataKey="value" name="Total Value" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            <Area type="monotone" dataKey="invested" name="Invested Amount" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
          </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}
