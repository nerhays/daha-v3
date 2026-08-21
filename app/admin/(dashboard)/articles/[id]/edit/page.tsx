"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

/* =====================================================
   HELPERS
===================================================== */

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDateTimeLocal(date: string) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/* =====================================================
   TYPES
===================================================== */

type Section = {
  id?: number;
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
  id?: number;
  file: File | null;
  preview: string;
  alt: string;
  src?: string;
};

type FAQ = {
  id?: number;
  question: string;
  answer: string;
};

type RelatedArticle = {
  article_id: number;
  title: string;
  cover_src: string;
};

type AvailableArticle = {
  id: number;
  title: string;
  cover_src: string;
};

/* =====================================================
   DATABASE TYPES
===================================================== */

type ArticleRow = {
  id: number;
  badge: string | null;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
  reading_time: string | null;
  cover_src: string | null;
  cover_alt: string | null;
};

type ArticleSectionRow = {
  id: number;
  article_id: number;
  section_order: number;
  heading: string | null;
  paragraphs: string[] | null;
  list: string[] | null;
};

type ArticleSectionTableRow = {
  id: number;
  section_id: number;
  headers: string[] | null;
  rows: string[][] | null;
};

type GalleryRow = {
  id: number;
  article_id: number;
  image_order: number;
  src: string;
  alt: string | null;
};

type FAQRow = {
  id: number;
  article_id: number;
  faq_order: number;
  question: string | null;
  answer: string | null;
};

type RelatedRow = {
  id: number;
  article_id: number;
  related_article_id: number;
  related_order: number;
};

type RelatedArticleData = {
  id: number;
  title: string;
  cover_src: string;
};

/* =====================================================
   DEFAULT
===================================================== */

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

