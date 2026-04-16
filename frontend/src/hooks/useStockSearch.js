import { useState, useEffect } from 'react';
import { searchStocks } from '../api/stockApi';

export function useStockSearch(debounceMs = 300) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || query.trim().length === 0) {
            setResults([]);
            return;
        }

        const handler = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchStocks(query.trim());
                setResults(data.results || []);
            } catch (err) {
                // If its a 429 rate limit, provide a clean message
                if (err.response?.status === 429) {
                    setError("API limit reached. Please wait a moment.");
                } else if (err.response?.data?.detail) {
                     setError(err.response.data.detail);
                } else {
                    setError("Failed to fetch stocks.");
                }
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => clearTimeout(handler);
    }, [query, debounceMs]);

    return { query, setQuery, results, loading, error };
}
