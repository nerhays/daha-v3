import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";

interface ContentCTAProps {
  whatsappUrl: string;
}

export default function ContentCTA({ whatsappUrl }: ContentCTAProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl bg-[#0F4C81] shadow-xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-8 py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-4xl font-bold text-white">Konsultasikan Proyek Anda Bersama Daha Borepile</h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Belum menemukan jawaban yang Anda cari? Tim kami siap membantu menentukan solusi pondasi yang paling sesuai dengan kebutuhan proyek Anda, mulai dari konsultasi hingga pelaksanaan di lapangan.
            </p>

            <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              <div className="flex items-center gap-2 text-white">
                <BadgeCheck className="h-5 w-5 text-green-300" />
                <span>Konsultasi Gratis</span>
              </div>

              <div className="flex items-center gap-2 text-white">
                <BadgeCheck className="h-5 w-5 text-green-300" />
                <span>Respon Cepat</span>
              </div>

              <div className="flex items-center gap-2 text-white">
                <BadgeCheck className="h-5 w-5 text-green-300" />
                <span>Tim Berpengalaman</span>
              </div>
            </div>

            <Link href={whatsappUrl} target="_blank" className="mt-12 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#0F4C81] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <MessageCircle className="h-5 w-5" />
              Hubungi via WhatsApp
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
