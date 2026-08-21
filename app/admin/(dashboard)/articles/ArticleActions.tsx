"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ArticleActionsProps {
  articleId: number;
  slug: string;
}

function getStoragePath(url: string | null) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/article-images/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.substring(index + marker.length);
}

export default function ArticleActions({ articleId, slug }: ArticleActionsProps) {
  const router = useRouter();

  async function deleteArticle() {
    const confirmed = window.confirm("Yakin ingin menghapus artikel ini? Semua isi artikel, gallery, FAQ, artikel terkait, dan gambar di Storage juga akan dihapus.");

    if (!confirmed) return;

    const supabase = createClient();

    try {
      /* =====================================================
         1. AMBIL DATA ARTIKEL
      ===================================================== */

      const { data: article, error: articleFetchError } = await supabase.from("articles").select("id, cover_src").eq("id", articleId).single();

      if (articleFetchError) {
        throw new Error(articleFetchError.message);
      }

      /* =====================================================
         2. AMBIL GALLERY
      ===================================================== */

      const { data: gallery, error: galleryFetchError } = await supabase.from("article_gallery").select("id, src").eq("article_id", articleId);

      if (galleryFetchError) {
        throw new Error(galleryFetchError.message);
      }

      /* =====================================================
         3. KUMPULKAN FILE STORAGE
      ===================================================== */

      const storagePaths: string[] = [];

      // COVER
      const coverPath = getStoragePath(article?.cover_src ?? null);

      if (coverPath) {
        storagePaths.push(coverPath);
      }

      // GALLERY
      if (gallery) {
        for (const item of gallery) {
          const galleryPath = getStoragePath(item.src);

          if (galleryPath) {
            storagePaths.push(galleryPath);
          }
        }
      }

      // Hilangkan duplicate
      const uniqueStoragePaths = [...new Set(storagePaths)];

      console.log("Storage paths yang akan dihapus:", uniqueStoragePaths);

      /* =====================================================
         4. HAPUS FILE STORAGE
      ===================================================== */

      if (uniqueStoragePaths.length > 0) {
        const { data: deletedFiles, error: storageDeleteError } = await supabase.storage.from("article-images").remove(uniqueStoragePaths);

        console.log("Storage delete result:", deletedFiles);

        console.log("Storage delete error:", storageDeleteError);

        if (storageDeleteError) {
          throw new Error(`Gagal menghapus gambar Storage: ${storageDeleteError.message}`);
        }
      }

      /* =====================================================
         5. AMBIL SECTION
      ===================================================== */

      const { data: sections, error: sectionFetchError } = await supabase.from("article_sections").select("id").eq("article_id", articleId);

      if (sectionFetchError) {
        throw new Error(sectionFetchError.message);
      }

      /* =====================================================
         6. HAPUS SECTION TABLES
      ===================================================== */

      if (sections && sections.length > 0) {
        const sectionIds = sections.map((section) => section.id);

        const { error: tableError } = await supabase.from("article_section_tables").delete().in("section_id", sectionIds);

        if (tableError) {
          throw new Error(tableError.message);
        }
      }

      /* =====================================================
         7. HAPUS SECTIONS
      ===================================================== */

      const { error: sectionsError } = await supabase.from("article_sections").delete().eq("article_id", articleId);

      if (sectionsError) {
        throw new Error(sectionsError.message);
      }

      /* =====================================================
         8. HAPUS GALLERY
      ===================================================== */

      const { error: galleryError } = await supabase.from("article_gallery").delete().eq("article_id", articleId);

      if (galleryError) {
        throw new Error(galleryError.message);
      }

      /* =====================================================
         9. HAPUS FAQ
      ===================================================== */

      const { error: faqError } = await supabase.from("article_faq").delete().eq("article_id", articleId);

      if (faqError) {
        throw new Error(faqError.message);
      }

      /* =====================================================
         10. HAPUS RELATED
      ===================================================== */

      const { error: relatedError } = await supabase.from("article_related").delete().eq("article_id", articleId);

      if (relatedError) {
        throw new Error(relatedError.message);
      }

      /* =====================================================
         11. HAPUS ARTIKEL UTAMA
      ===================================================== */

      const { error: articleError } = await supabase.from("articles").delete().eq("id", articleId);

      if (articleError) {
        throw new Error(articleError.message);
      }

      /* =====================================================
         12. SELESAI
      ===================================================== */

      alert("Artikel dan gambar berhasil dihapus.");

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
