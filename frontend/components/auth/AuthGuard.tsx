"use client";
// Route guard. Real session check via GET /api/auth/me; offline mock fallback
// only when NEXT_PUBLIC_USE_MOCK=true and the network call fails.

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { me } from "@/lib/auth";
import { mockMe } from "@/lib/mock/session";

const PUBLIC = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

const ALLOW_MOCK_FALLBACK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (PUBLIC.includes(pathname)) {
      setOk(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await me();
        if (!cancelled) setOk(true);
      } catch (err) {
        if (ALLOW_MOCK_FALLBACK && err instanceof Error && !/^4\d\d/.test(err.message)) {
          if (mockMe()) {
            if (!cancelled) setOk(true);
            return;
          }
        }
        router.replace("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ok && !PUBLIC.includes(pathname)) return null;
  return <>{children}</>;
}
