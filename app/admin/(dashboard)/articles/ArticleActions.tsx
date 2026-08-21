"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ArticleActionsProps {
  articleId: number;
  slug: string;
}

export default function ArticleActions({ articleId, slug }: ArticleActionsProps) {
  const router = useRouter();

  async function deleteArticle() {
    const confirmed = window.confirm("Yakin ingin menghapus artikel ini? Semua isi artikel, gallery, FAQ, dan artikel terkait juga akan dihapus.");

    if (!confirmed) return;

    const supabase = createClient();

    try {
      // 1. Ambil section terlebih dahulu
      const { data: sections, error: sectionFetchError } = await supabase.from("article_sections").select("id").eq("article_id", articleId);

      if (sectionFetchError) {
        throw new Error(sectionFetchError.message);
      }

      // 2. Hapus table berdasarkan section
      if (sections && sections.length > 0) {
        const sectionIds = sections.map((section: { id: number }) => section.id);

        const { error: tableError } = await supabase.from("article_section_tables").delete().in("section_id", sectionIds);

        if (tableError) {
          throw new Error(tableError.message);
        }
      }

      // 3. Hapus sections
      const { error: sectionsError } = await supabase.from("article_sections").delete().eq("article_id", articleId);

      if (sectionsError) {
        throw new Error(sectionsError.message);
      }

      // 4. Hapus gallery
      const { error: galleryError } = await supabase.from("article_gallery").delete().eq("article_id", articleId);

      if (galleryError) {
        throw new Error(galleryError.message);
      }

      // 5. Hapus FAQ
      const { error: faqError } = await supabase.from("article_faq").delete().eq("article_id", articleId);

      if (faqError) {
        throw new Error(faqError.message);
      }

      // 6. Hapus related
      const { error: relatedError } = await supabase.from("article_related").delete().eq("article_id", articleId);

      if (relatedError) {
        throw new Error(relatedError.message);
      }

      // 7. Terakhir hapus artikel utama
      const { error: articleError } = await supabase.from("articles").delete().eq("id", articleId);

      if (articleError) {
        throw new Error(articleError.message);
      }

      // 8. Refresh halaman
      router.refresh();
    } catch (error) {
      console.error("Gagal menghapus artikel:", error);

      alert(error instanceof Error ? error.message : "Gagal menghapus artikel.");
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/artikel/${slug}`} target="_blank" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
        Lihat
      </Link>

      <Link href={`/admin/articles/${articleId}/edit`} className="rounded-lg bg-[#0F4C81] px-3 py-2 text-sm font-medium text-white hover:bg-[#0c3d68]">
        Edit
      </Link>

      <button type="button" onClick={deleteArticle} className="text-sm font-semibold text-red-600 hover:text-red-800">
        Hapus
      </button>
    </div>
  );
}
