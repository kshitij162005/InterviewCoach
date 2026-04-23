import os
from urllib.parse import parse_qsl, quote_plus, urlencode, urlsplit, urlunsplit

import psycopg


class DatabaseConfigError(ValueError):
    """Raised when required DB settings are missing."""


def _build_database_url_from_parts() -> str:
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "postgres")
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD")

    if not host or not password:
        raise DatabaseConfigError(
            "DATABASE_URL is not set, and DB_HOST/DB_PASSWORD are missing."
        )

    encoded_password = quote_plus(password)
    return f"postgresql://{user}:{encoded_password}@{host}:{port}/{name}"


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return _ensure_sslmode(database_url)

    return _ensure_sslmode(_build_database_url_from_parts())


def _ensure_sslmode(database_url: str) -> str:
    """Supabase Postgres requires SSL; default to sslmode=require when absent."""
    split = urlsplit(database_url)
    query_pairs = parse_qsl(split.query, keep_blank_values=True)
    existing_keys = {key.lower() for key, _ in query_pairs}

    if "sslmode" not in existing_keys:
        query_pairs.append(("sslmode", "require"))

    return urlunsplit(
        (split.scheme, split.netloc, split.path, urlencode(query_pairs), split.fragment)
    )


def ping_database() -> bool:
    database_url = get_database_url()

    with psycopg.connect(database_url, connect_timeout=5) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            row = cur.fetchone()
            return bool(row and row[0] == 1)
