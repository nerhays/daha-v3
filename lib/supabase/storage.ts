export function getStoragePathFromPublicUrl(url: string, bucket: string) {
  if (!url) return null;

  try {
    const marker = `/storage/v1/object/public/${bucket}/`;

    const index = url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.substring(index + marker.length));
  } catch (error) {
    console.error("Gagal mengambil storage path:", error);
    return null;
  }
}
