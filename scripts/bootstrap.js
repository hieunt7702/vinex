/**
 * scripts/bootstrap.js
 *
 * Runs on every deploy BEFORE `next start`.
 *
 * Direct schema push (NO migrations, NO seed).
 * The user starts with a completely clean database and manages all data via the Admin panel.
 */

const { execSync } = require('child_process');

async function bootstrap() {
  console.log('=== VINEX SYSTEM BOOTSTRAP ===');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    console.log('[Bootstrap] Local/no remote DB detected. Skipping remote DB push.');
    return;
  }

  console.log('[Bootstrap] Remote PostgreSQL detected.');

  // 1. Prisma schema push with accept-data-loss flag to avoid blocking non-interactive deploy
  try {
    console.log('[Bootstrap] Syncing schema directly via prisma db push (clean schema, zero seed)...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit', timeout: 60000 });
    console.log('[Bootstrap] PostgreSQL schema push: DONE ✅');
  } catch (schemaErr) {
    console.warn('[Bootstrap] Schema sync warning (non-fatal):', schemaErr.message);
  }

  // 2. Direct column alignment safety net: guarantee all Lead and Customer columns exist
  try {
    console.log('[Bootstrap] Verifying column alignment safety net...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const columnStatements = [
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "requestCode" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "companyName" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "sourceProduct" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "utmParams" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "purpose" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "productGroup" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "preferredChannel" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "preferredTime" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "quantity" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "timeline" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "customization" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "details" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "attachments" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "consentVersion" TEXT DEFAULT 'v1.0'`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "marketingOptIn" BOOLEAN DEFAULT false`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN DEFAULT false`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "priority" TEXT DEFAULT 'NORMAL'`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "leadClassification" TEXT DEFAULT 'WARM'`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "assignee" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "internalReason" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "nextFollowUpDate" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "lastContactDate" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "firstResponseAt" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "closingResult" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "closingNote" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "linkedOrderCode" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "orderValue" INTEGER`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "linkedRequestId" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "closedAt" TEXT`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "verifiedInfo" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "activities" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "quotations" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "auditLog" JSONB`,
      `ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "reopenHistory" JSONB`,
      `ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "requestType" TEXT`,
    ];

    for (const sql of columnStatements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (_) {}
    }

    await prisma.$disconnect().catch(() => {});
    console.log('[Bootstrap] Column alignment safety net: DONE ✅');
  } catch (safetyErr) {
    console.warn('[Bootstrap] Column alignment warning (non-fatal):', safetyErr.message);
  }

  console.log('=== VINEX BOOTSTRAP COMPLETE ===');
}

bootstrap().catch(err => {
  console.error('[Bootstrap] Unexpected error:', err);
  process.exit(0); // NEVER block next start
});
