import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { StepUpForm } from '../components/step-up/StepUpForm';
import { StepUpResults } from '../components/step-up/StepUpResults';
import { useStepUpCalculator } from '../hooks/useStepUpCalculator';

export function StepUpPage() {
    const { params, updateParams, results } = useStepUpCalculator(5000, 10, 10);

    return (
        <PageContainer title="Step-Up SIP Calculator">
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
                Increase your SIP amount every year by a fixed percentage. Stepping up your investment matching your income growth can drastically reduce the time needed to reach financial independence.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col">
                    <StepUpForm params={params} onChange={updateParams} />
                </div>
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {!params.selectedFund ? (
                       <div className="card h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 bg-transparent dark:border-slate-700">
                           <h2 className="text-2xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Select a Mutual Fund</h2>
                           <p className="text-slate-500 max-w-md">Search and select a mutual fund from the left panel to simulate real historical step-up returns.</p>
                       </div>
                    ) : (
                       <StepUpResults result={results} />
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
