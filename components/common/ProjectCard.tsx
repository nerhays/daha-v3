import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

type Props = {
  title: string;
  image: string;
  slug: string;
  category: string;
  date?: string;
  location?: string;
};
export default function ProjectCard({ title, image, slug, location, category, date }: Props) {
  return (
    <Link href={`/artikel/${slug}` /*"/under-construction" */} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-72 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-110" />
      </div>

      <div className="p-7">
        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-[#0F4C81]">{category}</span>

        <h3 className="mt-5 text-2xl font-bold leading-snug text-slate-900">{title}</h3>

        <div className="mt-6 space-y-2 text-sm text-slate-500">
          {date && (
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {date}
            </div>
          )}

          {location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {location}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 font-semibold text-[#0F4C81]">
          Baca Selengkapnya
          <ArrowRight size={18} className="transition group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
}
