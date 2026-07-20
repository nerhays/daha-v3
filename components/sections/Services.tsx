import ServiceCard from "../common/ServiceCard";
import { services } from "@/data/services";
import FadeUp from "../ui/FadeUp";
import Link from "next/link";

export default function Services() {
  return (
    <FadeUp>
      <section id="services" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center">
            <p className="font-semibold uppercase tracking-[0.25em] text-[#0F4C81]">Layanan Kami</p>

            <h2 className="mt-4 max-w-3xl text-center text-4xl font-bold text-slate-900 lg:text-5xl">Jasa Bore Pile, Strauss Pile, Mini Pile dan Layanan Pondasi</h2>

            <p className="mt-6 max-w-2xl text-center leading-8 text-slate-500">
              Solusi jasa bore pile dan pondasi konstruksi untuk berbagai jenis proyek, mulai dari bangunan komersial, kawasan industri, infrastruktur, hingga proyek pemerintah di seluruh Indonesia.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => (
              <ServiceCard key={item.id} title={item.title} description={item.description} image={item.image} slug={item.slug} />
            ))}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
