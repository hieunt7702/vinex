import prisma from '@/lib/prisma';
import { generateSlug } from '@/admin-utils/slug';

// ─────────────────────────────────────────────────────────────────────────────
// Slug uniqueness helpers — optimised for Railway / production
//
// KEY CHANGE: Replaced the `while(true)` loop that made N sequential DB queries
// with a single `findMany({ startsWith: baseSlug })` query. We fetch all
// conflicting slugs in one round-trip and resolve the suffix locally.
// ─────────────────────────────────────────────────────────────────────────────

async function resolveUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
): Promise<string> {
  const taken = new Set(existingSlugs);
  if (!taken.has(baseSlug)) return baseSlug;

  let counter = 1;
  while (taken.has(`${baseSlug}-${counter}`)) counter++;
  return `${baseSlug}-${counter}`;
}

/**
 * Unique product slug — single DB round-trip.
 */
export async function getUniqueProductSlug(
  nameOrSlug: string,
  currentId?: number,
): Promise<string> {
  let baseSlug = generateSlug(nameOrSlug);
  if (!baseSlug) baseSlug = `san-pham-${Date.now()}`;

  const conflicts = await prisma.product.findMany({
    where: {
      slug: { startsWith: baseSlug },
      ...(currentId ? { NOT: { id: currentId } } : {}),
    },
    select: { slug: true },
  });

  return resolveUniqueSlug(
    baseSlug,
    conflicts.map((c: { slug: string }) => c.slug),
  );
}

/**
 * Unique article slug — single DB round-trip.
 */
export async function getUniqueArticleSlug(
  titleOrSlug: string,
  currentId?: number,
): Promise<string> {
  let baseSlug = generateSlug(titleOrSlug);
  if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;

  const conflicts = await prisma.article.findMany({
    where: {
      slug: { startsWith: baseSlug },
      ...(currentId ? { NOT: { id: currentId } } : {}),
    },
    select: { slug: true },
  });

  return resolveUniqueSlug(
    baseSlug,
    conflicts.map((c: { slug: string }) => c.slug),
  );
}

/**
 * Unique category slug — single DB round-trip.
 */
export async function getUniqueCategorySlug(
  nameOrSlug: string,
  currentId?: number,
): Promise<string> {
  let baseSlug = generateSlug(nameOrSlug);
  if (!baseSlug) baseSlug = `danh-muc-${Date.now()}`;

  const conflicts = await prisma.category.findMany({
    where: {
      slug: { startsWith: baseSlug },
      ...(currentId ? { NOT: { id: currentId } } : {}),
    },
    select: { slug: true },
  });

  return resolveUniqueSlug(
    baseSlug,
    conflicts.map((c: { slug: string }) => c.slug),
  );
}

/**
 * Unique SEO page slug — single DB round-trip.
 */
export async function getUniqueSeoPageSlug(
  nameOrSlug: string,
  currentId?: number,
): Promise<string> {
  let baseSlug = generateSlug(nameOrSlug);
  if (!baseSlug) baseSlug = `trang-seo-${Date.now()}`;

  const conflicts = await prisma.seoPage.findMany({
    where: {
      slug: { startsWith: baseSlug },
      ...(currentId ? { NOT: { id: currentId } } : {}),
    },
    select: { slug: true },
  });

  return resolveUniqueSlug(
    baseSlug,
    conflicts.map((c: { slug: string }) => c.slug),
  );
}
