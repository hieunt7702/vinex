import prisma from '@/lib/prisma';
import { generateSlug } from '@/admin-utils/slug';

/**
 * Đảm bảo slug sản phẩm là duy nhất trong Database ngay cả khi nhiều admin
 * cùng tạo hoặc cập nhật sản phẩm có tên giống nhau tại cùng một thời điểm.
 */
export async function getUniqueProductSlug(nameOrSlug: string, currentId?: number): Promise<string> {
  let baseSlug = generateSlug(nameOrSlug);
  if (!baseSlug) baseSlug = `san-pham-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {})
      },
      select: { id: true }
    });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Đảm bảo slug bài viết / tin tức là duy nhất trong Database
 */
export async function getUniqueArticleSlug(titleOrSlug: string, currentId?: number): Promise<string> {
  let baseSlug = generateSlug(titleOrSlug);
  if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.article.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {})
      },
      select: { id: true }
    });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Đảm bảo slug danh mục là duy nhất trong Database
 */
export async function getUniqueCategorySlug(nameOrSlug: string, currentId?: number): Promise<string> {
  let baseSlug = generateSlug(nameOrSlug);
  if (!baseSlug) baseSlug = `danh-muc-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {})
      },
      select: { id: true }
    });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Đảm bảo slug trang SEO là duy nhất trong Database
 */
export async function getUniqueSeoPageSlug(nameOrSlug: string, currentId?: number): Promise<string> {
  let baseSlug = generateSlug(nameOrSlug);
  if (!baseSlug) baseSlug = `trang-seo-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.seoPage.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {})
      },
      select: { id: true }
    });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
