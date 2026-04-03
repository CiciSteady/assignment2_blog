# Assignment 2 Static Personal Blog Website

This repository contains a no-dependency static personal blog website built for Assignment 2.

## Quick Start

Run the site locally from WSL:

```bash
cd /mnt/c/Users/r1382/Desktop/codex/assignment2_blog
bash scripts/serve.sh 8000
```

Then open:

- `http://localhost:8000`
- `http://$(bash scripts/get_wsl_ip.sh):8000`

## Project Layout

- `site/`: static website files
- `docs/`: Markdown report and step-by-step commands
- `scripts/`: local preview helpers
- `.github/workflows/`: optional GitHub Pages deployment workflow

