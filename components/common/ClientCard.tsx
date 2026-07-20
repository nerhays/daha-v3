import Image from "next/image";

type Props = {
  logo: string;
  name: string;
};

export default function ClientCard({ logo, name }: Props) {
  return (
    <div className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-xl">
      <Image src={logo} alt={name} width={140} height={70} className="object-contain opacity-70 transition-all duration-300 hover:scale-105 hover:opacity-100" />
    </div>
  );
}
