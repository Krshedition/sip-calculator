import { useState, useCallback, useEffect } from 'react';

const parseDate = (dString) => {
  const [d, m, y] = dString.split('-');
  return new Date(y, m - 1, d);
};

export function useSipCalculator(initialMonthly = 5000, initialReturn = 12, initialYears = 10) {
  const [params, setParams] = useState({
    monthlyAmount: initialMonthly,
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

    const calculateRealSip = async () => {
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

        // Data is descending (newest first). Let's parse and reverse to ascending (oldest first).
        const parsedData = data.data.map(item => ({
            dateStr: item.date,
            dateObj: parseDate(item.date),
            nav: parseFloat(item.nav)
        })).reverse();

        const latestEntry = parsedData[parsedData.length - 1];
        const latestNav = latestEntry.nav;
        const latestDate = latestEntry.dateObj;

        // Determine start date based on years selected
        let startDate = new Date(latestDate);
        startDate.setFullYear(latestDate.getFullYear() - params.years);

        // If the fund's first date is newer than the requested start date, we start from the fund's inception
        const firstAvailableDate = parsedData[0].dateObj;
        let actualStartDate = startDate > firstAvailableDate ? startDate : firstAvailableDate;

        let totalUnits = 0;
        let totalInvested = 0;
        let yearlyData = [];
        let currentInvestmentDate = new Date(actualStartDate);
        
        // Ensure month is somewhat aligned
        currentInvestmentDate.setDate(1); 

        // Simulate monthly SIPs
        const monthsToSimulate = params.years * 12;
        let yearCounter = 1;

        for (let m = 0; m < monthsToSimulate; m++) {
            if (currentInvestmentDate > latestDate) break;

            // Find nearest NAV on or right after the current investment date
            const entry = parsedData.find(d => d.dateObj >= currentInvestmentDate);
            
            if (entry) {
               const navAtThatTime = entry.nav;
               totalUnits += params.monthlyAmount / navAtThatTime;
               totalInvested += params.monthlyAmount;
               
               // Record yearly snapshot
               if ((m + 1) % 12 === 0 || m === monthsToSimulate - 1) {
                  // Only push if we completed a year or it's the last month available
                  if (!yearlyData.find(y => y.year === yearCounter)) {
                     yearlyData.push({
                         year: yearCounter,
                         invested: totalInvested,
                         value: totalUnits * navAtThatTime,
                     });
                     yearCounter++;
                  }
               }
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
        console.error("Error computing real SIP", err);
      }
    };

    calculateRealSip();

    return () => {
        isCancelled = true;
    };
  }, [params.selectedFund, params.monthlyAmount, params.years]);

  return { params, updateParams, results };
}
