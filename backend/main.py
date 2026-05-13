"""
HyperFitness — FastAPI Application Entry Point
Production-grade fitness SaaS backend
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.core.config import settings
from app.database.session import engine, Base

# Routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.attendance.router import router as attendance_router
from app.analytics.router import router as analytics_router
from app.ml.router import router as ml_router

# ── Logging ───────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("hyperfitness")


# ── Lifespan ──────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 HyperFitness API v{settings.APP_VERSION} starting up...")

    # Create tables (use Alembic in production)
    if settings.ENVIRONMENT == "development":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tables initialized")

    yield

    # Shutdown
    await engine.dispose()
    logger.info("👋 HyperFitness API shutting down")


# ── App Factory ───────────────────────────────
app = FastAPI(
    title="HyperFitness API",
    description="""
    **HyperFitness** — The Future Operating System for Modern Fitness
    
    A production-grade enterprise fitness management platform.
    
    ## Features
    - 🔐 JWT Authentication with RBAC
    - 👥 Member Management
    - 📅 Smart Attendance Tracking  
    - 💳 Payment Management
    - 🏋️ Workout Builder
    - 📊 Analytics & Reporting
    """,
    version=settings.APP_VERSION,
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    lifespan=lifespan,
)


# ── CORS Middleware ───────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Security Headers Middleware ───────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# ── Exception Handlers ────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": first_error.get("msg", "Validation error"),
            "field": ".".join(str(loc) for loc in first_error.get("loc", [])),
            "errors": errors,
        },
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A database error occurred. Please try again."},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )


from app.ai.router import router as ai_router

# ── Register Routers ──────────────────────────
prefix = settings.API_PREFIX

app.include_router(auth_router, prefix=prefix)
app.include_router(users_router, prefix=prefix)
app.include_router(attendance_router, prefix=prefix)
app.include_router(analytics_router, prefix=prefix)
app.include_router(ml_router, prefix=prefix)
app.include_router(ai_router, prefix=prefix)


# ── Health Check ──────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "service": "HyperFitness API",
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "🏋️ HyperFitness API — The Future Operating System for Modern Fitness",
        "version": settings.APP_VERSION,
        "docs": f"{settings.API_PREFIX}/docs",
    }
