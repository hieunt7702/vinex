const { execSync } = require('child_process');
const path = require('path');

async function bootstrap() {
  console.log('=== VINEX SYSTEM BOOTSTRAP ===');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('localhost')) {
    console.log('[Bootstrap] No remote PostgreSQL DATABASE_URL detected or running locally. Using local store & db.json fallback.');
    return;
  }

  console.log('[Bootstrap] PostgreSQL DATABASE_URL detected. Synchronizing database schema...');
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      timeout: 30000,
    });
    console.log('[Bootstrap] Prisma db push succeeded.');

    // Check if database needs seeding
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
      const productCount = await prisma.product.count();
      console.log(`[Bootstrap] Current product count in PostgreSQL: ${productCount}`);
      if (productCount === 0) {
        console.log('[Bootstrap] Database is empty. Running automatic seed...');
        execSync('npx ts-node --transpile-only prisma/seed.ts', {
          stdio: 'inherit',
          timeout: 45000,
        });
        console.log('[Bootstrap] Database auto-seed completed successfully!');
      }
    } catch (seedErr) {
      console.warn('[Bootstrap] Auto-seed check notice:', seedErr.message);
    } finally {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.warn('[Bootstrap] Notice: Database synchronization skipped or failed:', err.message);
    console.log('[Bootstrap] App will run smoothly using persisted store & db.json fallback.');
  }

  console.log('=== VINEX BOOTSTRAP COMPLETED ===');
}

bootstrap().catch((e) => {
  console.error('[Bootstrap Error]:', e);
  process.exit(0); // Never block Next.js start
});
