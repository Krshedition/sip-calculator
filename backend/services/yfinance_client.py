"""
YFinance client wrapper.
Replaces Twelve Data to provide free historical data and quotes for Indian and US markets.
"""

import httpx
import yfinance as yf
import asyncio
from typing import List, Dict

class YFinanceClient:
    """Wrapper around yfinance and Yahoo Finance Search API."""
    
    async def search_symbols(self, query: str, output_size: int = 10) -> dict:
        """Search for stock symbols using Yahoo Finance autocomplete API."""
        url = "https://query2.finance.yahoo.com/v1/finance/search"
        params = {"q": query, "quotesCount": output_size, "newsCount": 0}
        headers = {"User-Agent": "Mozilla/5.0"}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for quote in data.get("quotes", []):
                if quote.get("quoteType") not in ["EQUITY", "ETF", "MUTUALFUND", "INDEX"]:
                    continue
                    
                results.append({
                    "symbol": quote.get("symbol"),
                    "name": quote.get("shortname", quote.get("longname", "Unknown")),
                    "exchange": quote.get("exchDisp", quote.get("exchange", "Unknown")),
                    "country": quote.get("country", "Unknown"),
                    "type": quote.get("quoteType")
                })
            
            return {"results": results[:output_size]}

    def get_time_series(self, symbol: str, start_date: str = None, end_date: str = None) -> dict:
        """Fetch monthly OHLC time series data using yfinance (Blocking call, run in thread)."""
        ticker = yf.Ticker(symbol)
        
        try:
            # yfinance expects date strings in YYYY-MM-DD
            # Using interval="1mo" to match the simulator's monthly frequency
            df = ticker.history(start=start_date, end=end_date, interval="1mo", auto_adjust=True)
        except Exception as e:
            raise Exception(f"yfinance failed to fetch data: {str(e)}")
            
        if df.empty:
            return {"values": []}
            
        values = []
        for date, row in df.iterrows():
            # Sometimes month end dates get returned slightly differently, we extract YYYY-MM-DD
            dt_str = date.strftime("%Y-%m-%d")
            values.append({
                "datetime": dt_str,
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
            })
            
        return {"values": values}

    def get_quote(self, symbol: str) -> dict:
        """Get current quote for a symbol using yfinance (Blocking call, run in thread)."""
        ticker = yf.Ticker(symbol)
        try:
            info = ticker.fast_info
            price = info.last_price
            prev_close = info.previous_close
            change = price - prev_close
            percent_change = (change / prev_close) * 100 if prev_close else 0.0
            
            return {
                "symbol": symbol,
                "name": symbol, # fast_info doesn't easily return name, symbol is fine
                "price": price,
                "previous_close": prev_close,
                "change": change,
                "percent_change": percent_change
            }
        except Exception as e:
             raise Exception(f"Failed to fetch quote using yfinance: {e}")
