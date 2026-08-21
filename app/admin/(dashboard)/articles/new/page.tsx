"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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

type GalleryItem = {
  file: File | null;
  preview: string;
  alt: string;
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

type SaveMode = "draft" | "published";

const emptySection = (): Section => ({
  heading: "",
  paragraphs: [""],
  list: [""],
  table: {
    enabled: false,
    headers: [""],
    rows: [[""]],
  },
});

const emptyFAQ = (): FAQ => ({
  question: "",
  answer: "",
});

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = createClient();

  /* =====================================================
     FORM
  ===================================================== */

  const [form, setForm] = useState({
    badge: "Artikel",
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    published_at: "",
    reading_time: "",
    cover_src: "",
    cover_alt: "",
  });

  /* =====================================================
     ARTICLE CONTENT
  ===================================================== */

  const [sections, setSections] = useState<Section[]>([emptySection()]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [related, setRelated] = useState<RelatedArticle[]>([]);

  /* =====================================================
     AVAILABLE ARTICLES
  ===================================================== */

  const [availableArticles, setAvailableArticles] = useState<
    {
      id: number;
      title: string;
      cover_src: string;
    }[]
  >([]);

  /* =====================================================
     STATE
  ===================================================== */

  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState<SaveMode | null>(null);

  const [error, setError] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  /* =====================================================
     LOAD AVAILABLE ARTICLES
  ===================================================== */

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const { data, error } = await supabase.from("articles").select("id, title, cover_src").order("published_at", { ascending: false });

    if (!error && data) {
      setAvailableArticles(data);
    }
  }

  /* =====================================================
     FORM
  ===================================================== */

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugify(value),
    }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* =====================================================
     SECTION
  ===================================================== */

  function updateSection<K extends keyof Section>(sectionIndex: number, field: K, value: Section[K]) {
    setSections((prev) =>
      prev.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  }

  function updateParagraph(sectionIndex: number, paragraphIndex: number, value: string) {
    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) return section;

        const paragraphs = [...section.paragraphs];
        paragraphs[paragraphIndex] = value;

        return {
          ...section,
          paragraphs,
        };
      }),
    );
  }

  function updateList(sectionIndex: number, listIndex: number, value: string) {
    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) return section;

        const list = [...section.list];
        list[listIndex] = value;

        return {
          ...section,
          list,
        };
      }),
    );
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function addParagraph(sectionIndex: number) {
    setSections((prev) =>
      prev.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              paragraphs: [...section.paragraphs, ""],
            }
          : section,
      ),
    );
  }

  function removeParagraph(sectionIndex: number, paragraphIndex: number) {
    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) return section;

        return {
          ...section,
          paragraphs: section.paragraphs.filter((_, i) => i !== paragraphIndex),
        };
      }),
    );
  }

  function addListItem(sectionIndex: number) {
    setSections((prev) =>
      prev.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              list: [...section.list, ""],
            }
          : section,
      ),
    );
  }

  function removeListItem(sectionIndex: number, listIndex: number) {
    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) return section;

        return {
          ...section,
          list: section.list.filter((_, i) => i !== listIndex),
        };
      }),
    );
  }

  /* =====================================================
     TABLE
  ===================================================== */

  function updateTableHeaders(sectionIndex: number, index: number, value: string) {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;

        const headers = [...section.table.headers];
        headers[index] = value;

        return {
          ...section,
          table: {
            ...section.table,
            headers,
          },
        };
      }),
    );
  }

  function addTableColumn(sectionIndex: number) {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;

        return {
          ...section,
          table: {
            ...section.table,
            headers: [...section.table.headers, ""],
            rows: section.table.rows.map((row) => [...row, ""]),
          },
        };
      }),
    );
  }

  function removeTableColumn(sectionIndex: number, columnIndex: number) {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;

        return {
          ...section,
          table: {
            ...section.table,
            headers: section.table.headers.filter((_, index) => index !== columnIndex),
            rows: section.table.rows.map((row) => row.filter((_, index) => index !== columnIndex)),
          },
        };
      }),
    );
  }

  function updateTableCell(sectionIndex: number, rowIndex: number, columnIndex: number, value: string) {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;

        const rows = section.table.rows.map((row, r) => (r === rowIndex ? row.map((cell, c) => (c === columnIndex ? value : cell)) : row));

        return {
          ...section,
          table: {
            ...section.table,
            rows,
          },
        };
      }),
    );
  }

  function addTableRow(sectionIndex: number) {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;

        return {
          ...section,
          table: {
            ...section.table,
            rows: [...section.table.rows, section.table.headers.map(() => "")],
          },
        };
      }),
    );
  }

  function removeTableRow(sectionIndex: number, rowIndex: number) {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;

        return {
          ...section,
          table: {
            ...section.table,
            rows: section.table.rows.filter((_, index) => index !== rowIndex),
          },
        };
      }),
    );
  }

  /* =====================================================
     GALLERY
  ===================================================== */

  function addGallery() {
    setGallery((prev) => [
      ...prev,
      {
        file: null,
        preview: "",
        alt: "",
      },
    ]);
  }

  function updateGalleryAlt(index: number, value: string) {
    setGallery((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              alt: value,
            }
          : item,
      ),
    );
  }

  function removeGallery(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  /* =====================================================
     FAQ
  ===================================================== */

  function addFAQ() {
    setFaqs((prev) => [...prev, emptyFAQ()]);
  }

  function updateFAQ(index: number, field: keyof FAQ, value: string) {
    setFaqs((prev) =>
      prev.map((faq, i) =>
        i === index
          ? {
              ...faq,
              [field]: value,
            }
          : faq,
      ),
    );
  }

  function removeFAQ(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  /* =====================================================
     RELATED
  ===================================================== */

  function addRelated() {
    setRelated((prev) => [
      ...prev,
      {
        article_id: 0,
        title: "",
        cover_src: "",
      },
    ]);

    if (availableArticles.length === 0) {
      loadArticles();
    }
  }

  function updateRelated(index: number, articleId: number) {
    const article = availableArticles.find((item) => item.id === articleId);

    setRelated((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              article_id: articleId,
              title: article?.title ?? "",
              cover_src: article?.cover_src ?? "",
            }
          : item,
      ),
    );
  }

  function removeRelated(index: number) {
    setRelated((prev) => prev.filter((_, i) => i !== index));
  }

  /* =====================================================
     UPLOAD IMAGE
  ===================================================== */

  async function uploadImage(file: File, folder: "covers" | "gallery") {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("article-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      throw new Error(`Gagal upload gambar: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("article-images").getPublicUrl(filePath);

    return publicUrl;
  }
  /* =====================================================
   PREVIEW
===================================================== */

  function handlePreview() {
    if (!form.title.trim()) {
      setError("Judul artikel wajib diisi sebelum preview.");
      return;
    }

    if (!form.excerpt.trim()) {
      setError("Excerpt wajib diisi sebelum preview.");
      return;
    }

    const previewData = {
      form: {
        ...form,
        cover_src: coverPreview || form.cover_src,
      },
      sections,
      gallery: gallery.map((item) => ({
        preview: item.preview,
        alt: item.alt,
      })),
      faqs,
      related,
    };

    sessionStorage.setItem("article-preview", JSON.stringify(previewData));

    window.open("/admin/articles/preview", "_blank");
  }
  /* =====================================================
     SUBMIT
  ===================================================== */

  async function handleSubmit(mode: SaveMode) {
    setError("");
    setSaving(true);
    setSaveMode(mode);

    try {
      /* =================================================
         VALIDATION
      ================================================= */

      if (!form.title.trim()) {
        throw new Error("Judul artikel wajib diisi.");
      }

      if (!form.slug.trim()) {
        throw new Error("Slug artikel wajib diisi.");
      }

      if (!form.excerpt.trim()) {
        throw new Error("Excerpt wajib diisi.");
      }

      if (!coverFile) {
        throw new Error("Cover artikel wajib diupload.");
      }

      /* =================================================
         CHECK SLUG
      ================================================= */

      const { data: existingArticle } = await supabase.from("articles").select("id").eq("slug", form.slug).maybeSingle();

      if (existingArticle) {
        throw new Error("Slug sudah digunakan. Silakan gunakan slug lain.");
      }

      /* =================================================
         DETERMINE PUBLISHED DATE
      ================================================= */

      let publishedAt: string | null = null;

      if (mode === "published") {
        if (form.published_at) {
          publishedAt = new Date(form.published_at).toISOString();
        } else {
          publishedAt = new Date().toISOString();
        }
      }

      /* =================================================
         ARTICLE
      ================================================= */

      const coverUrl = await uploadImage(coverFile, "covers");

      const { data: article, error: articleError } = await supabase
        .from("articles")
        .insert({
          badge: form.badge,
          title: form.title.trim(),
          slug: form.slug.trim(),
          excerpt: form.excerpt.trim(),
          category: form.category.trim() || "Umum",

          /*
           * DRAFT:
           * published_at = null
           *
           * PUBLISHED:
           * published_at = tanggal yang dipilih
           * atau waktu sekarang
           */
          published_at: publishedAt,

          updated_at: new Date().toISOString(),

          reading_time: form.reading_time.trim() || null,

          cover_src: coverUrl,

          cover_alt: form.cover_alt.trim() || form.title.trim(),
        })
        .select("id")
        .single();

      if (articleError || !article) {
        throw new Error(articleError?.message || "Gagal membuat artikel.");
      }

      const articleId = article.id;

      /* =================================================
         SECTIONS
      ================================================= */

      const validSections = sections.filter((section) => section.heading.trim() || section.paragraphs.some((p) => p.trim()) || section.list.some((item) => item.trim()) || section.table.enabled);

      if (validSections.length > 0) {
        const sectionPayload = validSections.map((section, index) => ({
          article_id: articleId,
          section_order: index + 1,
          heading: section.heading.trim() || null,
          paragraphs: section.paragraphs.filter((p) => p.trim()),
          list: section.list.filter((item) => item.trim()),
        }));

        const { data: insertedSections, error: sectionError } = await supabase.from("article_sections").insert(sectionPayload).select("id, section_order");

        if (sectionError) {
          throw new Error(`Gagal menyimpan sections: ${sectionError.message}`);
        }

        if (!insertedSections) {
          throw new Error("Section berhasil dibuat tetapi ID tidak dikembalikan.");
        }

        /* =================================================
           SECTION TABLES
        ================================================= */

        const tablePayload: {
          section_id: number;
          headers: string[];
          rows: string[][];
        }[] = [];

        validSections.forEach((section, index) => {
          if (!section.table.enabled) return;

          const headers = section.table.headers.map((header) => header.trim()).filter(Boolean);

          if (headers.length === 0) return;

          const rows = section.table.rows.map((row) => row.map((cell) => cell.trim())).filter((row) => row.some((cell) => cell));

          const insertedSection = insertedSections[index];

          if (!insertedSection) return;

          tablePayload.push({
            section_id: insertedSection.id,
            headers,
            rows,
          });
        });

        if (tablePayload.length > 0) {
          const { error: tableError } = await supabase.from("article_section_tables").insert(tablePayload);

          if (tableError) {
            throw new Error(`Gagal menyimpan table: ${tableError.message}`);
          }
        }
      }

      /* =================================================
         GALLERY
      ================================================= */

      const validGallery = gallery.filter((item) => item.file !== null);

      if (validGallery.length > 0) {
        const galleryPayload: {
          article_id: number;
          image_order: number;
          src: string;
          alt: string;
        }[] = [];

        for (let index = 0; index < validGallery.length; index++) {
          const item = validGallery[index];

          if (!item.file) continue;

          const imageUrl = await uploadImage(item.file, "gallery");

          galleryPayload.push({
            article_id: articleId,
            image_order: index + 1,
            src: imageUrl,
            alt: item.alt.trim() || form.title.trim(),
          });
        }

        if (galleryPayload.length > 0) {
          const { error: galleryError } = await supabase.from("article_gallery").insert(galleryPayload);

          if (galleryError) {
            throw new Error(`Gagal menyimpan gallery: ${galleryError.message}`);
          }
        }
      }

      /* =================================================
         FAQ
      ================================================= */

      const validFAQs = faqs.filter((faq) => faq.question.trim() && faq.answer.trim());

      if (validFAQs.length > 0) {
        const faqPayload = validFAQs.map((faq, index) => ({
          article_id: articleId,
          faq_order: index + 1,
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }));

        const { error: faqError } = await supabase.from("article_faq").insert(faqPayload);

        if (faqError) {
          throw new Error(`Gagal menyimpan FAQ: ${faqError.message}`);
        }
      }

      /* =================================================
         RELATED ARTICLES
      ================================================= */

      const validRelated = related.filter((item) => item.article_id > 0);

      if (validRelated.length > 0) {
        const relatedPayload = validRelated.map((item, index) => ({
          article_id: articleId,
          related_article_id: item.article_id,
          related_order: index + 1,
        }));

        const { error: relatedError } = await supabase.from("article_related").insert(relatedPayload);

        if (relatedError) {
          throw new Error(relatedError.message);
        }
      }

      /* =================================================
         SUCCESS
      ================================================= */

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan artikel.");
    } finally {
      setSaving(false);
      setSaveMode(null);
    }
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">
      <div className="mx-auto max-w-5xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <Link href="/admin/articles" className="text-sm font-medium text-[#0F4C81] hover:underline">
            ← Kembali ke Artikel
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C81]">CMS</p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">Tambah Artikel</h1>

          <p className="mt-3 text-slate-500">Tambahkan artikel lengkap beserta section, gallery, FAQ, dan artikel terkait.</p>
        </div>

        <form className="space-y-8">
          {/* =================================================
              ERROR
          ================================================= */}

          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {/* =================================================
              INFORMASI UTAMA
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Informasi Utama</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* BADGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Badge</label>

                <select name="badge" value={form.badge} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3">
                  <option value="Artikel">Artikel</option>

                  <option value="Proyek">Proyek</option>
                </select>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>

                <input name="category" value={form.category} onChange={handleChange} placeholder="Contoh: Konstruksi" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* TITLE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Judul *</label>

                <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Masukkan judul artikel" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* SLUG */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Slug *</label>

                <input name="slug" value={form.slug} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3" />

                <p className="mt-2 text-xs text-slate-400">
                  URL: /artikel/
                  {form.slug || "judul-artikel"}
                </p>
              </div>

              {/* EXCERPT */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Excerpt *</label>

                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={4} placeholder="Ringkasan singkat artikel..." className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* PUBLISHED DATE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tanggal Publikasi</label>

                <input type="datetime-local" name="published_at" value={form.published_at} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3" />

                <p className="mt-2 text-xs text-slate-400">Untuk Draft, tanggal ini tidak digunakan. Untuk Publish, jika kosong maka menggunakan waktu sekarang.</p>
              </div>

              {/* READING TIME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Waktu Baca</label>

                <input name="reading_time" value={form.reading_time} onChange={handleChange} placeholder="5 menit" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* COVER */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Cover *</label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setCoverFile(file);
                    setCoverPreview(URL.createObjectURL(file));
                  }}
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />

                {coverPreview && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                    <img src={coverPreview} alt="Preview cover" className="h-64 w-full object-cover" />
                  </div>
                )}

                {coverFile && <p className="mt-2 text-xs text-slate-500">File: {coverFile.name}</p>}

                <p className="mt-2 text-xs text-slate-400">Pilih gambar dari komputer. Gambar akan otomatis disimpan ke Supabase Storage saat artikel disimpan.</p>
              </div>

              {/* ALT COVER */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Alt Cover</label>

                <input name="cover_alt" value={form.cover_alt} onChange={handleChange} placeholder="Deskripsi gambar" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>
            </div>
          </div>

          {/* =================================================
              SECTIONS
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Sections</h2>

                <p className="mt-1 text-sm text-slate-500">Isi struktur utama artikel.</p>
              </div>

              <button type="button" onClick={addSection} className="rounded-lg bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white">
                + Tambah Section
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-xl border border-slate-200 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-bold">Section {sectionIndex + 1}</h3>

                    {sections.length > 1 && (
                      <button type="button" onClick={() => removeSection(sectionIndex)} className="text-sm font-semibold text-red-600">
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* HEADING */}

                  <input value={section.heading} onChange={(e) => updateSection(sectionIndex, "heading", e.target.value)} placeholder="Heading section" className="w-full rounded-lg border border-slate-300 px-4 py-3" />

                  {/* PARAGRAPHS */}

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold">Paragraph</label>

                      <button type="button" onClick={() => addParagraph(sectionIndex)} className="text-sm font-semibold text-[#0F4C81]">
                        + Paragraph
                      </button>
                    </div>

                    <div className="mt-3 space-y-3">
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <div key={paragraphIndex} className="flex gap-2">
                          <textarea value={paragraph} onChange={(e) => updateParagraph(sectionIndex, paragraphIndex, e.target.value)} rows={4} placeholder="Isi paragraph..." className="flex-1 rounded-lg border border-slate-300 px-4 py-3" />

                          {section.paragraphs.length > 1 && (
                            <button type="button" onClick={() => removeParagraph(sectionIndex, paragraphIndex)} className="text-red-500">
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LIST */}

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold">List</label>

                      <button type="button" onClick={() => addListItem(sectionIndex)} className="text-sm font-semibold text-[#0F4C81]">
                        + List Item
                      </button>
                    </div>

                    <div className="mt-3 space-y-3">
                      {section.list.map((item, listIndex) => (
                        <div key={listIndex} className="flex gap-2">
                          <input value={item} onChange={(e) => updateList(sectionIndex, listIndex, e.target.value)} placeholder="Isi list..." className="flex-1 rounded-lg border border-slate-300 px-4 py-3" />

                          <button type="button" onClick={() => removeListItem(sectionIndex, listIndex)} className="text-red-500">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TABLE */}

                  <div className="mt-6 rounded-lg bg-slate-50 p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={section.table.enabled}
                        onChange={(e) =>
                          updateSection(sectionIndex, "table", {
                            ...section.table,
                            enabled: e.target.checked,
                          })
                        }
                      />
                      Gunakan Table
                    </label>

                    {section.table.enabled && (
                      <div className="mt-5 overflow-x-auto">
                        <div className="mb-3 flex gap-2">
                          <button type="button" onClick={() => addTableColumn(sectionIndex)} className="rounded bg-white px-3 py-2 text-xs font-semibold">
                            + Kolom
                          </button>

                          <button type="button" onClick={() => addTableRow(sectionIndex)} className="rounded bg-white px-3 py-2 text-xs font-semibold">
                            + Baris
                          </button>
                        </div>

                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              {section.table.headers.map((header, columnIndex) => (
                                <th key={columnIndex} className="border p-2">
                                  <div className="flex gap-1">
                                    <input value={header} onChange={(e) => updateTableHeaders(sectionIndex, columnIndex, e.target.value)} placeholder="Header" className="w-full rounded border px-2 py-2 text-sm" />

                                    {section.table.headers.length > 1 && (
                                      <button type="button" onClick={() => removeTableColumn(sectionIndex, columnIndex)} className="text-red-500">
                                        ×
                                      </button>
                                    )}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {section.table.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, columnIndex) => (
                                  <td key={columnIndex} className="border p-2">
                                    <input value={cell} onChange={(e) => updateTableCell(sectionIndex, rowIndex, columnIndex, e.target.value)} className="w-full rounded border px-2 py-2 text-sm" />
                                  </td>
                                ))}

                                <td className="border p-2">
                                  <button type="button" onClick={() => removeTableRow(sectionIndex, rowIndex)} className="text-red-500">
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              GALLERY
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Gallery</h2>

                <p className="mt-1 text-sm text-slate-500">Gambar tambahan artikel.</p>
              </div>

              <button type="button" onClick={addGallery} className="rounded-lg bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white">
                + Tambah Gambar
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {gallery.map((item, index) => (
                <div key={index} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">Gambar {index + 1}</h3>

                    <button type="button" onClick={() => removeGallery(index)} className="text-sm font-semibold text-red-600">
                      Hapus
                    </button>
                  </div>

                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        setGallery((prev) =>
                          prev.map((galleryItem, i) =>
                            i === index
                              ? {
                                  ...galleryItem,
                                  file,
                                  preview: URL.createObjectURL(file),
                                }
                              : galleryItem,
                          ),
                        );
                      }}
                      className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                    />
                  </div>

                  {item.preview && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                      <img src={item.preview} alt={item.alt || `Gallery ${index + 1}`} className="h-48 w-full object-cover" />
                    </div>
                  )}

                  <input value={item.alt} onChange={(e) => updateGalleryAlt(index, e.target.value)} placeholder="Alt gambar" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              FAQ
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">FAQ</h2>

                <p className="mt-1 text-sm text-slate-500">Pertanyaan yang sering ditanyakan.</p>
              </div>

              <button type="button" onClick={addFAQ} className="rounded-lg bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white">
                + Tambah FAQ
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">FAQ {index + 1}</h3>

                    <button type="button" onClick={() => removeFAQ(index)} className="text-sm font-semibold text-red-600">
                      Hapus
                    </button>
                  </div>

                  <input value={faq.question} onChange={(e) => updateFAQ(index, "question", e.target.value)} placeholder="Pertanyaan" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" />

                  <textarea value={faq.answer} onChange={(e) => updateFAQ(index, "answer", e.target.value)} placeholder="Jawaban" rows={4} className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              RELATED ARTICLES
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Artikel Terkait</h2>

                <p className="mt-1 text-sm text-slate-500">Pilih artikel lain yang relevan dengan artikel ini.</p>
              </div>

              <button type="button" onClick={addRelated} className="rounded-lg bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b3d68]">
                + Tambah Artikel
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {related.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm text-slate-500">Belum ada artikel terkait.</p>

                  <button type="button" onClick={addRelated} className="mt-3 text-sm font-semibold text-[#0F4C81]">
                    + Tambah Artikel Terkait
                  </button>
                </div>
              )}

              {related.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select value={item.article_id} onChange={(e) => updateRelated(index, Number(e.target.value))} className="flex-1 rounded-lg border border-slate-300 px-4 py-3">
                    <option value={0}>Pilih artikel...</option>

                    {availableArticles
                      .filter((article) => article.id !== undefined)
                      .map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.title}
                        </option>
                      ))}
                  </select>

                  <button type="button" onClick={() => removeRelated(index)} className="text-red-500">
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="flex flex-col justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <Link href="/admin/articles" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700">
              Batal
            </Link>

            {/* DRAFT */}
            <button type="button" onClick={handlePreview} disabled={saving} className="rounded-lg border border-[#0F4C81] bg-white px-5 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-blue-50 disabled:opacity-60">
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={saving}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && saveMode === "draft" ? "Menyimpan..." : "Simpan Draft"}
            </button>

            {/* PUBLISH */}

            <button
              type="button"
              onClick={() => handleSubmit("published")}
              disabled={saving}
              className="rounded-lg bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c3d68] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && saveMode === "published" ? "Menerbitkan..." : "Publish Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
