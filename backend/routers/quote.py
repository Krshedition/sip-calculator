import asyncio
from fastapi import APIRouter, HTTPException, Query
from services.yfinance_client import YFinanceClient

router = APIRouter(prefix="/api", tags=["Quote"])
_client = YFinanceClient()


@router.get("/quote")
async def get_quote(
    symbol: str = Query(..., min_length=1, max_length=20),
    exchange: str = Query("NSE", min_length=2, max_length=10),
):
    yf_symbol = symbol.upper()
    if exchange.upper() == "NSE" and not yf_symbol.endswith(".NS"):
        yf_symbol += ".NS"
    elif exchange.upper() == "BSE" and not yf_symbol.endswith(".BO"):
        yf_symbol += ".BO"

    try:
        raw = await asyncio.to_thread(_client.get_quote, yf_symbol)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Unexpected error fetching quote: {str(e)}")

    price = raw.get("price", 0.0)
    if price <= 0:
        raise HTTPException(
            status_code=404,
            detail=f"No valid price data returned for '{symbol}'. Verify the symbol and exchange."
        )

    return {
        "symbol": symbol.upper(),
        "name": raw.get("name", symbol.upper()),
        "exchange": exchange.upper(),
        "currency": "INR", # Assuming INR context, since Yahoo might not return currency directly from fast_info
        "price": price,
        "previous_close": raw.get("previous_close", 0.0),
        "change": raw.get("change", 0.0),
        "percent_change": raw.get("percent_change", 0.0),
        "fifty_two_week_high": raw.get("fifty_two_week_high", 0.0),
        "fifty_two_week_low": raw.get("fifty_two_week_low", 0.0),
    }
