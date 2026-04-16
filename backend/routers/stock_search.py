from fastapi import APIRouter, HTTPException, Query
import httpx

from services.yfinance_client import YFinanceClient

router = APIRouter(prefix="/api", tags=["Stock Search"])
_client = YFinanceClient()


@router.get("/search")
async def search_stocks(
    q: str = Query(
        ...,
        min_length=1,
        max_length=50,
        description="Stock name or ticker to search for (e.g. 'reliance' or 'AAPL')",
    )
):
    try:
        raw = await _client.search_symbols(query=q.strip(), output_size=10)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Stock data provider timed out.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Unexpected error while searching stocks: {str(e)}")

    results = raw.get("results", [])
    if not results:
        return {"results": []}

    return {"results": results}
