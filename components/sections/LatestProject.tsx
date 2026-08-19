// import Link from "next/link";
// import ProjectCard from "../common/ProjectCard";
// import { getFeaturedProjects } from "@/lib/article";
// import FadeUp from "../ui/FadeUp";

// export default async function LatestProject() {
//   const latestProjects = await getFeaturedProjects(3);

//   return (
//     <FadeUp>
//       <section id="projects" className="bg-slate-50 py-24">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="flex flex-col items-center">
//             <p className="font-semibold uppercase tracking-[0.25em] text-[#0F4C81]">Artikel Proyek</p>

//             <h2 className="mt-4 max-w-3xl text-center text-4xl font-bold lg:text-5xl">Dokumentasi Proyek Bore Pile & Pondasi</h2>

//             <p className="mt-6 max-w-3xl text-center leading-8 text-slate-500">
//               Lihat dokumentasi berbagai proyek jasa bore pile, strauss pile, bore pile manual, dan pekerjaan pondasi yang telah diselesaikan oleh DAHA BOREPILE untuk gedung, rumah sakit, gudang, apartemen, pabrik, serta kawasan industri di
//               berbagai wilayah Indonesia.
//             </p>
//           </div>

//           <div className="mt-16 grid gap-8 lg:grid-cols-3">
//             {latestProjects.map((item) => (
//               <ProjectCard key={item.slug} title={item.title} image={item.cover.src} slug={item.slug} location={item.metadata.category} category={item.badge} date={item.metadata.publishedAt ?? ""} />
//             ))}
//           </div>

//           <div className="mt-14 text-center">
//             <Link href="/artikel" className="inline-flex rounded-xl bg-[#0F4C81] px-7 py-4 font-semibold text-white transition hover:bg-[#0A3760]">
//               Lihat Semua Artikel
//             </Link>
//           </div>
//         </div>
//       </section>
//     </FadeUp>
//   );
// }

import Link from "next/link";
import ProjectCard from "../common/ProjectCard";
import { getFeaturedProjects } from "@/lib/article";
import FadeUp from "../ui/FadeUp";

export default async function LatestProject() {
  const latestProjects = await getFeaturedProjects(3);

  return (
    <FadeUp>
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C81]">Artikel Proyek</p>

            <h2 className="mt-4 max-w-3xl text-center text-4xl font-bold lg:text-5xl">Dokumentasi Proyek Bore Pile & Pondasi</h2>

            <p className="mt-6 max-w-3xl text-center leading-8 text-slate-500">
              Lihat dokumentasi berbagai proyek jasa bore pile, strauss pile, bore pile manual, dan pekerjaan pondasi yang telah diselesaikan oleh DAHA BOREPILE untuk berbagai kebutuhan konstruksi di Indonesia.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {latestProjects.map((item) => (
              <ProjectCard key={item.slug} title={item.title} image={item.cover.src} slug={item.slug} category={item.metadata.category} date={item.metadata.publishedAt} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/artikel" className="inline-flex rounded-xl bg-[#0F4C81] px-7 py-4 font-semibold text-white transition hover:bg-[#0A3760]">
              Lihat Semua Artikel
            </Link>
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
