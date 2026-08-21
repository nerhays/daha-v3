import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ContentBreadcrumb from "@/components/content/ContentBreadcrumb";
import ContentHero from "@/components/content/ContentHero";
import ContentCover from "@/components/content/ContentCover";
import ContentBody from "@/components/content/ContentBody";
import ContentGallery from "@/components/content/ContentGallery";
import ContentFAQ from "@/components/content/ContentFAQ";
import RelatedContent from "@/components/content/RelatedContent";
import ContentCTA from "@/components/content/ContentCTA";

import { createBreadcrumb } from "@/lib/breadcrumb";
import { getArticleContent } from "@/lib/article";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* =========================================================
   SITE CONFIG
========================================================= */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dahaborepile.com";

const SITE_NAME = "Daha Borepile";

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const data = await getArticleContent(slug);

  if (!data) {
    return {
      title: "Artikel Tidak Ditemukan | Daha Borepile",
      description: "Artikel yang Anda cari tidak ditemukan di Daha Borepile.",
    };
  }

  const title = data.title.trim();

  const description = data.excerpt.trim().replace(/\s+/g, " ").slice(0, 160);

  const canonicalUrl = `${SITE_URL}/artikel/${slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,

      url: canonicalUrl,

      siteName: SITE_NAME,

      type: "article",

      images: data.cover?.src
        ? [
            {
              url: data.cover.src,
              alt: data.cover.alt || title,
            },
          ]
        : undefined,

      ...(data.metadata.publishedAt
        ? {
            publishedTime: data.metadata.publishedAt,
          }
        : {}),

      ...(data.metadata.updatedAt
        ? {
            modifiedTime: data.metadata.updatedAt,
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",

      title: `${title} | ${SITE_NAME}`,

      description,

      images: data.cover?.src ? [data.cover.src] : undefined,
    },
  };
}

/* =========================================================
   ARTICLE PAGE
========================================================= */

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getArticleContent(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <ContentBreadcrumb items={createBreadcrumb("article", data.title)} />

      <ContentHero badge={data.badge} title={data.title} excerpt={data.excerpt} metadata={data.metadata} />

      <ContentCover src={data.cover.src} alt={data.cover.alt} />

      <ContentBody sections={data.sections} />

      {data.gallery && data.gallery.length > 0 && <ContentGallery images={data.gallery} />}

      {data.faq && data.faq.length > 0 && <ContentFAQ items={data.faq} />}

      {data.related && data.related.length > 0 && <RelatedContent articles={data.related} />}

      <ContentCTA whatsappUrl="https://wa.me/6281234354300" />
    </>
  );
}
