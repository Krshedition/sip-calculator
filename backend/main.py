# backend/main.py
"""
FastAPI application entry point for the SIP Calculator API.

What this file does:
  1. Creates the FastAPI app instance with metadata.
  2. Adds CORS middleware — only localhost:5173 (Vite dev server) is allowed.
  3. Adds the sliding-window rate limiter middleware.
  4. Registers all four routers under the /api prefix.
  5. Exposes a health-check endpoint at GET /.

To run locally:
    cd backend
    uvicorn main:app --reload --port 8000

The API will be available at http://localhost:8000
Interactive API docs:  http://localhost:8000/docs
Alternative API docs:  http://localhost:8000/redoc
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from middleware.rate_limiter import RateLimiterMiddleware
from routers import stock_search, time_series, quote, xirr

# ── Create app ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="SIP Calculator API",
    description=(
        "Backend proxy service for the SIP Calculator & Stock SIP Simulator. "
        "Securely proxies Twelve Data market data requests and computes XIRR."
    ),
    version="1.0.0",
    # Disable docs in production by setting docs_url=None, redoc_url=None
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# Only the Vite dev server is whitelisted during development.
# When you deploy, add your production frontend domain to settings.CORS_ORIGINS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,   # read from .env / config.py
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# ── Rate limiter ──────────────────────────────────────────────────────────────
# Must be added AFTER CORSMiddleware so that 429 responses also carry
# the correct CORS headers (browsers need them to read error bodies).
#
# Rate limits: 5 req/min per IP on /api/search, /api/time-series, /api/quote
# Twelve Data free tier: 8 credits/min — we stay comfortably under that.
app.add_middleware(
    RateLimiterMiddleware,
    max_requests=settings.RATE_LIMIT_MAX_REQUESTS,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
)

# ── Routers ───────────────────────────────────────────────────────────────────
# Each router handles one concern and is defined in its own file.
app.include_router(stock_search.router)   # GET  /api/search
app.include_router(time_series.router)    # GET  /api/time-series
app.include_router(quote.router)          # GET  /api/quote
app.include_router(xirr.router)           # POST /api/xirr

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    """
    Basic health-check endpoint.
    Returns 200 with a status message if the server is running.
    """
    return {
        "status": "ok",
        "message": "SIP Calculator API is running",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health():
    """
    Detailed health check — verifies config is loaded correctly.
    Does NOT expose the API key; only confirms it is present.
    """
    api_key_loaded = bool(settings.TWELVE_DATA_API_KEY)
    return {
        "status": "ok" if api_key_loaded else "degraded",
        "api_key_configured": api_key_loaded,
        "cors_origins": settings.CORS_ORIGINS,
        "rate_limit": {
            "max_requests": settings.RATE_LIMIT_MAX_REQUESTS,
            "window_seconds": settings.RATE_LIMIT_WINDOW_SECONDS,
        },
    }
