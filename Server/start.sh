#!/usr/bin/env bash
set -euo pipefail

# Always run from the Server directory where this script lives.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d ".venv" ]; then
  echo "Creating local virtual environment in Server/.venv..."
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

# Keep environment in sync with requirements (handles newly added packages).
echo "Syncing dependencies from requirements.txt..."
python -m pip install -r requirements.txt

echo "Starting FastAPI on http://127.0.0.1:8000"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