/* =====================================================
   PAGE
===================================================== */

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

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
     STATE
  ===================================================== */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [sections, setSections] = useState<Section[]>([emptySection()]);

  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [related, setRelated] = useState<RelatedArticle[]>([]);

  const [availableArticles, setAvailableArticles] = useState<AvailableArticle[]>([]);

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      return;
    }

    let cancelled = false;

    async function init() {
      setLoading(true);
      setError("");

      try {
        /* =================================================
           AVAILABLE ARTICLES
        ================================================= */

        const { data: articlesData, error: articlesError } = await supabase.from("articles").select("id, title, cover_src").order("published_at", {
          ascending: false,
        });

        if (cancelled) return;

        if (articlesError) {
          throw new Error(articlesError.message);
        }

        setAvailableArticles((articlesData as AvailableArticle[] | null) ?? []);

        /* =================================================
           ARTICLE
        ================================================= */

        const { data: article, error: articleError } = await supabase.from("articles").select("*").eq("id", id).single();

        if (cancelled) return;

        if (articleError || !article) {
          throw new Error(articleError?.message || "Artikel tidak ditemukan.");
        }

        const articleData = article as ArticleRow;

        setForm({
          badge: articleData.badge ?? "Artikel",
          title: articleData.title ?? "",
          slug: articleData.slug ?? "",
          excerpt: articleData.excerpt ?? "",
          category: articleData.category ?? "",
          published_at: articleData.published_at ? formatDateTimeLocal(articleData.published_at) : "",
          reading_time: articleData.reading_time ?? "",
          cover_src: articleData.cover_src ?? "",
          cover_alt: articleData.cover_alt ?? "",
        });

        setCoverPreview(articleData.cover_src ?? "");

        /* =================================================
           SECTIONS
        ================================================= */

        const { data: sectionData, error: sectionError } = await supabase.from("article_sections").select("*").eq("article_id", id).order("section_order", {
          ascending: true,
        });

        if (cancelled) return;

        if (sectionError) {
          throw new Error(sectionError.message);
        }

        const loadedSections = (sectionData as ArticleSectionRow[] | null) ?? [];

        /* =================================================
           SECTION TABLES
        ================================================= */

        let tableData: ArticleSectionTableRow[] = [];

        if (loadedSections.length > 0) {
          const sectionIds = loadedSections.map((section) => section.id);

          const { data: tables, error: tableError } = await supabase.from("article_section_tables").select("*").in("section_id", sectionIds);

          if (cancelled) return;

          if (tableError) {
            throw new Error(tableError.message);
          }

          tableData = (tables as ArticleSectionTableRow[] | null) ?? [];
        }

        const mappedSections: Section[] =
          loadedSections.length > 0
            ? loadedSections.map((section) => {
                const table = tableData.find((item) => item.section_id === section.id);

                return {
                  id: section.id,

                  heading: section.heading ?? "",

                  paragraphs: section.paragraphs && section.paragraphs.length > 0 ? section.paragraphs : [""],

                  list: section.list && section.list.length > 0 ? section.list : [""],

                  table: {
                    enabled: !!table,

                    headers: table?.headers && table.headers.length > 0 ? table.headers : [""],

                    rows: table?.rows && table.rows.length > 0 ? table.rows : [[""]],
                  },
                };
              })
            : [emptySection()];

        setSections(mappedSections);

        /* =================================================
           GALLERY
        ================================================= */

        const { data: galleryData, error: galleryError } = await supabase.from("article_gallery").select("*").eq("article_id", id).order("image_order", {
          ascending: true,
        });

        if (cancelled) return;

        if (galleryError) {
          throw new Error(galleryError.message);
        }

        const galleryRows = (galleryData as GalleryRow[] | null) ?? [];

        setGallery(
          galleryRows.map((item) => ({
            id: item.id,
            file: null,
            preview: item.src,
            src: item.src,
            alt: item.alt ?? "",
          })),
        );

        /* =================================================
           FAQ
        ================================================= */

        const { data: faqData, error: faqError } = await supabase.from("article_faq").select("*").eq("article_id", id).order("faq_order", {
          ascending: true,
        });

        if (cancelled) return;

        if (faqError) {
          throw new Error(faqError.message);
        }

        const faqRows = (faqData as FAQRow[] | null) ?? [];

        setFaqs(
          faqRows.map((item) => ({
            id: item.id,
            question: item.question ?? "",
            answer: item.answer ?? "",
          })),
        );

        /* =================================================
           RELATED
        ================================================= */

        const { data: relatedData, error: relatedError } = await supabase.from("article_related").select("*").eq("article_id", id).order("related_order", {
          ascending: true,
        });

        if (cancelled) return;

        if (relatedError) {
          throw new Error(relatedError.message);
        }

        const relatedRows = (relatedData as RelatedRow[] | null) ?? [];

        if (relatedRows.length > 0) {
          const relatedIds = relatedRows.map((item) => item.related_article_id);

          const { data: relatedArticles, error: relatedArticlesError } = await supabase.from("articles").select("id, title, cover_src").in("id", relatedIds);

          if (cancelled) return;

          if (relatedArticlesError) {
            throw new Error(relatedArticlesError.message);
          }

          const relatedArticleRows = (relatedArticles as RelatedArticleData[] | null) ?? [];

          const mappedRelated = relatedRows
            .map((item) => {
              const article = relatedArticleRows.find((a) => a.id === item.related_article_id);

              if (!article) {
                return null;
              }

              return {
                article_id: article.id,
                title: article.title,
                cover_src: article.cover_src,
              };
            })
            .filter((item): item is RelatedArticle => item !== null);

          setRelated(mappedRelated);
        } else {
          setRelated([]);
        }
      } catch (err) {
        if (cancelled) return;

        console.error(err);

        setError(err instanceof Error ? err.message : "Gagal mengambil artikel.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* =====================================================
     INVALID ID
  ===================================================== */

  if (!id || Number.isNaN(id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">ID artikel tidak valid.</div>
      </div>
    );
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
        if (index !== sectionIndex) {
          return section;
        }

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
        if (index !== sectionIndex) {
          return section;
        }

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
        if (index !== sectionIndex) {
          return section;
        }

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
        if (index !== sectionIndex) {
          return section;
        }

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
        if (i !== sectionIndex) {
          return section;
        }

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
        if (i !== sectionIndex) {
          return section;
        }

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
        if (i !== sectionIndex) {
          return section;
        }

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
        if (i !== sectionIndex) {
          return section;
        }

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
        if (i !== sectionIndex) {
          return section;
        }

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
        if (i !== sectionIndex) {
          return section;
        }

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
     UPLOAD
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
     SUBMIT UPDATE
  ===================================================== */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSaving(true);

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

      /* =================================================
         CHECK SLUG
      ================================================= */

      const { data: existingArticle } = await supabase.from("articles").select("id").eq("slug", form.slug.trim()).neq("id", id).maybeSingle();

      if (existingArticle) {
        throw new Error("Slug sudah digunakan artikel lain.");
      }

      /* =================================================
         COVER
      ================================================= */

      let coverUrl = form.cover_src;

      if (coverFile) {
        coverUrl = await uploadImage(coverFile, "covers");
      }

      /* =================================================
         UPDATE ARTICLE
      ================================================= */

      const { error: articleError } = await supabase
        .from("articles")
        .update({
          badge: form.badge,
          title: form.title.trim(),
          slug: form.slug.trim(),
          excerpt: form.excerpt.trim(),
          category: form.category.trim() || "Umum",
          published_at: form.published_at || null,
          updated_at: new Date().toISOString(),
          reading_time: form.reading_time.trim() || null,
          cover_src: coverUrl,
          cover_alt: form.cover_alt.trim() || form.title.trim(),
        })
        .eq("id", id);

      if (articleError) {
        throw new Error(articleError.message);
      }

      /* =================================================
         DELETE OLD SECTION TABLES
      ================================================= */

      const { data: oldSections } = await supabase.from("article_sections").select("id").eq("article_id", id);

      if (oldSections && oldSections.length > 0) {
        const sectionIds = oldSections.map((section) => section.id);

        const { error: oldTableError } = await supabase.from("article_section_tables").delete().in("section_id", sectionIds);

        if (oldTableError) {
          throw new Error(oldTableError.message);
        }
      }

      /* =================================================
         DELETE OLD SECTIONS
      ================================================= */

      const { error: oldSectionError } = await supabase.from("article_sections").delete().eq("article_id", id);

      if (oldSectionError) {
        throw new Error(oldSectionError.message);
      }

      /* =================================================
         INSERT SECTIONS
      ================================================= */

      const validSections = sections.filter((section) => section.heading.trim() || section.paragraphs.some((p) => p.trim()) || section.list.some((item) => item.trim()) || section.table.enabled);

      if (validSections.length > 0) {
        const sectionPayload = validSections.map((section, index) => ({
          article_id: id,
          section_order: index + 1,
          heading: section.heading.trim() || null,
          paragraphs: section.paragraphs.filter((p) => p.trim()),
          list: section.list.filter((item) => item.trim()),
        }));

        const { data: insertedSections, error: sectionError } = await supabase.from("article_sections").insert(sectionPayload).select("id, section_order");

        if (sectionError) {
          throw new Error(sectionError.message);
        }

        /* =================================================
           INSERT TABLES
        ================================================= */

        if (insertedSections) {
          const tablePayload: {
            section_id: number;
            headers: string[];
            rows: string[][];
          }[] = [];

          validSections.forEach((section, index) => {
            if (!section.table.enabled) {
              return;
            }

            const headers = section.table.headers.map((header) => header.trim()).filter(Boolean);

            if (headers.length === 0) {
              return;
            }

            const rows = section.table.rows.map((row) => row.map((cell) => cell.trim())).filter((row) => row.some((cell) => cell));

            const insertedSection = insertedSections[index];

            if (!insertedSection) {
              return;
            }

            tablePayload.push({
              section_id: insertedSection.id,
              headers,
              rows,
            });
          });

          if (tablePayload.length > 0) {
            const { error: tableError } = await supabase.from("article_section_tables").insert(tablePayload);

            if (tableError) {
              throw new Error(tableError.message);
            }
          }
        }
      }

      /* =================================================
         DELETE OLD GALLERY
      ================================================= */

      const { error: galleryDeleteError } = await supabase.from("article_gallery").delete().eq("article_id", id);

      if (galleryDeleteError) {
        throw new Error(galleryDeleteError.message);
      }

      /* =================================================
         INSERT GALLERY
      ================================================= */

      if (gallery.length > 0) {
        const galleryPayload: {
          article_id: number;
          image_order: number;
          src: string;
          alt: string;
        }[] = [];

        for (let index = 0; index < gallery.length; index++) {
          const item = gallery[index];

          let imageUrl = item.src || "";

          if (item.file) {
            imageUrl = await uploadImage(item.file, "gallery");
          }

          if (!imageUrl) {
            continue;
          }

          galleryPayload.push({
            article_id: id,
            image_order: index + 1,
            src: imageUrl,
            alt: item.alt.trim() || form.title.trim(),
          });
        }

        if (galleryPayload.length > 0) {
          const { error: galleryError } = await supabase.from("article_gallery").insert(galleryPayload);

          if (galleryError) {
            throw new Error(galleryError.message);
          }
        }
      }

      /* =================================================
         DELETE OLD FAQ
      ================================================= */

      const { error: faqDeleteError } = await supabase.from("article_faq").delete().eq("article_id", id);

      if (faqDeleteError) {
        throw new Error(faqDeleteError.message);
      }

      /* =================================================
         INSERT FAQ
      ================================================= */

      const validFAQs = faqs.filter((faq) => faq.question.trim() && faq.answer.trim());

      if (validFAQs.length > 0) {
        const faqPayload = validFAQs.map((faq, index) => ({
          article_id: id,
          faq_order: index + 1,
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }));

        const { error: faqError } = await supabase.from("article_faq").insert(faqPayload);

        if (faqError) {
          throw new Error(faqError.message);
        }
      }

      /* =================================================
         DELETE OLD RELATED
      ================================================= */

      const { error: relatedDeleteError } = await supabase.from("article_related").delete().eq("article_id", id);

      if (relatedDeleteError) {
        throw new Error(relatedDeleteError.message);
      }

      /* =================================================
         INSERT RELATED
      ================================================= */

      const validRelated = related.filter((item) => item.article_id > 0);

      if (validRelated.length > 0) {
        const relatedPayload = validRelated.map((item, index) => ({
          article_id: id,
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
      console.error(err);

      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Memuat artikel...</div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}

        <div className="mb-8">
          <Link href="/admin/articles" className="text-sm font-medium text-[#0F4C81] hover:underline">
            ← Kembali ke Artikel
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C81]">CMS</p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">Edit Artikel</h1>

          <p className="mt-3 text-slate-500">Ubah artikel beserta section, gallery, FAQ, dan artikel terkait.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* DATE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tanggal Publikasi</label>

                <input type="datetime-local" name="published_at" value={form.published_at} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* READING TIME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Waktu Baca</label>

                <input name="reading_time" value={form.reading_time} onChange={handleChange} placeholder="5 menit" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
              </div>

              {/* COVER */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Cover</label>

                {coverPreview && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                    <img src={coverPreview} alt="Cover artikel" className="h-64 w-full object-cover" />
                  </div>
                )}

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

                <p className="mt-2 text-xs text-slate-400">Kosongkan jika ingin mempertahankan cover lama.</p>
              </div>

              {/* COVER ALT */}

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
                <div key={section.id ?? sectionIndex} className="rounded-xl border border-slate-200 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-bold">Section {sectionIndex + 1}</h3>

                    {sections.length > 1 && (
                      <button type="button" onClick={() => removeSection(sectionIndex)} className="text-sm font-semibold text-red-600">
                        Hapus
                      </button>
                    )}
                  </div>

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
                <div key={item.id ?? index} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">Gambar {index + 1}</h3>

                    <button type="button" onClick={() => removeGallery(index)} className="text-sm font-semibold text-red-600">
                      Hapus
                    </button>
                  </div>

                  {item.preview && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                      <img src={item.preview} alt={item.alt || `Gallery ${index + 1}`} className="h-48 w-full object-cover" />
                    </div>
                  )}

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
                    className="mt-4 block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                  />

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
                <div key={faq.id ?? index} className="rounded-xl border border-slate-200 p-5">
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
              RELATED
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
                      .filter((article) => article.id !== id && article.id !== undefined)
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

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <Link href="/admin/articles" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
              Batal
            </Link>

            <button type="submit" disabled={saving} className="rounded-lg bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
