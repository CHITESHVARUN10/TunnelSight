import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">TunnelSight — Phase 0</h1>
      <p className="mt-2 text-sm text-gray-600">
        Skeleton only. Backend health: <code>GET /api/health</code>. Auth is session-cookie based.
      </p>
      <nav className="mt-6 flex gap-4 text-sm underline">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/upload">Upload</Link>
        <Link href="/history">History</Link>
      </nav>
    </main>
  );
}
