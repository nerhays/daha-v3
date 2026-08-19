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
          Kami Persiapkan
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">Kami sedang menyiapkan konten terbaik agar informasi yang kami sajikan lebih lengkap, akurat, dan bermanfaat bagi Anda.</p>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          Untuk informasi lebih lanjut mengenai layanan <span className="font-semibold text-[#0F4C81]">Bore Pile, Strauss Pile, Mini Pile,</span> maupun konsultasi proyek, silakan hubungi tim DAHA BOREPILE melalui WhatsApp.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a href="https://wa.me/6281234354300" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#0F4C81] px-7 py-4 font-semibold text-white transition hover:bg-blue-900">
            Hubungi Kami
          </a>

          <Link href="/" className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-7 py-4 font-semibold text-slate-700 transition hover:bg-slate-100">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-500">Terima kasih atas kunjungan Anda. Halaman ini akan segera tersedia.</p>
      </div>
    </main>
  );
}
