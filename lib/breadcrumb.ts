import { ContentType } from "@/types/content";
import { BreadcrumbItem } from "@/types/content";

export function createBreadcrumb(type: ContentType, title: string): BreadcrumbItem[] {
  const home = { label: "Beranda", href: "/" };

  switch (type) {
    case "article":
      return [home, { label: "Artikel", href: "/artikel" }, { label: title }];

    case "project":
      return [home, { label: "Artikel", href: "/artikel" }, { label: title }];

    case "service":
      return [home, { label: "Layanan", href: "/layanan" }, { label: title }];
  }
}
