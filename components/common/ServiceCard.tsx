import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

export default function ServiceCard({ title, description, image, slug }: Props) {
  return (
    <Link href={/*`/layanan/${slug}`*/ "/under-construction"} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-110" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-7">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>

        <p className="mt-4 leading-8 text-slate-500">{description}</p>

        <div className="mt-8 flex items-center gap-3 font-semibold text-[#0F4C81]">
          Pelajari Layanan
          <ArrowRight size={18} className="transition group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
}
