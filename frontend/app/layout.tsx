import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/lib/mock/toast";
import { HeaderBehavior } from "@/components/layout/HeaderBehavior";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "TunnelSight — IPsec Security Intelligence",
  description: "AI-powered IPsec VPN protocol analyzer and security assessment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Geist+Mono:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0e11]"><ToastProvider><HeaderBehavior /><AuthGuard>{children}</AuthGuard></ToastProvider></body>
    </html>
  );
}
