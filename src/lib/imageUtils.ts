/**
 * Universal Image URL normalizer
 * Supports:
 * - Cloudinary URLs (https://res.cloudinary.com/...)
 * - Local public assets (/images/..., /uploads/...)
 * - Array of images (takes the first valid image)
 * - JSON encoded strings of URLs
 */
export function normalizeImageUrl(
  img: any, 
  fallback: string = '/images/placeholder.jpg'
): string {
  if (!img) return fallback;

  // If array, extract first element
  if (Array.isArray(img)) {
    for (const item of img) {
      const normalized = normalizeImageUrl(item, '');
      if (normalized) return normalized;
    }
    return fallback;
  }

  if (typeof img === 'string') {
    let clean = img.trim();

    // Check if it's a JSON encoded array or string
    if (clean.startsWith('[') && clean.endsWith(']')) {
      try {
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeImageUrl(parsed[0], fallback);
        }
      } catch (e) {
        // continue
      }
    }

    // Strip wrapping quotes
    clean = clean.replace(/^["']|["']$/g, '').trim();

    if (!clean) return fallback;

    // Direct HTTP/HTTPS URL (Cloudinary, S3, external)
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }

    // Local public path with leading slash
    if (clean.startsWith('/')) {
      return clean;
    }

    // Missing leading slash
    return `/${clean}`;
  }

  return fallback;
}
