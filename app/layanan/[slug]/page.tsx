import { notFound } from "next/navigation";

import ContentBreadcrumb from "@/components/content/ContentBreadcrumb";
import ContentHero from "@/components/content/ContentHero";
import ContentCover from "@/components/content/ContentCover";
import ContentBody from "@/components/content/ContentBody";
import ContentFAQ from "@/components/content/ContentFAQ";
import ContentCTA from "@/components/content/ContentCTA";

import { createBreadcrumb } from "@/lib/breadcrumb";
import { getServiceContent } from "@/lib/service";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getServiceContent(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <ContentBreadcrumb items={createBreadcrumb("service", data.title)} />

      <ContentHero badge={data.badge} title={data.title} excerpt={data.excerpt} metadata={data.metadata} />

      <ContentCover src={data.cover.src} alt={data.cover.alt} />

      <ContentBody sections={data.sections} />

      {data.faq && data.faq.length > 0 && <ContentFAQ items={data.faq} />}

      <ContentCTA whatsappUrl="https://wa.me/6281234354300" />
    </>
  );
}
