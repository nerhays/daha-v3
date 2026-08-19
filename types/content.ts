export type ContentType = "article" | "project" | "service";
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export interface ContentMetadata {
  category: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface RelatedContent {
  title: string;
  slug: string;
  cover: string;
}

export interface ContentSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  table?: ContentTable;
}
export interface ContentTable {
  headers: string[];
  rows: string[][];
}
export interface ContentData {
  badge: string;
  landing_title?: string;
  landing_description?: string;
  title: string;
  excerpt: string;

  metadata: ContentMetadata;

  cover: {
    src: string;
    alt: string;
  };

  sections: ContentSection[];

  gallery?: GalleryImage[];

  faq?: FAQ[];

  related?: RelatedContent[];
}
