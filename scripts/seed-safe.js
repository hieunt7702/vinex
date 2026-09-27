/**
 * scripts/seed-safe.js
 *
 * SAFE SEED WRAPPER — This file is invoked by `prisma db seed` (via package.json prisma.seed).
 *
 * CRITICAL PROTECTION: Before running the actual seed, we check if the database already has data.
 * If it does, we ABORT immediately to prevent overwriting user-created records.
 *
 * This file is intentionally a CommonJS wrapper (not TypeScript) so it can be loaded quickly
 * without ts-node in all environments.
 */

const { execSync } = require('child_process');

async function runSeedSafe() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('[Seed-Safe] No DATABASE_URL. Skipping seed (no DB to seed).');
    process.exit(0);
  }

  if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    console.log('[Seed-Safe] Local development DB detected. Running seed normally...');
    // Allow local dev seeding
    try {
      execSync('npx ts-node --transpile-only prisma/seed.ts', { stdio: 'inherit', timeout: 90000 });
    } catch (e) {
      console.error('[Seed-Safe] Seed failed:', e.message);
    }
    process.exit(0);
  }

  // ─── PRODUCTION GUARD ─────────────────────────────────────────────────────
  // Check the database BEFORE running seed. If data exists, abort.
  let prisma;
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();

    const [productCount, articleCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.article.count(),
      prisma.category.count(),
    ]);

    console.log(`[Seed-Safe] DB check — Products: ${productCount}, Articles: ${articleCount}, Categories: ${categoryCount}`);

    if (productCount > 0 || articleCount > 0 || categoryCount > 0) {
      console.log('[Seed-Safe] ✅ Database already has data. ABORTING seed to preserve all existing records.');
      console.log('[Seed-Safe] To force a manual re-seed, run: pnpm run seed');
      await prisma.$disconnect();
      process.exit(0); // Exit 0 = success (intentional skip)
    }

    console.log('[Seed-Safe] Database is empty. Proceeding with initial seed...');
    await prisma.$disconnect();

    // Run the actual seed
    execSync('npx ts-node --transpile-only prisma/seed.ts', { stdio: 'inherit', timeout: 90000 });
    console.log('[Seed-Safe] ✅ Initial seed completed successfully!');
  } catch (err) {
    console.warn('[Seed-Safe] Could not check DB or run seed:', err.message);
    if (prisma) {
      try { await prisma.$disconnect(); } catch (_) {}
    }
    // Exit 0 — never block app startup
    process.exit(0);
  }
}

runSeedSafe().catch(e => {
  console.error('[Seed-Safe Error]:', e);
  process.exit(0); // Never crash the deployment
});
