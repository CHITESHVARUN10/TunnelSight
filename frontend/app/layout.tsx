import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TunnelSight — IPsec Analyzer (Phase 0)",
  description: "SIH26160 AI-powered IPsec VPN analyzer skeleton",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
