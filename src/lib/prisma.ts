import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────────────────────────────────────
// Prisma Client — optimised for Railway / production
//
// KEY CHANGE: Removed per-request TCP health check that was adding 50-250 ms
// latency to every API call. We now trust Prisma's built-in connection pooling
// and mark the DB offline only when real query errors occur.
// ─────────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prismaClient: PrismaClient | undefined;
  dbOnline: boolean;
  dbOfflineUntil: number;
};

// Singleton Prisma client — never recreated between hot-reloads
if (!globalForPrisma.prismaClient) {
  globalForPrisma.prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

const rawPrisma = globalForPrisma.prismaClient!;

// Circuit-breaker state — only blocks queries for 10 s after a real failure
if (globalForPrisma.dbOnline === undefined) {
  globalForPrisma.dbOnline = true;
  globalForPrisma.dbOfflineUntil = 0;
}

const OFFLINE_COOLDOWN_MS = 10_000; // 10 s before retrying after a connection failure

export function markDbOffline() {
  globalForPrisma.dbOnline = false;
  globalForPrisma.dbOfflineUntil = Date.now() + OFFLINE_COOLDOWN_MS;
}

export function markDbOnline() {
  globalForPrisma.dbOnline = true;
  globalForPrisma.dbOfflineUntil = 0;
}

export function isDbCircuitOpen(): boolean {
  if (globalForPrisma.dbOnline) return false;
  if (Date.now() > globalForPrisma.dbOfflineUntil) {
    // Cooldown expired — allow a probe query through
    globalForPrisma.dbOnline = true;
    return false;
  }
  return true; // Still within offline window — skip DB
}

/**
 * Lightweight reachability helper — used ONLY at startup or health endpoints,
 * NOT in the request hot path.
 */
export async function isDbReachable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  if (isDbCircuitOpen()) return false;
  try {
    await rawPrisma.$queryRaw`SELECT 1`;
    markDbOnline();
    return true;
  } catch {
    markDbOffline();
    return false;
  }
}

function isConnectionError(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || err);
  const code = err.code;
  return (
    code === 'P1001' ||
    code === 'P1002' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    msg.includes("Can't reach database server") ||
    msg.includes('connection refused') ||
    msg.includes('Connection terminated') ||
    msg.includes('ENOTFOUND')
  );
}

/**
 * Smart Prisma Proxy:
 * - NO TCP check on every request (old bottleneck removed)
 * - Circuit breaker: if DB just errored, fast-fail for 10 s then retry
 * - On connection errors: open circuit to prevent cascade failures
 */
export const prisma = new Proxy(rawPrisma, {
  get(target: any, prop: string | symbol, receiver: any) {
    const originalValue = Reflect.get(target, prop, receiver);

    // Model delegates (e.g. prisma.article, prisma.product)
    if (
      typeof prop === 'string' &&
      !prop.startsWith('_') &&
      originalValue &&
      typeof originalValue === 'object'
    ) {
      return new Proxy(originalValue, {
        get(modelTarget: any, modelProp: string | symbol, modelReceiver: any) {
          const modelMethod = Reflect.get(modelTarget, modelProp, modelReceiver);
          if (typeof modelMethod === 'function') {
            return async (...args: any[]) => {
              // Fast-fail if circuit is open (DB recently failed)
              if (isDbCircuitOpen()) {
                throw new Error('Database is temporarily unavailable (circuit open)');
              }
              try {
                const result = await modelMethod.apply(modelTarget, args);
                // Successful query — ensure circuit is closed
                if (!globalForPrisma.dbOnline) markDbOnline();
                return result;
              } catch (err: any) {
                if (isConnectionError(err)) {
                  markDbOffline();
                }
                throw err;
              }
            };
          }
          return modelMethod;
        },
      });
    }

    // Root methods ($connect, $queryRaw, $executeRaw, etc.)
    if (typeof prop === 'string' && prop.startsWith('$')) {
      if (typeof originalValue === 'function') {
        return async (...args: any[]) => {
          if (prop === '$disconnect') {
            return await originalValue.apply(target, args);
          }
          if (isDbCircuitOpen()) {
            throw new Error(`Database is temporarily unavailable for ${prop}`);
          }
          try {
            return await originalValue.apply(target, args);
          } catch (err: any) {
            if (isConnectionError(err)) {
              markDbOffline();
            }
            throw err;
          }
        };
      }
    }

    return originalValue;
  },
}) as PrismaClient;

export default prisma;
