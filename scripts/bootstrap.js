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

  try {
    console.log('[Bootstrap] Syncing schema directly via prisma db push (clean schema, zero seed)...');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit', timeout: 60000 });
    console.log('[Bootstrap] PostgreSQL schema push: DONE ✅');
  } catch (schemaErr) {
    console.warn('[Bootstrap] Schema sync warning (non-fatal):', schemaErr.message);
  }

  console.log('=== VINEX BOOTSTRAP COMPLETE ===');
}

bootstrap().catch(err => {
  console.error('[Bootstrap] Unexpected error:', err);
  process.exit(0); // NEVER block next start
});
