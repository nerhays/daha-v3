import Image from "next/image";
import Button from "../ui/Button";
import ContactButton from "../ui/ContactButton";
import ScrollLink from "../ui/ScrollLink";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[700px]">
      <Image src="/images/hero/hero.jpg" alt="Daha Borepile" fill priority className="object-cover" />

      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-3xl">
          <span className="rounded-full border border-white/40 px-5 py-2 text-white">Sejak 2006</span>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-[#60A5FA]">DAHA BOREPILE</p>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Bangun Impian Anda
            <br />
            Bersama Kami
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-200">
            Daha Borepile menyediakan jasa bore pile, strauss pile, mini pile, dan pekerjaan pondasi profesional untuk gedung, rumah sakit, gudang, apartemen, hingga kawasan industri di Indonesia.
          </p>

          <div className="mt-10 flex gap-5">
            <ScrollLink target="contact" className="rounded-xl bg-[#2a86d6] px-6 py-3 font-semibold text-white transition hover:bg-blue-900">
              Konsultasi Gratis
            </ScrollLink>

            <ScrollLink target="projects" className="rounded-xl bg-transparent border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#0F4C81]">
              Artikel Proyek
            </ScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
}
