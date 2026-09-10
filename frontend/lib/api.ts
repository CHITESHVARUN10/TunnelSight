const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function api(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // required: session cookie (ts_session), no JWT headers
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${body}`.trim());
  }
  return res.json().catch(() => ({}));
}

export async function apiForm(path: string, form: FormData) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body: form, // no Content-Type: browser sets multipart boundary
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json().catch(() => ({}));
}

/** Fetch a binary payload (PDF export). Surfaces JSON error details readably. */
export async function apiBlob(path: string, init: RequestInit = {}): Promise<Blob> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", ...init });
  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    let detail = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.detail === "string") detail = parsed.detail;
    } catch {
      // keep the raw body
    }
    throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`.trim());
  }
  return res.blob();
}
