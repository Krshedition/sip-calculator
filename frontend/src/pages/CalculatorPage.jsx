import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SipForm } from '../components/sip-calculator/SipForm';
import { SipResults } from '../components/sip-calculator/SipResults';
import { DonutChart } from '../components/sip-calculator/DonutChart';
import { GrowthChart } from '../components/sip-calculator/GrowthChart';
import { InflationToggle } from '../components/sip-calculator/InflationToggle';
import { useSipCalculator } from '../hooks/useSipCalculator';

export function CalculatorPage() {
  const { params, updateParams, results } = useSipCalculator(5000, 12, 10);
  const [inflationEnabled, setInflationEnabled] = useState(false);
  const [inflationRate, setInflationRate] = useState(6); // Default 6% inflation

  return (
    <PageContainer title="SIP Calculator">
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
        Estimate the future value of your systematic investments. Adjust the sliders to see how small changes in amount or time can significantly impact your wealth due to the power of compounding.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 flex flex-col">
          <SipForm params={params} onChange={updateParams} />
          <InflationToggle 
              enabled={inflationEnabled} 
              onToggle={() => setInflationEnabled(!inflationEnabled)} 
              rate={inflationRate}
              onRateChange={setInflationRate}
          />
        </div>

        {/* Right Column: Visualization & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
        {!params.selectedFund ? (
           <div className="card h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 bg-transparent dark:border-slate-700">
               <h2 className="text-2xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Select a Mutual Fund</h2>
               <p className="text-slate-500 max-w-md">Search and select a mutual fund from the left panel to simulate real historical systematic investment returns.</p>
           </div>
        ) : (
           <>
             <SipResults 
                 totalInvested={results.totalInvested}
                 estimatedReturns={results.estimatedReturns}
                 maturityValue={results.maturityValue}
                 inflationEnabled={inflationEnabled}
                 inflationRate={inflationRate}
                 years={params.years}
             />
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <DonutChart invested={results.totalInvested} returns={results.estimatedReturns} />
                 <GrowthChart yearlyData={results.yearlyData} />
             </div>
           </>
        )}
        </div>

      </div>
    </PageContainer>
  );
}
