import Image from "next/image";

interface ContentCoverProps {
  src: string;
  alt: string;
}

export default function ContentCover({ src, alt }: ContentCoverProps) {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <Image src={src} alt={alt} width={1600} height={900} priority className="h-auto w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
