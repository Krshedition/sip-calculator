import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SimulatorForm } from '../components/stock-simulator/SimulatorForm';
import { SimulatorResults } from '../components/stock-simulator/SimulatorResults';
import { SipGrowthChart } from '../components/stock-simulator/SipGrowthChart';
import { MonthlyBreakdown } from '../components/stock-simulator/MonthlyBreakdown';
import { useStockSimulator } from '../hooks/useStockSimulator';
import { ErrorAlert } from '../components/shared/ErrorAlert';

export function SimulatorPage() {
    const { simulateSIP, result, loading, error } = useStockSimulator();

    return (
        <PageContainer title="Stock SIP Simulator">
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
                Discover how much wealth you could have built if you systematically invested in real stocks. We fetch historical monthly closing prices and perform Rupee Cost Averaging simulation to find out actual returns.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-4 flex flex-col">
                    <SimulatorForm onSimulate={simulateSIP} loading={loading} />
                    {error && <ErrorAlert message={error} />}
                </div>

                <div className="lg:col-span-8 flex flex-col">
                    {loading && !result && (
                        <div className="card h-64 flex items-center justify-center">
                             <div className="text-center">
                                 <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                 <p className="text-slate-500 dark:text-slate-400">Fetching historical data and simulating...</p>
                             </div>
                        </div>
                    )}
                    
                    {!loading && result && (
                        <>
                            <SimulatorResults result={result} />
                            <SipGrowthChart data={result.growthData} stockName={result.stock.name} />
                            <MonthlyBreakdown monthlyLog={result.monthlyLog} />
                        </>
                    )}

                    {!loading && !result && !error && (
                         <div className="card h-full flex items-center justify-center border-dashed border-2 bg-transparent text-center p-8">
                             <div>
                                 <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                 </svg>
                                 <h3 className="text-lg font-medium text-slate-900 dark:text-white">Ready to simulate</h3>
                                 <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search for a stock and run a simulation to see the results here.</p>
                             </div>
                         </div>
                    )}
                </div>

            </div>
        </PageContainer>
    );
}
