# TunnelSight Frontend — Next.js (pnpm only)

Converted 1:1 from `../stitch_screen/*.html` (Stitch designs). Reference renders: `../stitch_screen/*.png`.

## Routes (27 screens)

| Route | Screen |
|---|---|
| `/` | 16 landing |
| `/overview` | 01 analyzer home |
| `/analyze` | 02 PCAP ingestion |
| `/analysis/progress` | 03 pipeline execution |
| `/analysis/results` | 04 results |
| `/analysis/configuration` | 05 protocol details |
| `/analysis/traffic` | 06 traffic intelligence |
| `/analysis/live` | 07 live monitoring |
| `/analysis/compare` | 08 config comparison |
| `/settings` | 09 system config |
| `/dataset` | 10 testbed console |
| `/analysis/findings` | 11 threat matrix |
| `/analysis/reports` | 12 report center |
| `/analysis/anomalies` | 13 anomaly detection |
| `/analysis/assistant` | 14 finding explanation |
| `/profile` | 15 user profile |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | 17–20 auth |
| `/history` | 21 analysis history |
| `/analysis/capture` | 22 capture drawer |
| `/search` | 23 global search |
| `/palette` | 24 command palette |
| `/dialogs/archive-delete`, `/dialogs/live-confirm`, `/dialogs/report` | 25–27 dialogs |

## Conventions

- Theme tokens live in `app/globals.css` (`@theme`): main `surface-*/primary/tertiary` palette + `brand-*` system + zinc-screen tokens + layout scale. Bare `rounded` = 0.125rem (Stitch override).
- Fonts via Google Fonts link in `app/layout.tsx` (`<html class="dark">`): IBM Plex Sans/Mono, Geist, Geist Mono, Inter, Material Symbols Outlined.
- Sidebar active states are per-page static (verified against reference PNGs).
- Interactive screens are `"use client"` with `useState` ports of the original inline scripts; static screens stay server components (they keep `export const metadata`).
- `lib/api.ts` / `lib/auth.ts` are the backend clients (session cookie, `credentials: "include"`). `api()` returns JSON; `apiBlob()` streams binary downloads such as the PDF report.
- Pages that render a single capture (`/analysis/findings`, `/analysis/configuration`, `/analysis/traffic`, `/analysis/results`, `/analysis/assistant`, …) resolve it through `components/analysis/useResolvedAnalysis.ts`: `?analysis_id=` first, then the most recent capture. This is why those pages still work when opened from the sidebar without a query string.
- **PDF export** is server-rendered: every "Export PDF" button calls `GET /api/history/{id}/report.pdf` (ReportLab, light print-friendly theme) via `downloadReportPdf()`.
- **AI explanation** on the Findings page calls `POST /api/history/{id}/explanation` (Groq `openai/gpt-oss-120b`, cached in `analyses.explanation_json`). When `GROQ_API_KEY` is unset the endpoint answers 503 and the page shows "AI layer unavailable" — the deterministic findings are unaffected.
- **pnpm only.** Never add `package-lock.json`.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```
