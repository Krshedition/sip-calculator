import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export function MonthlyBreakdown({ monthlyLog }) {
    const [expanded, setExpanded] = useState(false);

    if (!monthlyLog || monthlyLog.length === 0) return null;

    return (
        <div className="card">
            <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full flex justify-between items-center focus:outline-none"
            >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Breakdown ({monthlyLog.length} months)</h3>
                <svg 
                    className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {expanded && (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-dark-border">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Close Price</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Units Bought</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Units</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invested</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-surface divide-y divide-slate-200 dark:divide-dark-border">
                            {monthlyLog.map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">{log.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-300">{formatCurrency(log.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-300">{log.unitsBought}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-300 font-medium">{log.totalUnits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-300">{formatCurrency(log.invested)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
