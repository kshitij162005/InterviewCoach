import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": f"{app_name} is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
