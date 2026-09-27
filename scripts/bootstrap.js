const { execSync } = require('child_process');

async function bootstrap() {
  console.log('=== VINEX SYSTEM BOOTSTRAP ===');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('localhost')) {
    console.log('[Bootstrap] No remote PostgreSQL DATABASE_URL detected. Using local store & db.json fallback.');
    return;
  }

  console.log('[Bootstrap] PostgreSQL DATABASE_URL detected. Applying database migrations safely...');

  // ─── STEP 1: Apply schema migrations (NEVER drop data) ─────────────────────
  // Use `migrate deploy` which applies only pending incremental migrations.
  // Fallback to `db push` (WITHOUT --accept-data-loss) if no migration files exist.
  // NEVER use `db push --accept-data-loss` — that flag can silently drop columns/tables.
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit', timeout: 60000 });
    console.log('[Bootstrap] Prisma migrate deploy succeeded.');
  } catch {
    console.warn('[Bootstrap] migrate deploy skipped — no pending migrations or no migration directory. Trying safe db push...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit', timeout: 30000 });
      console.log('[Bootstrap] Prisma db push (safe, no data-loss flag) succeeded.');
    } catch (pushErr) {
      console.warn('[Bootstrap] db push skipped:', pushErr.message);
    }
  }

  // ─── STEP 2: Auto-seed only if DB is completely empty ──────────────────────
  // CRITICAL RULE: Only seed when BOTH products AND articles are 0.
  // This guarantees we NEVER overwrite data the user has created after the first deploy.
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const productCount = await prisma.product.count();
    const articleCount = await prisma.article.count();
    console.log(`[Bootstrap] DB state — Products: ${productCount}, Articles: ${articleCount}`);

    if (productCount === 0 && articleCount === 0) {
      console.log('[Bootstrap] Database is completely empty. Running one-time automatic seed...');
      try {
        execSync('npx ts-node --transpile-only prisma/seed.ts', { stdio: 'inherit', timeout: 90000 });
        console.log('[Bootstrap] Database auto-seed completed successfully!');
      } catch (seedRunErr) {
        console.warn('[Bootstrap] Seed execution failed:', seedRunErr.message);
      }
    } else {
      console.log(`[Bootstrap] Database already has data. Skipping seed to preserve all user-created records.`);
    }
  } catch (countErr) {
    console.warn('[Bootstrap] Could not check DB counts:', countErr.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('=== VINEX BOOTSTRAP COMPLETED ===');
}

bootstrap().catch((e) => {
  console.error('[Bootstrap Error]:', e);
  process.exit(0); // Never block Next.js start
});
