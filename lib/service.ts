import { serviceContents } from "@/data/content/services";
import { ContentData } from "@/types/content";

export function getServiceContent(slug: string): ContentData | undefined {
  return serviceContents[slug];
}
