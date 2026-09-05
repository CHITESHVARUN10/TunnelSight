export default function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">{note}</p>
      <p className="mt-4 text-xs text-gray-400">Phase 0 placeholder — real UI arrives via HTML conversion later.</p>
    </main>
  );
}
