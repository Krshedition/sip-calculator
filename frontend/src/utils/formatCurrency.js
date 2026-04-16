/**
 * Format a number as Indian Currency (₹)
 * Uses the Indian numbering system (lakhs, crores)
 * @param {number} amount
 * @returns {string} Formatted string e.g., ₹1,23,45,678
 */
export function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
    
    // Use Intl.NumberFormat for robust formatting
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(amount);
}
