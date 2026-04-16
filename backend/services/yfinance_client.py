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
        """Fetch monthly OHLC time series data using Yahoo API directly to bypass Vercel serverless restrictions."""
        import time
        from datetime import datetime
        
        start_ts = int(time.mktime(datetime.strptime(start_date, "%Y-%m-%d").timetuple()))
        end_ts = int(time.mktime(datetime.strptime(end_date, "%Y-%m-%d").timetuple()))
        
        url = f"https://query2.finance.yahoo.com/v8/finance/chart/{symbol}"
        params = {
            "period1": start_ts,
            "period2": end_ts,
            "interval": "1mo",
            "events": "history",
            "includeAdjustedClose": "true"
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        try:
            with httpx.Client(timeout=15.0) as client:
                res = client.get(url, params=params, headers=headers)
                res.raise_for_status()
                data = res.json()
                
            result = data.get("chart", {}).get("result")
            if not result:
                return {"values": []}
                
            timestamps = result[0].get("timestamp", [])
            indicators = result[0]["indicators"]["quote"][0]
            adjclose = result[0]["indicators"].get("adjclose", [{}])[0].get("adjclose", indicators.get("close", []))
            
            values = []
            for i, ts in enumerate(timestamps):
                if not indicators.get("open") or indicators["open"][i] is None:
                    continue
                    
                dt_str = datetime.fromtimestamp(ts).strftime("%Y-%m-%d")
                values.append({
                    "datetime": dt_str,
                    "open": float(indicators["open"][i]),
                    "high": float(indicators["high"][i]),
                    "low": float(indicators["low"][i]),
                    "close": float(adjclose[i]),
                })
            return {"values": values}
            
        except Exception as e:
            raise Exception(f"Direct Yahoo API fetch failed: {str(e)}")

    def get_quote(self, symbol: str) -> dict:
        """Get current quote for a symbol using Yahoo API directly."""
        url = f"https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124"
        }
        
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.get(url, headers=headers)
                res.raise_for_status()
                data = res.json()
                
            result = data.get("chart", {}).get("result", [])
            if not result:
                raise Exception("No quote data returned for symbol")
                
            meta = result[0].get("meta", {})
            price = meta.get("regularMarketPrice", 0.0)
            prev_close = meta.get("chartPreviousClose", price)
            change = price - prev_close
            percent_change = (change / prev_close) * 100 if prev_close else 0.0
            
            return {
                "symbol": symbol,
                "name": meta.get("shortName", symbol),
                "price": price,
                "previous_close": prev_close,
                "change": change,
                "percent_change": percent_change
            }
        except Exception as e:
             raise Exception(f"Failed to fetch quote from Yahoo API: {e}")
