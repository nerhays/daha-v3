import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ContentBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function ContentBreadcrumb({ items }: ContentBreadcrumbProps) {
  return (
    <section className="border-b border-slate-200 bg-white  pt-25">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="text-slate-500 transition hover:text-[#0F4C81]">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-900">{item.label}</span>
              )}

              {index !== items.length - 1 && <ChevronRight size={16} className="text-slate-400" />}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}
