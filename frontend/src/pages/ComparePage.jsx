import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { CompareForm } from '../components/compare/CompareForm';
import { CompareChart } from '../components/compare/CompareChart';
import { ErrorAlert } from '../components/shared/ErrorAlert';
import { fetchTimeSeries } from '../api/stockApi';
import { formatCurrency } from '../utils/formatCurrency';

export function ComparePage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comparisonData, setComparisonData] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [summary, setSummary] = useState([]);

    const handleCompare = async (selectedStocks, monthlyAmount, startDate, endDate) => {
        setLoading(true);
        setError(null);
        setComparisonData([]);
        setSymbols([]);
        setSummary([]);

        try {
            // Fetch data for all selected stocks concurrently
            const promises = selectedStocks.map(stock => 
                fetchTimeSeries(stock.symbol, stock.exchange, startDate, endDate).catch(err => {
                     // Catch individual failures so one bad stock doesn't ruin the whole batch
                     console.error(`Failed to fetch ${stock.symbol}`, err);
                     return { symbol: stock.symbol, error: true };
                })
            );

            const results = await Promise.all(promises);
            
            const validResults = results.filter(r => !r.error && r.data && r.data.length > 0);
            if (validResults.length === 0) {
                 throw new Error("Could not fetch historical data for any of the selected stocks in this date range.");
            }

            const syms = validResults.map(r => r.symbol);
            setSymbols(syms);

            // Group data by date
            // Create a master set of all dates available across all valid stocks
            const dateSet = new Set();
            validResults.forEach(r => {
                r.data.forEach(d => dateSet.add(d.date));
            });
            const sortedDates = Array.from(dateSet).sort();

            const mergedData = [];
            const runningTotals = {};
            const runningUnits = {};
            
            syms.forEach(sym => {
                runningTotals[sym] = { invested: 0, units: 0 };
                runningUnits[sym] = 0;
            });

            // Initialize summary tracking
            const summaryData = validResults.map(r => ({
                symbol: r.symbol,
                name: selectedStocks.find(s => s.symbol === r.symbol)?.name,
                totalInvested: 0,
                finalValue: 0,
                absoluteReturn: 0
            }));

            sortedDates.forEach(date => {
                const row = { date };
                let globalInvested = 0; // We'll just track one invested line since it's the same sipAmount

                validResults.forEach(r => {
                    const symbol = r.symbol;
                    // Find if this stock traded on this month
                    const point = r.data.find(d => d.date === date);
                    
                    if (point && point.close > 0) {
                         const unitsBought = monthlyAmount / point.close;
                         runningTotals[symbol].units += unitsBought;
                         runningTotals[symbol].invested += monthlyAmount;
                    }
                    
                    // Value is total units * current close (or previous close if no data point for this month)
                    // (Simplified: if no data point, we just don't grow it this month or we use last known value in a real app. 
                    // Here we'll skip adding a value if price is completely unknown, or we could interpolate.
                    // For simplicity, let's only chart months where we have a price, or carry forward!)
                    
                    // Actually, Twelve Data returns data month by month. If a stock was listed later, it won't have early dates.
                    if (runningTotals[symbol].units > 0) {
                         // Find latest price up to this date
                         const pastPoints = r.data.filter(d => d.date <= date);
                         const latestPrice = pastPoints.length > 0 ? pastPoints[pastPoints.length - 1].close : 0;
                         row[`val_${symbol}`] = Math.round(runningTotals[symbol].units * latestPrice);
                    } else {
                         row[`val_${symbol}`] = 0;
                    }

                    // Just take any stock's invested amount as the baseline since they all invest exactly `monthlyAmount` same time
                    // But wait, if a stock wasn't listed, we shouldn't have invested in it.
                    // To keep the chart simple, we assume "Invested Amount" line is just `months * sipAmount`
                });

                // Calculate a generic invested amount based on elapsed months since start
                const monthsElapsed = mergedData.length + 1;
                row.invested = monthsElapsed * monthlyAmount;

                mergedData.push(row);
            });

            // Build summary
            summaryData.forEach(sum => {
                 const totals = runningTotals[sum.symbol];
                 const lastRow = mergedData[mergedData.length - 1];
                 sum.totalInvested = totals.invested;
                 sum.finalValue = lastRow[`val_${sum.symbol}`] || 0;
                 if (sum.totalInvested > 0) {
                      sum.absoluteReturn = ((sum.finalValue - sum.totalInvested) / sum.totalInvested) * 100;
                 }
            });
            // Sort summary by highest return
            summaryData.sort((a,b) => b.absoluteReturn - a.absoluteReturn);

            setComparisonData(mergedData);
            setSummary(summaryData);

        } catch (err) {
             setError(err.message || "An error occurred during comparison.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title="Compare Stocks">
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
                Compare the historical SIP performance of up to 3 stocks side-by-side to see which would have yielded better returns over the same period.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-4 flex flex-col">
                    <CompareForm onCompare={handleCompare} loading={loading} />
                    {error && <ErrorAlert message={error} />}
                </div>

                <div className="lg:col-span-8 flex flex-col">
                    {loading && (
                        <div className="card h-64 flex items-center justify-center">
                             <div className="text-center">
                                 <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                 <p className="text-slate-500 dark:text-slate-400">Fetching data and comparing...</p>
                             </div>
                        </div>
                    )}

                    {!loading && comparisonData.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                               {summary.map((s, index) => (
                                   <div key={s.symbol} className={`p-4 rounded-lg border ${index === 0 ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                             <span className="font-bold dark:text-white truncate" title={s.name}>{s.symbol}</span>
                                             {index === 0 && <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100 px-2 py-0.5 rounded-full font-medium">Winner</span>}
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Value: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(s.finalValue)}</span></p>
                                        <p className={`text-sm font-bold ${s.absoluteReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {s.absoluteReturn >= 0 ? '+' : ''}{s.absoluteReturn.toFixed(2)}%
                                        </p>
                                   </div>
                               ))}
                            </div>
                            <CompareChart data={comparisonData} symbols={symbols} />
                        </>
                    )}

                    {!loading && comparisonData.length === 0 && !error && (
                         <div className="card h-full flex items-center justify-center border-dashed border-2 bg-transparent text-center p-8">
                             <div>
                                 <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                 </svg>
                                 <h3 className="text-lg font-medium text-slate-900 dark:text-white">Compare side-by-side</h3>
                                 <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add up to 3 stocks and run to compare growth trajectories.</p>
                             </div>
                         </div>
                    )}
                </div>

            </div>
        </PageContainer>
    );
}
