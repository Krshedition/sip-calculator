
/**
 * Adjust a future value for inflation
 * @param {number} futureValue - Nominal future value
 * @param {number} inflationPercent - Annual inflation rate (e.g. 6 for 6%)
 * @param {number} years - Number of years
 * @returns {number} Inflation-adjusted (real) value
 */
export function adjustForInflation(futureValue, inflationPercent, years) {
  const inflationRate = inflationPercent / 100;
  return Math.round(futureValue / Math.pow(1 + inflationRate, years));
}

