from datetime import datetime
import asyncio
from fastapi import APIRouter, HTTPException, Query
from services.yfinance_client import YFinanceClient

router = APIRouter(prefix="/api", tags=["Time Series"])
_client = YFinanceClient()
_DATE_FORMAT = "%Y-%m-%d"

def _parse_date(value: str, field_name: str) -> datetime:
    try:
        return datetime.strptime(value, _DATE_FORMAT)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"'{field_name}' must be in YYYY-MM-DD format (got '{value}').",
        )

@router.get("/time-series")
async def get_time_series(
    symbol: str = Query(..., min_length=1, max_length=20),
    exchange: str = Query("NSE", min_length=2, max_length=10),
    start_date: str = Query(...),
    end_date: str = Query(...),
):
    start_dt = _parse_date(start_date, "start_date")
    end_dt = _parse_date(end_date, "end_date")

    if start_dt >= end_dt:
        raise HTTPException(status_code=400, detail="'start_date' must be strictly before 'end_date'.")

    # To query Yahoo Finance for Indian stocks, append .NS or .BO
    yf_symbol = symbol.upper()
    if exchange.upper() == "NSE" and not yf_symbol.endswith(".NS"):
        yf_symbol += ".NS"
    elif exchange.upper() == "BSE" and not yf_symbol.endswith(".BO"):
        yf_symbol += ".BO"

    try:
        raw = await asyncio.to_thread(
            _client.get_time_series,
            symbol=yf_symbol,
            start_date=start_date,
            end_date=end_date,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Unexpected error fetching time series: {str(e)}")

    values = raw.get("values", [])
    if not values:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for '{symbol}' between {start_date} and {end_date}."
        )

    if len(values) < 3:
        raise HTTPException(
            status_code=422,
            detail=f"Only {len(values)} month(s) of data found. Plase widen the date range."
        )

    # Values from yfinance are missing 'volume' here or might have it, but our simulator mainly needs 'close' and 'date'
    monthly_data = []
    for point in values:
        close = point.get("close")
        if close is None or close <= 0:
            continue

        monthly_data.append({
            "date": point.get("datetime"),
            "open": point.get("open"),
            "high": point.get("high"),
            "low": point.get("low"),
            "close": close,
            "volume": 0
        })

    if not monthly_data:
        raise HTTPException(status_code=404, detail="All closing prices were missing or zero.")

    return {
        "symbol": symbol.upper(),
        "exchange": exchange.upper(),
        "total_months": len(monthly_data),
        "data": monthly_data,
    }
