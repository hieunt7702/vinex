import { PrismaClient } from '@prisma/client';
import net from 'net';

const globalForPrisma = globalThis as unknown as {
  rawPrisma: PrismaClient | undefined;
  dbAvailable: boolean | null;
  lastDbCheck: number;
};

const rawPrisma =
  globalForPrisma.rawPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.rawPrisma = rawPrisma;
}

function getDbHostAndPort(): { host: string; port: number } | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname || 'localhost',
      port: parseInt(url.port, 10) || 5432,
    };
  } catch {
    return null;
  }
}

const DB_CHECK_COOLDOWN_MS = 20000; // 20s cooldown between connection health checks

function checkTcp(host: string, port: number, timeout = 250): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;
    const finish = (result: boolean) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };
    socket.setTimeout(timeout);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    try {
      socket.connect(port, host);
    } catch {
      finish(false);
    }
  });
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
    msg.includes('connection refused')
  );
}

export async function isDbReachable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;

  const now = Date.now();
  if (
    globalForPrisma.dbAvailable !== null &&
    globalForPrisma.dbAvailable !== undefined &&
    now - (globalForPrisma.lastDbCheck || 0) < DB_CHECK_COOLDOWN_MS
  ) {
    return globalForPrisma.dbAvailable;
  }

  const target = getDbHostAndPort();
  if (!target) {
    globalForPrisma.dbAvailable = false;
    globalForPrisma.lastDbCheck = now;
    return false;
  }

  const ok = await checkTcp(target.host, target.port, 250);
  globalForPrisma.dbAvailable = ok;
  globalForPrisma.lastDbCheck = now;
  return ok;
}

export function markDbOffline() {
  globalForPrisma.dbAvailable = false;
  globalForPrisma.lastDbCheck = Date.now();
}

export function markDbOnline() {
  globalForPrisma.dbAvailable = true;
  globalForPrisma.lastDbCheck = Date.now();
}

/**
 * Smart Prisma Proxy:
 * Bypasses long engine connection timeouts (3-4 seconds) when Postgres is offline.
 * Reconnects automatically within milliseconds when Postgres becomes available.
 */
export const prisma = new Proxy(rawPrisma, {
  get(target: any, prop: string | symbol, receiver: any) {
    const originalValue = Reflect.get(target, prop, receiver);

    // If accessing model delegates (e.g. prisma.article, prisma.lead, prisma.product)
    if (typeof prop === 'string' && !prop.startsWith('_') && originalValue && typeof originalValue === 'object') {
      return new Proxy(originalValue, {
        get(modelTarget: any, modelProp: string | symbol, modelReceiver: any) {
          const modelMethod = Reflect.get(modelTarget, modelProp, modelReceiver);
          if (typeof modelMethod === 'function') {
            return async (...args: any[]) => {
              const reachable = await isDbReachable();
              if (!reachable) {
                throw new Error(`Database server is offline or unreachable`);
              }
              try {
                return await modelMethod.apply(modelTarget, args);
              } catch (err: any) {
                if (isConnectionError(err)) {
                  markDbOffline();
                }
                throw err;
              }
            };
          }
          return modelMethod;
        }
      });
    }

    // If accessing Prisma root methods (e.g. $connect, $queryRaw, $executeRaw)
    if (typeof prop === 'string' && prop.startsWith('$')) {
      if (typeof originalValue === 'function') {
        return async (...args: any[]) => {
          if (prop === '$disconnect') {
            return await originalValue.apply(target, args);
          }
          const reachable = await isDbReachable();
          if (!reachable) {
            throw new Error(`Database server is offline or unreachable for ${prop}`);
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
  }
}) as PrismaClient;

export default prisma;
