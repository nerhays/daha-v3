type Props = {
  badge: string;
  title: string;
  description?: string;
  center?: boolean;
};

export default function SectionTitle({ badge, title, description, center = false }: Props) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F4C81]">{badge}</p>

      <h2 className="mt-4 text-4xl font-bold text-slate-900 lg:text-5xl">{title}</h2>

      {description && <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-500">{description}</p>}
    </div>
  );
}
