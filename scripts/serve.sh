#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_ROOT}/site"
echo "Serving site from ${PROJECT_ROOT}/site on port ${PORT}"
python3 -m http.server "${PORT}" --bind 0.0.0.0

