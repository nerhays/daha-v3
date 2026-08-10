import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ContentGalleryProps {
  images: GalleryImage[];
}

export default function ContentGallery({ images }: ContentGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C81]">Dokumentasi</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">Dokumentasi Proyek</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={`${image.src}-${index}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
