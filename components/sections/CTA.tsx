import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import FadeUp from "../ui/FadeUp";

export default function CTA() {
  return (
    <FadeUp>
      <section id="contact" className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          {/* Left */}

          <div>
            <p className="font-semibold uppercase tracking-[0.25em] text-[#0F4C81]">Hubungi Kami</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
              Konsultasikan
              <br />
              Kebutuhan Pondasi Proyek Anda
            </h2>
            <p className="mt-6 leading-8 text-slate-500">
              Tim DAHA BOREPILE siap membantu kebutuhan jasa bore pile, strauss pile, bore pile manual, serta berbagai pekerjaan pondasi untuk gedung, rumah sakit, gudang, apartemen, pabrik, dan kawasan industri di seluruh Indonesia.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <Phone className="text-[#0F4C81]" size={22} />

                <span>0812-3435-4300</span>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-[#0F4C81]" size={22} />

                <span>cvdahaborepilee@gmail.com</span>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-[#0F4C81]" size={22} />

                <span>Bagol, Ngablak, Kec. Banyakan Kabupaten Kediri, Jawa Timur 64157</span>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="text-[#0F4C81]" size={22} />

                <span>
                  Senin - Sabtu
                  <br />
                  08.00 - 15.00 WIB
                </span>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="https://wa.me/6281234354300" target="_blank" className="rounded-xl bg-[#0F4C81] px-7 py-4 font-semibold text-white transition hover:bg-[#0A3760]">
                WhatsApp
              </Link>

              <Link href="/under-construction" className="rounded-xl border border-[#0F4C81] px-7 py-4 font-semibold text-[#0F4C81] transition hover:bg-[#0F4C81] hover:text-white">
                Lihat Proyek
              </Link>
            </div>
          </div>

          {/* Right */}

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7906.50102695475!2d112.001622!3d-7.763236000000001!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7851f8a2041305%3A0x2571c5f1b10f7ace!2sDaha%20Bore%20Pille!5e0!3m2!1sen!2sid!4v1784514001112!5m2!1sen!2sid"
              width="100%"
              height="500"
              loading="lazy"
              className="border-0"
            />
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
