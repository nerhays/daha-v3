import Link from "next/link";
import Image from "next/image";

import { getAllArticles } from "@/lib/article";

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50 mt-20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C81]">Artikel & Proyek</p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Artikel dan Dokumentasi Proyek DAHA Borepile</h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Temukan informasi seputar pondasi, konstruksi, layanan, serta dokumentasi proyek yang dikerjakan oleh DAHA Borepile.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Link href={`/artikel/${article.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={article.cover.src} alt={article.cover.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C81]">{article.badge}</span>

                    <h2 className="mt-2 text-xl font-semibold leading-7 text-slate-900">{article.title}</h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>

                    <div className="mt-5 text-sm font-semibold text-[#0F4C81]">Baca selengkapnya →</div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
