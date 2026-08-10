import { ContentSection } from "@/types/content";
import ContentTable from "./ContentTable";
interface ContentBodyProps {
  sections: ContentSection[];
}

export default function ContentBody({ sections }: ContentBodyProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {sections.map((section, index) => (
          <div key={index} className="mb-16">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">{section.heading}</h2>

            {section.paragraphs?.map((paragraph, idx) => (
              <p key={idx} className="mb-6 text-lg leading-9 text-slate-700">
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className="space-y-4 pl-6">
                {section.list.map((item, idx) => (
                  <li key={idx} className="list-disc text-lg leading-8 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.table && <ContentTable table={section.table} />}
          </div>
        ))}
      </div>
    </section>
  );
}
