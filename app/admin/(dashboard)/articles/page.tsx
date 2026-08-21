import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ArticleActions from "./ArticleActions";

interface AdminArticlesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

const ITEMS_PER_PAGE = 10;

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
  const supabase = await createClient();

  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || "";

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // =========================================================
  // QUERY ARTIKEL
  // =========================================================

  let query = supabase
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
      { count: "exact" },
    )
    .order("updated_at", {
      ascending: false,
      nullsFirst: false,
    })
    .range(from, to);

  // =========================================================
  // SEARCH
  // =========================================================

  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  const { data: articles, error, count } = await query;

  if (error) {
    console.error("Gagal mengambil artikel:", error);
  }

  const totalArticles = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ITEMS_PER_PAGE));

  // =========================================================
  // URL PAGINATION
  // =========================================================

  function createPageUrl(page: number) {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    params.set("page", page.toString());

    return `/admin/articles?${params.toString()}`;
  }

  return (
    <main className="mt-20 min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#0F4C81]">CMS</p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">Artikel</h1>

            <p className="mt-2 text-slate-500">Kelola artikel yang tampil di website Daha Borepile.</p>
          </div>

          <Link href="/admin/articles/new" className="shrink-0 rounded-lg bg-[#0F4C81] px-5 py-3 font-semibold text-white transition hover:bg-[#0c3d68]">
            + Tambah Artikel
          </Link>
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form method="GET" action="/admin/articles" className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Cari judul, kategori, atau slug..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F4C81] focus:ring-2 focus:ring-blue-100"
              />

              {search && (
                <Link href="/admin/articles" className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400 transition hover:text-slate-700" title="Hapus pencarian">
                  ×
                </Link>
              )}
            </div>

            <button type="submit" className="rounded-lg bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c3d68]">
              Cari
            </button>
          </form>

          {search && (
            <p className="mt-3 text-sm text-slate-500">
              Hasil pencarian untuk: <strong className="text-slate-700">{search}</strong>
            </p>
          )}
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

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

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">{article.title}</p>

                            <p className="mt-1 truncate text-xs text-slate-400">/artikel/{article.slug}</p>
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
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-slate-400">
                        <p className="text-base font-medium">{search ? "Artikel tidak ditemukan." : "Belum ada artikel."}</p>

                        {search && (
                          <Link href="/admin/articles" className="mt-2 inline-block text-sm font-medium text-[#0F4C81] hover:underline">
                            Tampilkan semua artikel
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {totalArticles > 0 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              {/* INFO */}

              <p className="text-sm text-slate-500">
                Menampilkan{" "}
                <strong className="text-slate-700">
                  {from + 1}-{Math.min(from + ITEMS_PER_PAGE, totalArticles)}
                </strong>{" "}
                dari <strong className="text-slate-700">{totalArticles}</strong> artikel
              </p>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* PREVIOUS */}

                  {currentPage > 1 ? (
                    <Link href={createPageUrl(currentPage - 1)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                      ←
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-300">←</span>
                  )}

                  {/* PAGE NUMBERS */}

                  <div className="hidden items-center gap-1 sm:flex">
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true;

                        if (page === 1 || page === totalPages) return true;

                        return Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, visiblePages) => {
                        const previousPage = visiblePages[index - 1];

                        const showDots = previousPage !== undefined && page - previousPage > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showDots && <span className="px-1 text-sm text-slate-400">...</span>}

                            <Link
                              href={createPageUrl(page)}
                              className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm font-medium transition ${page === currentPage ? "bg-[#0F4C81] text-white" : "border border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                            >
                              {page}
                            </Link>
                          </div>
                        );
                      })}
                  </div>

                  {/* MOBILE PAGE */}

                  <span className="px-3 text-sm text-slate-500 sm:hidden">
                    {currentPage} / {totalPages}
                  </span>

                  {/* NEXT */}

                  {currentPage < totalPages ? (
                    <Link href={createPageUrl(currentPage + 1)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                      →
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-300">→</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* TOTAL */}

        <p className="mt-4 text-sm text-slate-500">
          Total artikel: <strong>{totalArticles}</strong>
        </p>
      </div>
    </main>
  );
}
