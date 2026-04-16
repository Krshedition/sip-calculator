import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

export function DonutChart({ invested, returns }) {
  const data = [
    { name: 'Invested', value: invested },
    { name: 'Est. Returns', value: returns },
  ];

  const COLORS = ['#64748b', '#22c55e']; // slate-500, green-500

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-surface p-3 border border-slate-200 dark:border-dark-border shadow-lg rounded-md text-sm">
          <p className="font-medium text-slate-900 dark:text-white mb-1">{payload[0].name}</p>
          <p className="text-primary-600 dark:text-primary-400 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-[400px] flex flex-col justify-center">
        <h3 className="text-center text-slate-700 dark:text-slate-300 font-semibold mb-4">Investment Split</h3>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
