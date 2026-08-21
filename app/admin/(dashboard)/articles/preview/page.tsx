"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

type Section = {
  heading: string;
  paragraphs: string[];
  list: string[];
  table: {
    enabled: boolean;
    headers: string[];
    rows: string[][];
  };
};

type FAQ = {
  question: string;
  answer: string;
};

type RelatedArticle = {
  article_id: number;
  title: string;
  cover_src: string;
};

type PreviewData = {
  form: {
    badge: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    published_at: string;
    reading_time: string;
    cover_src: string;
    cover_alt: string;
  };

  sections: Section[];

  gallery: {
    preview: string;
    alt: string;
  }[];

  faqs: FAQ[];

  related: RelatedArticle[];
};

/* =========================================================
   SESSION STORAGE
========================================================= */

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function getClientSnapshot() {
  return sessionStorage.getItem("article-preview");
}

function getServerSnapshot() {
  return null;
}

/* =========================================================
   PAGE
========================================================= */

export default function ArticlePreviewPage() {
  const stored = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  let data: PreviewData | null = null;

  if (stored) {
    try {
      data = JSON.parse(stored) as PreviewData;
    } catch (error) {
      console.error("Gagal membaca preview:", error);
    }
  }

  /* =====================================================
     EMPTY PREVIEW
  ===================================================== */

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Preview tidak tersedia</h1>

          <p className="mt-2 text-slate-500">Silakan kembali ke halaman editor dan klik Preview.</p>

          <Link href="/admin/articles/new" className="mt-6 inline-block rounded-lg bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white">
            Kembali ke Editor
          </Link>
        </div>
      </main>
    );
  }

  const { form, sections, gallery, faqs, related } = data;

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          PREVIEW BAR
      ===================================================== */}

      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-6 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Preview Artikel</span>

            <p className="text-xs text-slate-500">Tampilan sementara — belum dipublikasikan</p>
          </div>

          <Link href="/admin/articles/new" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Kembali ke Editor
          </Link>
        </div>
      </div>

      {/* =====================================================
          ARTICLE
      ===================================================== */}

      <article className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-14">
        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Beranda</span>

            <span>/</span>

            <span>Artikel</span>

            <span>/</span>

            <span className="font-medium text-slate-700">{form.title || "Preview"}</span>
          </div>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="mx-auto max-w-5xl">
          {/* BADGE */}

          <div className="flex flex-wrap items-center gap-3">
            {form.badge && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F4C81]">{form.badge}</span>}

            {form.category && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{form.category}</span>}
          </div>

          {/* TITLE */}

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">{form.title || "Judul Artikel"}</h1>

          {/* EXCERPT */}

          {form.excerpt && <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600 md:text-xl">{form.excerpt}</p>}

          {/* META */}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {form.published_at && (
              <span>
                {new Date(form.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}

            {form.reading_time && (
              <>
                <span>•</span>

                <span>{form.reading_time}</span>
              </>
            )}
          </div>
        </section>

        {/* =====================================================
            COVER
        ===================================================== */}

        {form.cover_src && (
          <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl">
            <img src={form.cover_src} alt={form.cover_alt || form.title} className="h-auto max-h-[600px] w-full object-cover" />
          </div>
        )}

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => {
              const hasContent = section.heading || section.paragraphs.some((p) => p.trim()) || section.list.some((item) => item.trim()) || section.table.enabled;

              if (!hasContent) return null;

              return (
                <section key={sectionIndex}>
                  {/* HEADING */}

                  {section.heading && <h2 className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl">{section.heading}</h2>}

                  {/* PARAGRAPHS */}

                  {section.paragraphs.filter((p) => p.trim()).length > 0 && (
                    <div className={section.heading ? "mt-5" : ""}>
                      <div className="space-y-5">
                        {section.paragraphs
                          .filter((paragraph) => paragraph.trim())
                          .map((paragraph, index) => (
                            <p key={index} className="text-base leading-8 text-slate-700 md:text-lg">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* LIST */}

                  {section.list.filter((item) => item.trim()).length > 0 && (
                    <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-8 text-slate-700 md:text-lg">
                      {section.list
                        .filter((item) => item.trim())
                        .map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                    </ul>
                  )}

                  {/* TABLE */}

                  {section.table.enabled && section.table.headers.some((header) => header.trim()) && (
                    <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            {section.table.headers.map((header, columnIndex) => (
                              <th key={columnIndex} className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {section.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
                              {row.map((cell, columnIndex) => (
                                <td key={columnIndex} className="px-4 py-3 text-slate-600">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* =====================================================
              GALLERY
          ===================================================== */}

          {gallery.filter((item) => item.preview).length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Galeri</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {gallery
                  .filter((item) => item.preview)
                  .map((item, index) => (
                    <div key={index} className="overflow-hidden rounded-xl border border-slate-200">
                      <img src={item.preview} alt={item.alt || `Gallery ${index + 1}`} className="h-64 w-full object-cover" />

                      {item.alt && <p className="px-4 py-3 text-sm text-slate-500">{item.alt}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* =====================================================
              FAQ
          ===================================================== */}

          {faqs.filter((faq) => faq.question.trim() && faq.answer.trim()).length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">FAQ</h2>

              <div className="mt-6 space-y-4">
                {faqs
                  .filter((faq) => faq.question.trim() && faq.answer.trim())
                  .map((faq, index) => (
                    <details key={index} className="group rounded-xl border border-slate-200">
                      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center justify-between gap-4">
                          <span>{faq.question}</span>

                          <span className="text-slate-400 transition group-open:rotate-45">+</span>
                        </div>
                      </summary>

                      <div className="border-t border-slate-200 px-5 py-4">
                        <p className="leading-7 text-slate-600">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
              </div>
            </section>
          )}

          {/* =====================================================
              RELATED ARTICLES
          ===================================================== */}

          {related.filter((item) => item.article_id > 0).length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Artikel Terkait</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {related
                  .filter((item) => item.article_id > 0)
                  .map((item, index) => (
                    <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {item.cover_src ? <img src={item.cover_src} alt={item.title} className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">No Image</div>}

                      <div className="p-5">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="mt-16 bg-[#0F4C81] px-6 py-12">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">Butuh Informasi Lebih Lanjut?</h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">Hubungi Daha Borepile untuk mendapatkan informasi lebih lanjut mengenai layanan dan proyek kami.</p>

          <a href="https://wa.me/6281234354300" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-slate-100">
            Konsultasi Sekarang
          </a>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-slate-400">Preview Artikel — Daha Borepile CMS</p>
        </div>
      </footer>
    </main>
  );
}
