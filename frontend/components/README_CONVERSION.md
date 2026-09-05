# HTML -> Next.js conversion rules (for later phase)

You will generate page designs elsewhere and download them as HTML.
When converting:

1. Put reusable pieces in `components/ui/` (cards, tables, badges) and `components/layout/` (Navbar, Sidebar).
2. Convert each HTML page to an App Router page under `app/` (e.g. dashboard HTML -> `app/dashboard/page.tsx`).
3. Replace plain `<a href>` with `next/link` where internal.
4. All backend calls go through `lib/api.ts` (which uses `credentials: "include"` for the session cookie). Never add JWT headers.
5. Tailwind classes carry over as-is (Tailwind v4). Global styles stay in `app/globals.css`.
6. Keep `pnpm` only — never add `package-lock.json`.
