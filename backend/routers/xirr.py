# backend/routers/xirr.py
"""
POST /api/xirr

Computes the XIRR (Extended Internal Rate of Return) for a SIP simulation.

XIRR is the annualised return rate that makes the net present value of all
cash flows equal zero. It is a much more accurate measure of investment
return than simple absolute-return %, because it accounts for the timing
of each investment.

This endpoint does NOT call Twelve Data — all computation is local.
It is therefore NOT rate-limited (no API credits consumed).

Request body:
    {
      "cash_flows": [
        { "date": "2020-01-01", "amount": -5000 },
        { "date": "2020-02-01", "amount": -5000 },
        ...
        { "date": "2025-04-15", "amount": 185000 }   ← final portfolio value
      ]
    }

Response:
    {
      "xirr": 0.1847,
      "xirr_percent": "18.47%"
    }

Convention:
    - Investment (money going out): NEGATIVE amount
    - Redemption / portfolio value (money coming in): POSITIVE amount
"""

from datetime import date as Date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator, model_validator

from services.xirr_calculator import calculate_xirr, CashFlow

router = APIRouter(prefix="/api", tags=["XIRR"])


# ── Request / Response models ────────────────────────────────────────────────

class CashFlowItem(BaseModel):
    """A single cash flow entry from the frontend."""

    date: Date          # ISO date string, e.g. "2020-01-01"
    amount: float       # negative = investment, positive = redemption

    @field_validator("amount")
    @classmethod
    def amount_not_zero(cls, v: float) -> float:
        if v == 0:
            raise ValueError("Cash flow amount cannot be zero.")
        return v


class XIRRRequest(BaseModel):
    """Full XIRR calculation request payload."""

    cash_flows: list[CashFlowItem]

    @model_validator(mode="after")
    def validate_cash_flows(self) -> "XIRRRequest":
        if len(self.cash_flows) < 2:
            raise ValueError(
                "At least 2 cash flows are required: "
                "one or more investments (negative) and one redemption (positive)."
            )
        return self


class XIRRResponse(BaseModel):
    """XIRR calculation result."""

    xirr: float         # decimal rate, e.g. 0.1847
    xirr_percent: str   # human-readable, e.g. "18.47%"


# ── Route ────────────────────────────────────────────────────────────────────

@router.post("/xirr", response_model=XIRRResponse)
async def compute_xirr(body: XIRRRequest) -> XIRRResponse:
    """
    Compute annualised XIRR for a SIP investment series.

    Uses Newton-Raphson iteration (tolerance=1e-7, max 100 iterations).
    Not rate-limited — computation is entirely local, no API credits used.
    """

    # Convert Pydantic models to the NamedTuple expected by xirr_calculator
    cash_flows: list[CashFlow] = [
        CashFlow(date=item.date, amount=item.amount)
        for item in body.cash_flows
    ]

    # ── Compute XIRR ───────────────────────────────────────────────────
    try:
        result = calculate_xirr(cash_flows)
    except ValueError as e:
        # Invalid input — tell the client what's wrong
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
    except RuntimeError as e:
        # Algorithm didn't converge — unusual but possible for exotic cash flows
        raise HTTPException(
            status_code=422,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error during XIRR calculation: {str(e)}",
        )

    return XIRRResponse(xirr=result.xirr, xirr_percent=result.xirr_percent)
