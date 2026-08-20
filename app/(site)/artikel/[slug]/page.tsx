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
