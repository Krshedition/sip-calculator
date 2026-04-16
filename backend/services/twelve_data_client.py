# backend/services/twelve_data_client.py
"""
Async HTTP client wrapper for the Twelve Data market data API.

All requests are made through this class so that:
  1. The API key is injected once, here, from config — never touching frontend.
  2. Network errors and Twelve Data's own error payloads are normalised
     into Python exceptions that routers can translate to HTTP responses.
"""

import httpx
from config import settings

# Twelve Data base URL
_BASE_URL = "https://api.twelvedata.com"


class TwelveDataError(Exception):
    """Raised when Twelve Data returns an error payload inside a 200 OK."""

    def __init__(self, message: str, code: int | None = None):
        super().__init__(message)
        self.code = code


class TwelveDataClient:
    """Thin async wrapper around httpx for Twelve Data API calls."""

    def __init__(self) -> None:
        # Pull the key from settings (which reads .env)
        self._api_key = settings.TWELVE_DATA_API_KEY

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    async def _get(self, endpoint: str, params: dict) -> dict:
        """
        Perform an authenticated GET request.

        Injects the API key into every request's query params.
        Raises:
            TwelveDataError  — API returned an error inside a 200 body
            httpx.HTTPStatusError — non-2xx HTTP status from network
            httpx.TimeoutException — request took longer than 30 s
        """
        # Always attach the API key — never let it appear in frontend code
        params["apikey"] = self._api_key

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{_BASE_URL}/{endpoint}", params=params)
            response.raise_for_status()  # raises for 4xx / 5xx HTTP codes

            data: dict = response.json()

            # Twelve Data embeds errors inside 200 OK responses.
            # Example: {"code": 400, "message": "symbol not found", "status": "error"}
            if data.get("status") == "error":
                raise TwelveDataError(
                    message=data.get("message", "Unknown Twelve Data error"),
                    code=data.get("code"),
                )

            return data

    # ------------------------------------------------------------------
    # Public API methods
    # ------------------------------------------------------------------

    async def search_symbols(self, query: str, output_size: int = 10) -> dict:
        """
        Search for stock/ETF symbols matching a free-text query.

        Twelve Data endpoint: GET /symbol_search
        Docs: https://twelvedata.com/docs/discovery/symbol-search
        """
        return await self._get(
            "symbol_search",
            {
                "symbol": query,
                "outputsize": output_size,
            },
        )

    async def get_time_series(
        self,
        symbol: str,
        exchange: str = "NSE",
        interval: str = "1month",
        start_date: str | None = None,
        end_date: str | None = None,
    ) -> dict:
        """
        Fetch OHLC candlestick data for a symbol.

        Twelve Data endpoint: GET /time_series
        Docs: https://twelvedata.com/docs/market-data/time-series

        Returns data in ASCending order (oldest first) so the simulation
        loop can iterate forward through time naturally.
        """
        params: dict = {
            "symbol": symbol,
            "exchange": exchange,
            "interval": interval,
            "order": "ASC",
            # Cap at 500 bars (~42 years of monthly data) to avoid huge payloads
            "outputsize": 500,
        }
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date

        return await self._get("time_series", params)

    async def get_quote(self, symbol: str, exchange: str = "NSE") -> dict:
        """
        Fetch the latest real-time/end-of-day quote for a symbol.

        Twelve Data endpoint: GET /quote
        Docs: https://twelvedata.com/docs/market-data/quote
        """
        return await self._get(
            "quote",
            {
                "symbol": symbol,
                "exchange": exchange,
            },
        )
