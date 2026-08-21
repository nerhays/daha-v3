import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ArticleActions from "./ArticleActions";
export default async function AdminArticlesPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      `
        id,
        slug,
        title,
        category,
        badge,
        published_at,
        updated_at,
        cover_src
      `,
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil artikel:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 mt-20">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#0F4C81]">CMS</p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">Artikel</h1>

            <p className="mt-2 text-slate-500">Kelola artikel yang tampil di website Daha Borepile.</p>
          </div>

          <Link href="/admin/articles/new" className="rounded-lg bg-[#0F4C81] px-5 py-3 font-semibold text-white transition hover:bg-[#0c3d68]">
            + Tambah Artikel
          </Link>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Artikel</th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Kategori</th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Update</th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {articles && articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article.id} className="transition hover:bg-slate-50">
                      {/* ARTICLE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {article.cover_src ? (
                            <img src={article.cover_src} alt={article.title} className="h-16 w-24 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">No Image</div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-900">{article.title}</p>

                            <p className="mt-1 text-xs text-slate-400">/artikel/{article.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#0F4C81]">{article.category}</span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        {article.published_at ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">Published</span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Draft</span>
                        )}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-sm text-slate-500">{article.updated_at ? new Date(article.updated_at).toLocaleDateString("id-ID") : "-"}</td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <ArticleActions articleId={article.id} slug={article.slug} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      Belum ada artikel.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL */}
        <p className="mt-4 text-sm text-slate-500">
          Total artikel: <strong>{articles?.length ?? 0}</strong>
        </p>
      </div>
    </main>
  );
}
