import { ContentData } from "@/types/content";

export const sampleContent: ContentData = {
  badge: "Artikel",

  title: "Apa Itu Bore Pile?",

  excerpt: "Pelajari pengertian bore pile, fungsi, kelebihan, serta tahapan pengerjaannya dalam berbagai proyek konstruksi.",

  metadata: {
    category: "Pondasi",
    publishedAt: "20 Juli 2026",
    readingTime: "6 menit membaca",
  },

  cover: {
    src: "/images/article/borepile.jpg",
    alt: "Pekerjaan Bore Pile oleh DAHA Borepile",
  },

  sections: [
    {
      heading: "Apa Itu Bore Pile?",
      paragraphs: [
        "Bore pile merupakan salah satu jenis pondasi dalam yang dibuat dengan cara mengebor tanah hingga kedalaman tertentu sebelum diisi tulangan dan beton.",
        "Metode ini banyak digunakan pada proyek gedung bertingkat, jembatan, maupun infrastruktur lainnya.",
      ],
    },

    {
      heading: "Keunggulan Bore Pile",
      list: ["Tidak menimbulkan getaran.", "Cocok untuk area padat penduduk.", "Daya dukung tinggi.", "Dapat digunakan pada berbagai kondisi tanah."],
    },

    {
      heading: "Tahapan Pengerjaan",
      paragraphs: ["Pengerjaan dimulai dengan pengeboran menggunakan mesin bore pile.", "Setelah mencapai kedalaman yang direncanakan, tulangan dimasukkan dan dilanjutkan dengan proses pengecoran."],
    },
  ],
  faq: [
    {
      question: "Apa itu bore pile?",
      answer: "Bore pile adalah pondasi dalam yang dibuat dengan cara mengebor tanah hingga kedalaman tertentu sebelum dilakukan pengecoran beton.",
    },
    {
      question: "Kapan bore pile digunakan?",
      answer: "Umumnya digunakan pada bangunan bertingkat, jembatan, dan proyek yang membutuhkan daya dukung pondasi tinggi.",
    },
    {
      question: "Apa kelebihan bore pile?",
      answer: "Minim getaran, cocok di area padat penduduk, dan memiliki daya dukung yang tinggi.",
    },
  ],
};
