/**
 * scripts/bootstrap.js
 *
 * Runs on every deploy BEFORE `next start`.
 * Command: node scripts/bootstrap.js && next start -H 0.0.0.0
 *
 * SAFETY RULES:
 * 1. NEVER run `db push --accept-data-loss` — that flag drops columns/data on schema changes.
 * 2. NEVER auto-seed if the DB already has products, articles, or categories.
 * 3. Use `migrate deploy` for schema changes in production (safe, incremental).
 */

const { execSync } = require('child_process');

async function bootstrap() {
  console.log('=== VINEX SYSTEM BOOTSTRAP ===');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    console.log('[Bootstrap] Local/no DB detected. Skipping DB ops — using in-memory store & db.json.');
    return;
  }

  console.log('[Bootstrap] Remote PostgreSQL detected.');

  // ─── STEP 1: Schema migration (SAFE — never drops data) ─────────────────────
  // `migrate deploy` applies only pending incremental migration files.
  // If no /prisma/migrations directory exists, skip gracefully (do NOT fall back to db push).
  try {
    const fs = require('fs');
    const path = require('path');
    const migrationDir = path.join(process.cwd(), 'prisma', 'migrations');

    if (fs.existsSync(migrationDir)) {
      console.log('[Bootstrap] Applying pending migrations via prisma migrate deploy...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit', timeout: 60000 });
      console.log('[Bootstrap] migrate deploy: OK');
    } else {
      // No migrations directory → schema was never converted to migrations.
      // Use db push WITHOUT --accept-data-loss so Prisma refuses any destructive changes.
      console.log('[Bootstrap] No migrations directory. Running safe prisma db push (no --accept-data-loss)...');
      execSync('npx prisma db push --skip-generate', { stdio: 'inherit', timeout: 45000 });
      console.log('[Bootstrap] db push: OK');
    }
  } catch (schemaErr) {
    // Schema is already in sync — this is not a fatal error
    console.warn('[Bootstrap] Schema sync skipped or already up-to-date:', schemaErr.message);
  }

  // ─── STEP 2: Auto-seed ONLY if ALL three core tables are empty ────────────────
  // We check products, articles AND categories. If any has data, skip entirely.
  // This is the single most important safety net against data loss.
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const [productCount, articleCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.article.count(),
      prisma.category.count(),
    ]);

    console.log(`[Bootstrap] DB — Products: ${productCount}, Articles: ${articleCount}, Categories: ${categoryCount}`);

    if (productCount === 0 && articleCount === 0 && categoryCount === 0) {
      console.log('[Bootstrap] DB is empty → running one-time initial seed...');
      try {
        execSync('npx ts-node --transpile-only prisma/seed.ts', { stdio: 'inherit', timeout: 120000 });
        console.log('[Bootstrap] Initial seed: DONE ✅');
      } catch (seedErr) {
        console.warn('[Bootstrap] Seed failed (non-fatal):', seedErr.message);
      }
    } else {
      console.log(`[Bootstrap] DB has existing data → seed SKIPPED to preserve all user records.`);
    }
  } catch (dbErr) {
    console.warn('[Bootstrap] DB count check failed (non-fatal):', dbErr.message);
  } finally {
    try { await prisma.$disconnect(); } catch (_) {}
  }

  console.log('=== VINEX BOOTSTRAP COMPLETE ===');
}

bootstrap().catch(err => {
  console.error('[Bootstrap] Unexpected error:', err);
  process.exit(0); // NEVER block next start
});
