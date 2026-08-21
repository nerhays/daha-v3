import { Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Wrench className="h-10 w-10 text-[#0F4C81]" />
        </div>

        <span className="mt-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-[#0F4C81]">DAHA BOREPILE</span>

        <h1 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
          Halaman Ini Sedang
          <br />
          dalam Pengembangan
        </h1>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/admin" className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-7 py-4 font-semibold text-slate-700 transition hover:bg-slate-100">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
