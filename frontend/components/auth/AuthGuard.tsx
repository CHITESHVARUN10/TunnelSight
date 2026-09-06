"use client";
// Prototype route guard. Redirects to /login when no mock session exists.
// Public: landing + auth pages. Everything else requires the demo session.

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockMe } from "@/lib/mock/session";

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
    if (mockMe()) setOk(true);
    else router.replace("/login");
  }, [pathname, router]);

  if (!ok && !PUBLIC.includes(pathname)) return null;
  return <>{children}</>;
}
