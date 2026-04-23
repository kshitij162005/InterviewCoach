# FastAPI Server

## 1) Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## 2) Install dependencies

```bash
pip install -r requirements.txt
```

## 3) Configure environment variables

```bash
cp .env.example .env
```

## 4) Run the API

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Open docs at:
- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/redoc

## Endpoints
- `GET /`
- `GET /health`
