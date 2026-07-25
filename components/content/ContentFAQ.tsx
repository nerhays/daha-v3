"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ContentFAQProps {
  items: FAQItem[];
}

export default function ContentFAQ({ items }: ContentFAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!items.length) return null;

  return (
    <section className="relative bg-white py-20">
      <div className="absolute top-0 left-1/2 h-px w-full max-w-5xl -translate-x-1/2 bg-slate-200" />

      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-10 text-3xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan</h2>

        <div className="space-y-4">
          {items.map((faq, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-slate-200">
              <button onClick={() => toggle(index)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="font-semibold text-slate-800">{faq.question}</span>

                <ChevronDown className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`} size={20} />
              </button>

              <div className={`grid transition-all duration-300 ${activeIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-slate-200 px-6 py-5 text-slate-600 leading-8">{faq.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
