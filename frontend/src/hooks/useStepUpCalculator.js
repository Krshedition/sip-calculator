import { useState, useCallback, useEffect } from 'react';

const parseDate = (dString) => {
  const [d, m, y] = dString.split('-');
  return new Date(y, m - 1, d);
};

export function useStepUpCalculator(initialMonthly = 5000, initialStepUp = 10, initialYears = 10) {
  const [params, setParams] = useState({
    monthlyAmount: initialMonthly,
    stepUpPercent: initialStepUp,
    selectedFund: null,
    years: initialYears,
  });

  const [results, setResults] = useState({
    totalInvested: 0,
    estimatedReturns: 0,
    maturityValue: 0,
    yearlyData: [],
  });

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const calculateRealStepUpSip = async () => {
      // If no fund is selected, clear everything
      if (!params.selectedFund) {
        setResults({
          totalInvested: 0,
          estimatedReturns: 0,
          maturityValue: 0,
          yearlyData: [],
        });
        return;
      }

      try {
        const res = await fetch(`https://api.mfapi.in/mf/${params.selectedFund.schemeCode}`);
        const data = await res.json();
        
        if (isCancelled) return;

        if (!data || !data.data || data.data.length === 0) {
           return;
        }

        const parsedData = data.data.map(item => ({
            dateObj: parseDate(item.date),
            nav: parseFloat(item.nav)
        })).reverse();

        const latestEntry = parsedData[parsedData.length - 1];
        const latestNav = latestEntry.nav;
        const latestDate = latestEntry.dateObj;

        let startDate = new Date(latestDate);
        startDate.setFullYear(latestDate.getFullYear() - params.years);

        const firstAvailableDate = parsedData[0].dateObj;
        let actualStartDate = startDate > firstAvailableDate ? startDate : firstAvailableDate;

        let totalUnits = 0;
        let totalInvested = 0;
        let yearlyData = [];
        let currentInvestmentDate = new Date(actualStartDate);
        currentInvestmentDate.setDate(1); 

        const monthsToSimulate = params.years * 12;
        let yearCounter = 1;
        let currentMonthlySIP = params.monthlyAmount;

        for (let m = 0; m < monthsToSimulate; m++) {
            if (currentInvestmentDate > latestDate) break;

            const entry = parsedData.find(d => d.dateObj >= currentInvestmentDate);
            
            if (entry) {
               const navAtThatTime = entry.nav;
               totalUnits += currentMonthlySIP / navAtThatTime;
               totalInvested += currentMonthlySIP;
               
               if ((m + 1) % 12 === 0 || m === monthsToSimulate - 1) {
                  if (!yearlyData.find(y => y.year === yearCounter)) {
                     yearlyData.push({
                         year: yearCounter,
                         invested: totalInvested,
                         value: totalUnits * navAtThatTime,
                         monthlyAmount: currentMonthlySIP
                     });
                     yearCounter++;
                  }
               }
            }

            // Apply step up at the end of the 12th month
            if ((m + 1) % 12 === 0) {
                currentMonthlySIP = currentMonthlySIP * (1 + (params.stepUpPercent / 100));
            }

            // advance 1 month
            currentInvestmentDate.setMonth(currentInvestmentDate.getMonth() + 1);
        }

        const maturityValue = totalUnits * latestNav;
        const estimatedReturns = maturityValue - totalInvested;

        setResults({
            totalInvested,
            maturityValue,
            estimatedReturns,
            yearlyData
        });

      } catch (err) {
        console.error("Error computing real Step-Up SIP", err);
      }
    };

    calculateRealStepUpSip();

    return () => {
        isCancelled = true;
    };
  }, [params.selectedFund, params.monthlyAmount, params.stepUpPercent, params.years]);

  return { params, updateParams, results };
}
