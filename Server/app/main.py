import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import DatabaseConfigError, ping_database

load_dotenv()

app_name = os.getenv("APP_NAME", "InterviewCoach API")

app = FastAPI(
    title=app_name,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Keep CORS open during development so the Vite client can call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_notice() -> None:
    # Keep startup non-blocking if DB env vars are not set yet.
    try:
        ping_database()
    except Exception:
        pass


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": f"{app_name} is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/db/health")
def db_health_check() -> dict[str, str]:
    try:
        is_ready = ping_database()
        return {"status": "ok" if is_ready else "error"}
    except DatabaseConfigError as exc:
        return {"status": "error", "detail": str(exc)}
    except Exception as exc:
        return {"status": "error", "detail": str(exc)}
