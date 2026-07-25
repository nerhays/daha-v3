import ContentHero from "@/components/content/ContentHero";
import ContentCover from "@/components/content/ContentCover";
import { sampleContent } from "@/data/sampleContent";
import ContentBody from "@/components/content/ContentBody";
import ContentFAQ from "@/components/content/ContentFAQ";
import ContentCTA from "@/components/content/ContentCTA";
import ContentBreadcrumb from "@/components/content/ContentBreadcrumb";
import { createBreadcrumb } from "@/lib/breadcrumb";
export default function TestPage() {
  return (
    <>
      <ContentBreadcrumb items={createBreadcrumb("article", sampleContent.title)} />
      <ContentHero badge={sampleContent.badge} title={sampleContent.title} excerpt={sampleContent.excerpt} metadata={sampleContent.metadata} />

      <ContentCover src={sampleContent.cover.src} alt={sampleContent.cover.alt} />

      <ContentBody sections={sampleContent.sections} />

      <ContentFAQ items={sampleContent.faq ?? []} />
      <ContentCTA whatsappUrl="https://wa.me/6281234354300" />
    </>
  );
}
