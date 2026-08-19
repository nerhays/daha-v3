import { createClient } from "@/lib/supabase/server";
import { ContentData } from "@/types/content";

type ServiceRow = {
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

type ServiceSectionRow = {
  id: number;
  service_id: number;
  section_order: number;
  heading: string | null;
  paragraphs: string[] | null;
  list: string[] | null;
};
type ServiceFaqRow = {
  id: number;
  service_id: number;
  faq_order: number;
  question: string;
  answer: string;
};
export async function getServiceContent(slug: string): Promise<ContentData | undefined> {
  const supabase = await createClient();

  // =========================
  // SERVICE
  // =========================

  const { data: service, error: serviceError } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();

  if (serviceError || !service) {
    console.error("Service error:", serviceError);
    return undefined;
  }

  const serviceRow = service as ServiceRow;

  // =========================
  // SECTIONS
  // =========================

  const { data: sections, error: sectionsError } = await supabase.from("service_sections").select("*").eq("service_id", serviceRow.id).order("section_order", { ascending: true });
  const { data: faq, error: faqError } = await supabase.from("service_faq").select("*").eq("service_id", serviceRow.id).order("faq_order", { ascending: true });

  if (faqError) {
    console.error("Service FAQ error:", faqError);
    return undefined;
  }

  const faqRows = (faq ?? []) as ServiceFaqRow[];
  if (sectionsError) {
    console.error("Service sections error:", sectionsError);
    return undefined;
  }

  const sectionRows = (sections ?? []) as ServiceSectionRow[];

  // =========================
  // RETURN CONTENT DATA
  // =========================

  return {
    badge: serviceRow.badge,

    title: serviceRow.title,

    excerpt: serviceRow.excerpt,

    metadata: {
      category: serviceRow.category,
      publishedAt: serviceRow.published_at ?? undefined,
      updatedAt: serviceRow.updated_at ?? undefined,
      readingTime: serviceRow.reading_time ?? undefined,
    },

    cover: {
      src: serviceRow.cover_src,
      alt: serviceRow.cover_alt,
    },

    sections: sectionRows.map((section) => ({
      heading: section.heading ?? undefined,
      paragraphs: section.paragraphs ?? undefined,
      list: section.list ?? undefined,
    })),
    faq:
      faqRows.length > 0
        ? faqRows.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        : undefined,
  };
}
