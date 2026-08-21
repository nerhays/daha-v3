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
import { ContentData } from "@/types/content";

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
  headers: string[];
  rows: string[][];
};

type ArticleFaqRow = {
  id: number;
  article_id: number;
  faq_order: number;
  question: string;
  answer: string;
};

type ArticleGalleryRow = {
  id: number;
  article_id: number;
  image_order: number;
  src: string;
  alt: string;
};

type ArticleRelatedRow = {
  id: number;
  article_id: number;
  related_article_id: number;
  related_order: number;
};

type ArticleRow = {
  id: number;
  slug: string;
  badge: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  updated_at: string | null;
  reading_time: string | null;
  cover_src: string;
  cover_alt: string;
};

/**
 * =========================================================
 * GET ALL ARTICLES
 * =========================================================
 */

export async function getAllArticles(): Promise<Array<ContentData & { slug: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("articles").select("*").not("published_at", "is", null).order("published_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil semua artikel:", error);
    return [];
  }

  return (data as ArticleRow[]).map((article) => ({
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

/**
 * =========================================================
 * GET ARTICLE DETAIL
 * =========================================================
 */

export async function getArticleContent(slug: string): Promise<ContentData | undefined> {
  const supabase = await createClient();

  const { data: article, error: articleError } = await supabase.from("articles").select("*").eq("slug", slug).not("published_at", "is", null).maybeSingle();

  if (articleError || !article) {
    console.error("Article error:", articleError);
    return undefined;
  }

  const articleRow = article as ArticleRow;

  const [sectionsResult, faqResult, galleryResult, relatedResult] = await Promise.all([
    supabase.from("article_sections").select("*").eq("article_id", articleRow.id).order("section_order", { ascending: true }),

    supabase.from("article_faq").select("*").eq("article_id", articleRow.id).order("faq_order", { ascending: true }),

    supabase.from("article_gallery").select("*").eq("article_id", articleRow.id).order("image_order", { ascending: true }),

    supabase.from("article_related").select("*").eq("article_id", articleRow.id).order("related_order", { ascending: true }),
  ]);

  if (sectionsResult.error) {
    console.error("Sections error:", sectionsResult.error);
    return undefined;
  }

  const sections = (sectionsResult.data ?? []) as ArticleSectionRow[];
  const faq = (faqResult.data ?? []) as ArticleFaqRow[];
  const gallery = (galleryResult.data ?? []) as ArticleGalleryRow[];
  const related = (relatedResult.data ?? []) as ArticleRelatedRow[];
  let relatedArticles: ArticleRow[] = [];

  const relatedArticleIds = related.map((item) => item.related_article_id);

  if (relatedArticleIds.length > 0) {
    const { data, error } = await supabase.from("articles").select("*").in("id", relatedArticleIds);

    if (error) {
      console.error("Related articles detail error:", error);
      return undefined;
    }

    relatedArticles = (data ?? []) as ArticleRow[];
  }
  const sectionIds = sections.map((section) => section.id);

  let tables: ArticleSectionTableRow[] = [];

  if (sectionIds.length > 0) {
    const { data, error } = await supabase.from("article_section_tables").select("*").in("section_id", sectionIds);

    if (error) {
      console.error("Tables error:", error);
      return undefined;
    }

    tables = (data ?? []) as ArticleSectionTableRow[];
  }

  return {
    badge: articleRow.badge,
    title: articleRow.title,
    excerpt: articleRow.excerpt,

    metadata: {
      category: articleRow.category,
      publishedAt: articleRow.published_at ?? undefined,
      updatedAt: articleRow.updated_at ?? undefined,
      readingTime: articleRow.reading_time ?? undefined,
    },

    cover: {
      src: articleRow.cover_src,
      alt: articleRow.cover_alt,
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
      gallery.length > 0
        ? gallery.map((item) => ({
            src: item.src,
            alt: item.alt,
          }))
        : undefined,

    faq:
      faq.length > 0
        ? faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        : undefined,

    related:
      related.length > 0
        ? related
            .map((relation) => {
              const article = relatedArticles.find((item) => item.id === relation.related_article_id);

              if (!article) return null;

              return {
                title: article.title,
                slug: article.slug,
                cover: article.cover_src,
              };
            })
            .filter(
              (
                item,
              ): item is {
                title: string;
                slug: string;
                cover: string;
              } => item !== null,
            )
        : undefined,
  };
}

/**
 * =========================================================
 * FEATURED PROJECTS
 * =========================================================
 */

export async function getFeaturedProjects(limit = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      slug,
      badge,
      title,
      excerpt,
      category,
      published_at,
      updated_at,
      reading_time,
      cover_src,
      cover_alt
    `,
    )
    .eq("badge", "Proyek")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Gagal mengambil proyek unggulan:", error);
    return [];
  }

  return (data as ArticleRow[]).map((article) => ({
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
