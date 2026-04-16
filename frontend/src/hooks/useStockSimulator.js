import React, { useState, useCallback } from 'react';
import { fetchTimeSeries, fetchQuote, calculateServerXirr } from '../api/stockApi';

export function useStockSimulator() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const simulateSIP = async (stock, monthlyAmount, startDate, endDate) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // 1. Fetch History
            const histData = await fetchTimeSeries(stock.symbol, stock.exchange, startDate, endDate);
            
            // 2. Fetch Quote (Current Price)
            const quoteData = await fetchQuote(stock.symbol, stock.exchange);
            const currentPrice = parseFloat(quoteData.price);

            // 3. Client Side Simulation Loop
            let totalUnits = 0;
            let totalInvested = 0;
            const monthlyLog = [];
            const growthData = [];
            const cashFlows = [];

            for (const { date, close } of histData.data) {
                if (!close || close <= 0) continue;
                
                const unitsBought = monthlyAmount / close;
                totalUnits += unitsBought;
                totalInvested += monthlyAmount;
                const runningValue = totalUnits * close;

                monthlyLog.push({
                   date,
                   price: close,
                   unitsBought: parseFloat(unitsBought.toFixed(4)),
                   totalUnits: parseFloat(totalUnits.toFixed(4)),
                   invested: totalInvested,
                   value: Math.round(runningValue),
                });

                growthData.push({
                   date,
                   invested: totalInvested,
                   value: Math.round(runningValue),
                });

                cashFlows.push({ date, amount: -monthlyAmount });
            }

            if (totalInvested === 0) {
                 throw new Error("No valid price data found in this range to simulate SIP.");
            }

            const currentValue = Math.round(totalUnits * currentPrice);
            const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
            
            const today = new Date().toISOString().split("T")[0];
            cashFlows.push({ date: today, amount: currentValue });

            // 4. Calculate XIRR using Server
            let xirrPercent = "N/A";
            try {
                 const xirrRes = await calculateServerXirr(cashFlows);
                 xirrPercent = xirrRes.xirr_percent;
            } catch (xe) {
                 console.error("XIRR Calculation failed:", xe);
            }

            setResult({
                 stock,
                 totalInvested,
                 currentValue,
                 totalUnits: parseFloat(totalUnits.toFixed(4)),
                 absoluteReturnPercent: parseFloat(absoluteReturn.toFixed(2)),
                 xirrPercent,
                 monthlyLog,
                 growthData,
                 currentPrice
            });

        } catch (err) {
            console.error("Simulation Error", err);
             if (err.response?.status === 429) {
                 setError("API limit reached. Please wait 60 seconds.");
            } else if (err.response?.data?.detail) {
                 setError(err.response.data.detail);
            } else {
                 setError(err.message || "Simulation failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return { simulateSIP, result, loading, error };
}
