/**
 * VINEX Prisma Startup Warmup
 *
 * Railway containers start cold — the first Prisma query takes 1-2 s to
 * establish the TCP connection pool. This module pre-warms the connection
 * during Next.js server startup so the FIRST real user request is fast.
 *
 * Import this file in `next.config.ts` instrumentation or any server-side
 * module that runs at startup (e.g. the root layout server component).
 */

import prisma, { markDbOnline } from '@/lib/prisma';

let warmed = false;

export async function warmPrismaConnection(): Promise<void> {
  if (warmed || !process.env.DATABASE_URL) return;
  warmed = true;

  try {
    // Lightweight ping — uses negligible resources
    await prisma.$queryRaw`SELECT 1`;
    markDbOnline();
    console.log('[prisma-warmup] Connection pool ready ✓');
  } catch (err) {
    console.warn('[prisma-warmup] DB not reachable at startup (will retry on first request):', err);
  }
}
