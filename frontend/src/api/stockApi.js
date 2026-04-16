import axios from 'axios';

let apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
// Ensure the base URL ends with /api if it doesn't already
if (apiBaseUrl !== '/api' && !apiBaseUrl.endsWith('/api')) {
  apiBaseUrl = apiBaseUrl.replace(/\/$/, '') + '/api';
}

// Create a configured axios instance pointing to the proxy or remote backend
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000, // 30 seconds
});

export const searchStocks = async (query) => {
    const response = await apiClient.get('/search', { params: { q: query } });
    return response.data;
};

export const fetchTimeSeries = async (symbol, exchange, startDate, endDate) => {
    const response = await apiClient.get('/time-series', {
        params: {
            symbol,
            exchange,
            start_date: startDate,
            end_date: endDate
        }
    });
    return response.data;
};

export const fetchQuote = async (symbol, exchange) => {
    const response = await apiClient.get('/quote', {
        params: { symbol, exchange }
    });
    return response.data;
};

export const calculateServerXirr = async (cashFlows) => {
    const response = await apiClient.post('/xirr', { cash_flows: cashFlows });
    return response.data;
};
