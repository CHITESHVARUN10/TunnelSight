# TunnelSight — SIH26160 Phase 0 Skeleton

AI-Powered IPsec VPN Protocol Analyzer and Security Assessment Framework.
See `IPsec_VPN_Analyzer_Final_Roadmap.md` for full roadmap.

Phase 0 = runnable skeleton only. No parser, no scoring, no LLM, no strongSwan.

## Stack (locked)

- Frontend: Next.js App Router + TypeScript + Tailwind, **pnpm only** (never npm)
- Backend: Python + FastAPI
- DB: local Postgres (later NeonDB via `DATABASE_URL` swap), session-based auth (httpOnly cookie, no JWT)
- ML: Isolation Forest only (anomaly detection)

## Layout

```text
frontend/   Next.js skeleton, placeholders for HTML->TSX conversion later
backend/    FastAPI + session auth + history + health + analyze stub
ml/         Isolation Forest features/train/infer
data/       Synthetic TRAINING data generator (CSV + metadata)
testing/    TEST fixtures (pcaps/json/robustness cases)
```

## Quickstart

### 1. Postgres (local, no Docker)

```bash
psql postgres -c "CREATE USER tunnelsight WITH PASSWORD 'tunnelsight';"
psql postgres -c "CREATE DATABASE tunnelsight OWNER tunnelsight;"
```

### 2. Backend

```bash
python3 -m venv backend/.venv && source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # edit DATABASE_URL + SESSION_SECRET
python -m app.init_db  # from backend/ dir, creates tables
uvicorn app.main:app --reload --port 8000  # from backend/ dir
# health: curl http://localhost:8000/api/health
```

### 3. ML

```bash
pip install -r ml/requirements.txt
python data/generate.py --n 500 --out data/output/synthetic_flows.csv
python ml/train.py --input data/output/synthetic_flows.csv --out ml/models/if_model.joblib
python ml/infer.py --model ml/models/if_model.joblib --input data/output/synthetic_flows.csv
```

### 4. Frontend (pnpm only)

```bash
pnpm --dir frontend install
pnpm --dir frontend dev  # http://localhost:3000
```

Auth flow: register -> login sets `ts_session` httpOnly cookie -> `GET /api/me` -> `/history`.
Frontend fetch MUST use `credentials: "include"` (see `frontend/lib/api.ts`).

## Phase 0 non-goals

No Zeek/tshark parsing, no security engine/scoring, no LLM, no reports, no live capture, no IPv6.
`POST /api/analyze` only stores a `pending` history row.
