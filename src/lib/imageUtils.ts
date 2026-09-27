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

/**
 * Robust date parser supporting ISO strings, timestamps, and Vietnamese DD/MM/YYYY formats
 */
export function parseFlexibleDate(val: any): number {
  if (!val) return 0;
  if (val instanceof Date) return isNaN(val.getTime()) ? 0 : val.getTime();
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return 0;

    // Check Vietnamese DD/MM/YYYY or DD-MM-YYYY (with optional HH:mm:ss)
    const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
    if (dmy) {
      const d = parseInt(dmy[1], 10);
      const m = parseInt(dmy[2], 10) - 1;
      const y = parseInt(dmy[3], 10);
      const h = parseInt(dmy[4] || '0', 10);
      const min = parseInt(dmy[5] || '0', 10);
      const sec = parseInt(dmy[6] || '0', 10);
      const dt = new Date(y, m, d, h, min, sec);
      return isNaN(dt.getTime()) ? 0 : dt.getTime();
    }

    // Try standard ISO or RFC date string
    const parsed = new Date(s).getTime();
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

/**
 * Get unified millisecond timestamp of an article for reliable sorting
 */
export function getArticleTimestamp(a: any): number {
  if (!a) return 0;
  
  if (a.publishedAt) {
    const ts = parseFlexibleDate(a.publishedAt);
    if (ts > 0) return ts;
  }

  if (a.date) {
    const ts = parseFlexibleDate(a.date);
    if (ts > 0) return ts;
  }

  if (a.createdAt) {
    const ts = parseFlexibleDate(a.createdAt);
    if (ts > 0) return ts;
  }

  return Number(a.id) || 0;
}

/**
 * Sort articles from newest to oldest based on published date, creation date, and ID
 */
export function sortArticlesNewestFirst<T extends { id?: any; publishedAt?: any; createdAt?: any; date?: any }>(articles: T[]): T[] {
  return [...articles].sort((a, b) => {
    const timeA = getArticleTimestamp(a);
    const timeB = getArticleTimestamp(b);
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });
}

/**
 * Format article date to human-readable DD/MM/YYYY
 */
export function formatArticleDate(val: any): string {
  if (!val) return 'Gần đây';
  if (typeof val === 'string') {
    const s = val.trim();
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) return s;
  }
  const ts = parseFlexibleDate(val);
  if (!ts) return typeof val === 'string' && val ? val : 'Gần đây';
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
