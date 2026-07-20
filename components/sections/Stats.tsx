import FadeUp from "../ui/FadeUp";

const stats = [
  {
    value: "20+",
    title: "Tahun Pengalaman",
  },
  {
    value: "600+",
    title: "Project",
  },
  {
    value: "100+",
    title: "Our Client",
  },
  {
    value: "50+",
    title: "Unit Alat",
  },
];

export default function Stats() {
  return (
    <FadeUp>
      <section id="stats" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.title} className="rounded-xl border p-8 text-center shadow-sm">
              <h2 className="text-5xl font-bold text-blue-800">{item.value}</h2>

              <p className="mt-4 text-gray-500">{item.title}</p>
            </div>
          ))}
        </div>
      </section>
    </FadeUp>
  );
}
