import { CalendarDays, Clock3, FolderOpen } from "lucide-react";

interface ContentHeroProps {
  badge: string;
  title: string;
  excerpt: string;

  metadata: {
    category: string;
    publishedAt?: string;
    updatedAt?: string;
    readingTime?: string;
  };
}

export default function ContentHero({ badge, title, excerpt, metadata }: ContentHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-14">
        {/* Badge */}
        <span className="inline-flex rounded-full bg-[#0F4C81]/10 px-4 py-1 text-sm font-semibold text-[#0F4C81]">{badge}</span>

        {/* Title */}
        <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">{title}</h1>

        {/* Excerpt */}
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{excerpt}</p>

        {/* Metadata */}
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <FolderOpen size={18} />
            <span>{metadata.category}</span>
          </div>

          {metadata.publishedAt && (
            <div className="flex items-center gap-2">
              <CalendarDays size={18} />
              <span>{metadata.publishedAt}</span>
            </div>
          )}

          {metadata.readingTime && (
            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              <span>{metadata.readingTime}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
