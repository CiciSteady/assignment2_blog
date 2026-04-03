#!/usr/bin/env bash
set -euo pipefail

hostname -I | awk '{print $1}'

