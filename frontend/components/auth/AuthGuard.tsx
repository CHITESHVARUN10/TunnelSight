"use client";
// Route guard. Public: landing + auth pages. Everything else requires a
// backend session cookie (verified via GET /api/auth/me).

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { me } from "@/lib/auth";

const PUBLIC = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (PUBLIC.includes(pathname)) {
      setOk(true);
      return;
    }
    let dead = false;
    (async () => {
      try {
        await me();
        if (!dead) setOk(true);
      } catch {
        if (!dead) router.replace("/login");
      }
    })();
    return () => {
      dead = true;
    };
  }, [pathname, router]);

  if (!ok && !PUBLIC.includes(pathname)) return null;
  return <>{children}</>;
}
