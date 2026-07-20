"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/constants/navigation";
import ContactButton from "../ui/ContactButton";
import ScrollLink from "../ui/ScrollLink";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/icons/logo.png" alt="DAHA BOREPILE" width={180} height={50} priority className="h-20 w-auto object-contain" />
        </Link>

        {/* Kanan */}
        <div className="hidden items-center gap-10 lg:flex">
          {/* Menu */}
          <nav>
            <ul className="flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <ScrollLink target={item.target} className="font-medium text-gray-700 transition hover:text-[#0F4C81]">
                    {item.name}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </nav>
          {/* Button */}
          <ScrollLink target="contact" className="rounded-xl bg-[#0F4C81] px-6 py-3 font-semibold text-white transition hover:bg-blue-900">
            Konsultasi
          </ScrollLink>
        </div>

        {/* Mobile */}
        <button
          onClick={() => {
            console.log(open);
            setOpen(!open);
          }}
          className="lg:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="absolute left-0 top-20 z-[9999] w-full border-t bg-white shadow-lg lg:hidden">
          <ul className="space-y-5 p-6">
            {navigation.map((item) => (
              <li key={item.name}>
                <ScrollLink target={item.target} onClick={() => setOpen(false)} className="block font-medium">
                  {item.name}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
