// import { articleContents } from "@/data/content/articles";
// import { ContentData } from "@/types/content";

// export function getArticleContent(slug: string): ContentData | undefined {
//   return articleContents[slug];
// }

// export function getAllArticles() {
//   return Object.entries(articleContents).map(([slug, content]) => ({
//     slug,
//     ...content,
//   }));
// }

// export function getFeaturedProjects(limit = 3) {
//   return Object.entries(articleContents)
//     .map(([slug, content]) => ({
//       slug,
//       ...content,
//     }))
//     .filter((content) => content.badge === "Proyek")
//     .sort((a, b) => {
//       const dateA = new Date(a.metadata.publishedAt ?? "1970-01-01").getTime();

//       const dateB = new Date(b.metadata.publishedAt ?? "1970-01-01").getTime();

//       return dateB - dateA;
//     })
//     .slice(0, limit);
// }
import { createClient } from "@/lib/supabase/server";
import { ContentData, ContentTable } from "@/types/content";
import { articleContents } from "@/data/content/articles";

export async function getAllArticles(): Promise<Array<ContentData & { slug: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("articles").select("*").order("published_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil semua artikel:", error);
    return [];
  }

  return data.map((article) => ({
    slug: article.slug,
    badge: article.badge,
    title: article.title,
    excerpt: article.excerpt,

    metadata: {
      category: article.category,
      publishedAt: article.published_at ?? undefined,
      updatedAt: article.updated_at ?? undefined,
      readingTime: article.reading_time ?? undefined,
    },

    cover: {
      src: article.cover_src,
      alt: article.cover_alt,
    },

    sections: [],
  }));
}

export async function getArticleContent(slug: string): Promise<ContentData | undefined> {
  const supabase = await createClient();
  type ArticleSectionTableRow = {
    section_id: number;
    headers: string[];
    rows: string[][];
  };
  // =========================
  // ARTICLE
  // =========================

  const { data: article, error: articleError } = await supabase.from("articles").select("*").eq("slug", slug).single();

  console.log("SLUG YANG DICARI:", slug);
  console.log("ARTICLE DARI SUPABASE:", article);
  console.log("ARTICLE ERROR:", articleError);

  if (articleError || !article) {
    console.error("Article error:", articleError);
    return undefined;
  }

  // =========================
  // SECTIONS
  // =========================

  const { data: sections, error: sectionsError } = await supabase.from("article_sections").select("*").eq("article_id", article.id).order("section_order", { ascending: true });

  if (sectionsError) {
    console.error("Sections error:", sectionsError);
    return undefined;
  }

  // =========================
  // TABLES
  // =========================

  const sectionIds = sections.map((section) => section.id);

  let tables: ArticleSectionTableRow[] = [];

  if (sectionIds.length > 0) {
    const { data, error } = await supabase.from("article_section_tables").select("*").in("section_id", sectionIds);

    if (error) {
      console.error("Tables error:", error);
      return undefined;
    }

    tables = data ?? [];
  }

  // =========================
  // FAQ
  // =========================

  const { data: faq } = await supabase.from("article_faq").select("*").eq("article_id", article.id).order("faq_order", { ascending: true });

  // =========================
  // GALLERY
  // =========================

  const { data: gallery } = await supabase.from("article_gallery").select("*").eq("article_id", article.id).order("image_order", { ascending: true });

  // =========================
  // RELATED
  // =========================

  const { data: related } = await supabase.from("article_related").select("*").eq("article_id", article.id).order("related_order", { ascending: true });

  // =========================
  // CONVERT TO CONTENTDATA
  // =========================

  return {
    badge: article.badge,

    title: article.title,

    excerpt: article.excerpt,

    metadata: {
      category: article.category,
      publishedAt: article.published_at ?? undefined,
      updatedAt: article.updated_at ?? undefined,
      readingTime: article.reading_time ?? undefined,
    },

    cover: {
      src: article.cover_src,
      alt: article.cover_alt,
    },

    sections: sections.map((section) => {
      const table = tables.find((item) => item.section_id === section.id);

      return {
        heading: section.heading ?? undefined,
        paragraphs: section.paragraphs ?? undefined,
        list: section.list ?? undefined,

        ...(table
          ? {
              table: {
                headers: table.headers,
                rows: table.rows,
              },
            }
          : {}),
      };
    }),

    gallery:
      gallery && gallery.length > 0
        ? gallery.map((item) => ({
            src: item.src,
            alt: item.alt,
          }))
        : undefined,

    faq:
      faq && faq.length > 0
        ? faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        : undefined,

    related:
      related && related.length > 0
        ? related.map((item) => ({
            title: item.title,
            slug: item.slug,
            cover: item.cover,
          }))
        : undefined,
  };
}
export async function getFeaturedProjects(limit = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("articles").select("*").eq("badge", "Proyek").order("published_at", { ascending: false }).limit(limit);

  if (error) {
    console.error("Gagal mengambil proyek unggulan:", error);
    return [];
  }

  return data.map((article) => ({
    slug: article.slug,
    badge: article.badge,
    title: article.title,
    excerpt: article.excerpt,

    metadata: {
      category: article.category,
      publishedAt: article.published_at ?? undefined,
      updatedAt: article.updated_at ?? undefined,
      readingTime: article.reading_time ?? undefined,
    },

    cover: {
      src: article.cover_src,
      alt: article.cover_alt,
    },

    sections: [],
  }));
}
