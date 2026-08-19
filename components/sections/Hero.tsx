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
          <div className="flex items-center gap-3 text-sm font-medium text-[#60A5FA]">
            <span className="h-px w-8 bg-[#60A5FA]" />
            <span className="tracking-wide">Sejak 2006 · DAHA BOREPILE</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Bangun Impian Anda
            <br />
            Bersama Kami
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-200">
            Daha Borepile menyediakan jasa bore pile, strauss pile, mini pile, dan pekerjaan pondasi profesional untuk gedung, rumah sakit, gudang, apartemen, hingga kawasan industri di Indonesia.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ScrollLink target="contact" className="rounded-md bg-white px-7 py-3.5 text-sm font-semibold text-blue-950 transition hover:bg-blue-50">
              Konsultasi Gratis
            </ScrollLink>

            <ScrollLink target="projects" className="group flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#60A5FA]">
              Lihat Proyek Kami
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </ScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
}
