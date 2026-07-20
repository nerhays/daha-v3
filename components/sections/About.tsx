import Image from "next/image";
import FadeUp from "../ui/FadeUp";
export default function About() {
  return (
    <FadeUp>
      <section id="about" className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
          {/* IMAGE */}

          <div className="relative h-[500px] overflow-hidden rounded-3xl">
            <Image src="/images/about/about.jpg" alt="Tentang Daha Borepile" fill className="object-cover" />
          </div>

          {/* CONTENT */}

          <div>
            <p className="font-semibold uppercase tracking-widest text-blue-700">Tentang Kami</p>

            <h2 className="mt-4 text-5xl font-bold leading-tight text-gray-900">Mitra Terpercaya untuk Jasa Bore Pile dan Pondasi Konstruksi</h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
              <strong>DAHA BOREPILE</strong> merupakan perusahaan yang bergerak di bidang jasa bore pile, strauss pile, bore pile manual, serta berbagai pekerjaan pondasi untuk proyek konstruksi di Indonesia. Sejak tahun 2006, kami telah
              dipercaya mengerjakan pondasi gedung bertingkat, rumah sakit, apartemen, gudang, kawasan industri, hingga proyek pemerintah dengan mengutamakan kualitas, keamanan, dan ketepatan waktu.
            </p>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
              Dengan didukung tenaga kerja profesional, peralatan yang memadai, serta pengalaman lebih dari dua dekade, DAHA BOREPILE berkomitmen memberikan solusi pondasi yang kuat, efisien, dan sesuai dengan kebutuhan setiap proyek
              konstruksi.
            </p>

            {/* <div className="mt-10 grid gap-5">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-blue-700"></div>

                <p>Tenaga kerja profesional</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-blue-700"></div>

                <p>Peralatan modern</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-blue-700"></div>

                <p>Tepat waktu</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-blue-700"></div>

                <p>Berpengalaman lebih dari 20 tahun</p>
              </div>
            </div>*/}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
