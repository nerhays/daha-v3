export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-2 text-slate-500">Kelola konten website Daha Borepile dari sini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Layanan</p>

          <p className="mt-2 text-3xl font-bold text-[#0F4C81]">-</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Artikel</p>

          <p className="mt-2 text-3xl font-bold text-[#0F4C81]">-</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Proyek</p>

          <p className="mt-2 text-3xl font-bold text-[#0F4C81]">-</p>
        </div>
      </div>
    </div>
  );
}
