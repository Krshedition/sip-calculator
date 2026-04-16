# backend/middleware/rate_limiter.py
"""
Sliding-window in-memory rate limiter middleware.

Protects the /api/search, /api/time-series, and /api/quote endpoints
from being spammed — each of those endpoints consumes a Twelve Data API
credit, and the free tier allows only 8 credits per minute.

We cap ourselves at 5 requests per minute per client IP, leaving a buffer
so a single unlucky minute does not exhaust the daily 800-credit budget.

The /api/xirr endpoint is intentionally EXCLUDED from rate limiting because
it performs computation entirely on the backend — it costs zero API credits.

How sliding-window works:
  - We store a list of timestamps for each IP address.
  - On every request we discard timestamps older than `window_seconds`.
  - If the remaining count >= max_requests, we reject with 429.
  - Otherwise we record the current timestamp and let the request through.
"""

import time
from collections import defaultdict

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from config import settings

# Endpoints that proxy Twelve Data — these consume API credits
_RATE_LIMITED_PREFIXES = (
    "/api/search",
    "/api/time-series",
    "/api/quote",
)


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window rate limiter.

    Configuration is read from `config.settings` so it can be tuned
    via environment variables without touching source code.
    """

    def __init__(
        self,
        app: ASGIApp,
        max_requests: int = settings.RATE_LIMIT_MAX_REQUESTS,
        window_seconds: int = settings.RATE_LIMIT_WINDOW_SECONDS,
    ) -> None:
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds

        # {ip_address: [timestamp, timestamp, ...]}
        # defaultdict so we never need to check key existence
        self._request_log: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        path: str = request.url.path

        # Only rate-limit the Twelve Data proxy routes
        if not any(path.startswith(prefix) for prefix in _RATE_LIMITED_PREFIXES):
            return await call_next(request)

        # Resolve client IP (works behind most reverse proxies too)
        forwarded_for = request.headers.get("X-Forwarded-For")
        client_ip: str = (
            forwarded_for.split(",")[0].strip()
            if forwarded_for
            else (request.client.host if request.client else "unknown")
        )

        now = time.monotonic()

        # ── Slide the window: discard old timestamps ─────────────────────
        window_start = now - self.window_seconds
        self._request_log[client_ip] = [
            ts for ts in self._request_log[client_ip] if ts > window_start
        ]

        # ── Enforce the limit ─────────────────────────────────────────────
        current_count = len(self._request_log[client_ip])
        if current_count >= self.max_requests:
            # Calculate how many seconds until the oldest request falls off
            oldest = self._request_log[client_ip][0]
            retry_after = int(self.window_seconds - (now - oldest)) + 1

            return JSONResponse(
                status_code=429,
                content={
                    "detail": (
                        f"Rate limit exceeded: {self.max_requests} requests "
                        f"per {self.window_seconds} seconds. "
                        f"Please wait {retry_after} second(s)."
                    ),
                    "retry_after_seconds": retry_after,
                },
                headers={"Retry-After": str(retry_after)},
            )

        # ── Record this request and continue ─────────────────────────────
        self._request_log[client_ip].append(now)
        return await call_next(request)
