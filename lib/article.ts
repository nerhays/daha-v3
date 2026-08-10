import { articleContents } from "@/data/content/articles";
import { ContentData } from "@/types/content";

export function getArticleContent(slug: string): ContentData | undefined {
  return articleContents[slug];
}

export function getAllArticles() {
  return Object.entries(articleContents).map(([slug, content]) => ({
    slug,
    ...content,
  }));
}

export function getFeaturedProjects(limit = 3) {
  return Object.entries(articleContents)
    .map(([slug, content]) => ({
      slug,
      ...content,
    }))
    .filter((content) => content.badge === "Proyek")
    .sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt ?? "1970-01-01").getTime();

      const dateB = new Date(b.metadata.publishedAt ?? "1970-01-01").getTime();

      return dateB - dateA;
    })
    .slice(0, limit);
}
