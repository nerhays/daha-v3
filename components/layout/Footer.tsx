import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import ScrollLink from "../ui/ScrollLink";

export default function Footer() {
  return (
    <footer className="bg-[#0A1323] text-white">
      {/* Top */}

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-5">
          {/* Company */}

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-wide">DAHA</h2>

            <p className="mt-6 max-w-md leading-8 text-slate-400">
              <strong>DAHA BOREPILE</strong> merupakan perusahaan yang bergerak di bidang
              <strong> jasa bore pile</strong>, <strong>strauss pile</strong>,<strong> bore pile manual</strong>, serta berbagai pekerjaan pondasi untuk gedung, rumah sakit, apartemen, gudang, pabrik, dan kawasan industri di seluruh
              Indonesia sejak tahun 2006.
            </p>

            {/* Social */}

            <div className="mt-8 flex gap-4">
              <Link href="https://facebook.com/..." target="_blank" className="rounded-full border border-slate-700 p-3 transition hover:bg-[#0F4C81]">
                <FaFacebookF size={18} />
              </Link>

              <Link href="https://instagram.com/..." target="_blank" className="rounded-full border border-slate-700 p-3 transition hover:bg-[#0F4C81]">
                <FaInstagram size={18} />
              </Link>

              <Link href="https://linkedin.com/company/..." target="_blank" className="rounded-full border border-slate-700 p-3 transition hover:bg-[#0F4C81]">
                <FaTiktok size={18} />
              </Link>
            </div>
          </div>

          {/* Company */}

          <div>
            <h3 className="text-lg font-semibold">Perusahaan</h3>

            <ul className="mt-6 space-y-4 text-slate-400">
              <li>
                <ScrollLink target="about" className="hover:text-white">
                  Tentang Kami
                </ScrollLink>
              </li>

              <li>
                <ScrollLink target="services" className="hover:text-white">
                  Layanan
                </ScrollLink>
              </li>

              <li>
                <ScrollLink target="projects" className="hover:text-white">
                  Artikel Proyek
                </ScrollLink>
              </li>

              <li>
                <ScrollLink target="clients" className="hover:text-white">
                  Our Client
                </ScrollLink>
              </li>

              <li>
                <ScrollLink target="contact" className="hover:text-white">
                  Hubungi Kami
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Services */}

          <div>
            <h3 className="text-lg font-semibold">Layanan</h3>

            <ul className="mt-6 space-y-4 text-slate-400">
              <li>Jasa Bore Pile</li>

              <li>Jasa Strauss Pile</li>

              <li>Bore Pile Manual</li>

              <li>Pondasi Konstruksi</li>

              <li>Sewa Alat Proyek</li>

              <li>Sewa Kendaraan Proyek</li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-lg font-semibold">Kontak</h3>

            <div className="mt-6 space-y-6 text-slate-400">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/20">
                  <MapPin size={18} className="text-[#3B82F6]" />
                </div>

                <span className="leading-7">
                  Bagol, Ngablak, Kec. Banyakan,
                  <br />
                  Kabupaten Kediri,
                  <br />
                  Jawa Timur
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/20">
                  <Phone size={18} className="text-[#3B82F6]" />
                </div>

                <span>0812-3435-4300</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/20">
                  <Mail size={18} className="text-[#3B82F6]" />
                </div>

                <span>cvdahaborepilee@gmail.com</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/20">
                  <Clock size={18} className="text-[#3B82F6]" />
                </div>

                <span className="leading-7">
                  Senin - Sabtu
                  <br />
                  08.00 - 15.00 WIB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} DAHA BOREPILE. Seluruh Hak Cipta Dilindungi.</p>

          <div className="flex gap-6">
            <Link href="/under-construction" className="hover:text-white">
              Kebijakan Privasi
            </Link>

            <Link href="/under-construction" className="hover:text-white">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
