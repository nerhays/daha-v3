import Link from "next/link";
import Image from "next/image";

type RelatedArticle = {
  title: string;
  slug: string;
  cover: string;
};

interface Props {
  articles: RelatedArticle[];
}

export default function RelatedContent({ articles }: Props) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 bg-gray-50/60 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">Artikel Terkait</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Artikel yang mungkin Anda sukai</h2>

          <p className="mt-3 max-w-2xl text-gray-600">Temukan artikel lain yang masih berkaitan dan dapat membantu Anda mendapatkan informasi lebih lengkap.</p>
        </div>

        {/* Cards */}
        <div className={`grid gap-6 ${articles.length === 1 ? "max-w-md" : articles.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image src={article.cover} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-blue-600">{article.title}</h3>

                <div className="mt-auto pt-5">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Baca selengkapnya
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
