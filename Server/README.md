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

Required for Supabase/Postgres in `.env`:

```bash
SUPABASE_PROJECT_ID=<your-project-id>
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Use either DATABASE_URL directly...
DATABASE_URL=postgresql://postgres:<password>@db.<your-project-id>.supabase.co:5432/postgres

# ...or DB_* pieces (if DATABASE_URL is empty)
DB_HOST=db.<your-project-id>.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=<your-db-password>
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
- `GET /db/health`

## Supabase Dashboard: Where To Find Values

1. Project URL + Keys
- Supabase dashboard -> `Settings` -> `API`
- Copy:
	- `Project URL`
	- `anon public` key
	- `service_role` key

2. Postgres connection details
- Supabase dashboard -> `Settings` -> `Database`
- Copy host, port, database, user, and connection string

3. If password is unknown
- Supabase dashboard -> `Settings` -> `Database` -> reset database password

## Render Environment Variables

In Render Web Service -> `Environment`, add:
- `SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (recommended)

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to frontend code.
