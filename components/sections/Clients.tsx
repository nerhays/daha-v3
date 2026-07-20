"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import FadeUp from "../ui/FadeUp";
import ClientCard from "../common/ClientCard";
import { clients } from "@/data/clients";

export default function Clients() {
  return (
    <FadeUp>
      <section id="clients" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.25em] text-[#0F4C81]">Our Client</p>

            <h2 className="mt-4 text-4xl font-bold lg:text-5xl">Dipercaya oleh Berbagai Perusahaan & Instansi</h2>

            <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-500">
              DAHA BOREPILE telah menjadi mitra terpercaya dalam berbagai proyek jasa bore pile, strauss pile, dan pekerjaan pondasi untuk perusahaan swasta, BUMN, instansi pemerintah, kontraktor, hingga pengembang properti di Indonesia.
            </p>
          </div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={3500}
            loop
            slidesPerView={2}
            spaceBetween={25}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
            className="mt-16"
          >
            {clients.map((item) => (
              <SwiperSlide key={item.id}>
                <ClientCard logo={item.logo} name={item.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </FadeUp>
  );
}
