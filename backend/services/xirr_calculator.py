# backend/services/xirr_calculator.py
"""
XIRR (Extended Internal Rate of Return) calculator.

XIRR is the annualised return rate `r` that makes the sum of the
discounted cash flows equal zero:

    NPV(r) = Σ  CF_i / (1 + r)^((t_i - t_0) / 365)  =  0

Because this has no closed-form solution, we solve it numerically using
the Newton-Raphson method:

    r_{n+1} = r_n  -  f(r_n) / f'(r_n)

We iterate until |r_{n+1} - r_n| < tolerance  or we hit max_iterations.

The derivative of NPV with respect to r is:

    NPV'(r) = Σ  -CF_i * (t_i - t_0)/365 / (1 + r)^((t_i - t_0)/365 + 1)
"""

from datetime import date as Date
from typing import NamedTuple


class CashFlow(NamedTuple):
    """A single cash-flow event."""

    date: Date      # date of the cash flow
    amount: float   # positive = inflow (redemption), negative = outflow (investment)


class XIRRResult(NamedTuple):
    xirr: float           # decimal form, e.g. 0.1847
    xirr_percent: str     # human-readable, e.g. "18.47%"


# ------------------------------------------------------------------
# Public calculation function
# ------------------------------------------------------------------

def calculate_xirr(
    cash_flows: list[CashFlow],
    guess: float = 0.1,
    max_iterations: int = 100,
    tolerance: float = 1e-7,
) -> XIRRResult:
    """
    Compute XIRR via Newton-Raphson iteration.

    Args:
        cash_flows:     List of CashFlow(date, amount). Investments should be
                        negative; the final redemption value should be positive.
        guess:          Initial rate guess (default 10 %).
        max_iterations: Safety cap on iterations to prevent infinite loops.
        tolerance:      Convergence threshold — stop when Δr < tolerance.

    Returns:
        XIRRResult(xirr=0.1847, xirr_percent="18.47%")

    Raises:
        ValueError: Invalid inputs (< 2 flows, all same sign, bad dates).
        RuntimeError: Algorithm did not converge after max_iterations.
    """

    # ── 1. Validate ────────────────────────────────────────────────────────
    if len(cash_flows) < 2:
        raise ValueError(
            "At least 2 cash flows are required "
            "(one or more investments + one redemption value)."
        )

    amounts = [cf.amount for cf in cash_flows]
    if all(a >= 0 for a in amounts):
        raise ValueError(
            "All amounts are non-negative. "
            "Investments must be negative (money going out)."
        )
    if all(a <= 0 for a in amounts):
        raise ValueError(
            "All amounts are non-positive. "
            "Include the final portfolio value as a positive cash flow."
        )

    # ── 2. Sort chronologically and compute day-offsets ───────────────────
    sorted_flows = sorted(cash_flows, key=lambda cf: cf.date)
    base_date: Date = sorted_flows[0].date

    # Pre-compute the year-fractions (t_i - t_0) / 365 for every flow.
    # Using a list here avoids recomputing them on every iteration.
    year_fractions = [
        (cf.date - base_date).days / 365.0
        for cf in sorted_flows
    ]

    # ── 3. Define NPV and its derivative ──────────────────────────────────
    def npv(rate: float) -> float:
        """Net present value at the given rate."""
        total = 0.0
        for cf, yf in zip(sorted_flows, year_fractions):
            # Guard: (1 + r)^yf — r must be > -1 to stay in real numbers
            total += cf.amount / ((1.0 + rate) ** yf)
        return total

    def npv_derivative(rate: float) -> float:
        """First derivative of NPV with respect to rate."""
        total = 0.0
        for cf, yf in zip(sorted_flows, year_fractions):
            if yf == 0:
                # Base date cash flow: derivative term is zero
                continue
            # d/dr [ CF / (1+r)^yf ] = -CF * yf / (1+r)^(yf+1)
            total += (-cf.amount * yf) / ((1.0 + rate) ** (yf + 1.0))
        return total

    # ── 4. Newton-Raphson loop ────────────────────────────────────────────
    rate = guess
    for iteration in range(max_iterations):
        f_val = npv(rate)
        f_deriv = npv_derivative(rate)

        # Guard against division by zero (flat derivative region)
        if abs(f_deriv) < 1e-12:
            raise RuntimeError(
                f"XIRR derivative became zero at iteration {iteration}. "
                "Try a different initial guess."
            )

        new_rate = rate - (f_val / f_deriv)

        # Convergence check
        if abs(new_rate - rate) < tolerance:
            rate = new_rate
            break

        rate = new_rate
    else:
        # Loop completed without break → did not converge
        raise RuntimeError(
            f"XIRR did not converge after {max_iterations} iterations. "
            f"Last estimate: {rate:.6f}. "
            "The cash flow pattern may not have a real-number XIRR solution."
        )

    return XIRRResult(
        xirr=round(rate, 6),
        xirr_percent=f"{rate * 100:.2f}%",
    )
