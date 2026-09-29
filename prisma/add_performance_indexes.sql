-- Performance Indexes Migration
-- Run this on Railway PostgreSQL to add missing indexes
-- Command: pnpm prisma db push  (applies schema changes including indexes)
--
-- Or apply manually via psql / Railway dashboard SQL editor:

-- Product indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_status_idx"    ON "Product"("status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_productId_idx" ON "Product"("productId");

-- Article indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Article_isFeatured_idx"         ON "Article"("isFeatured");

-- Lead indexes (most critical for performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_status_idx"               ON "Lead"("status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_priority_idx"             ON "Lead"("priority");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_assignee_idx"             ON "Lead"("assignee");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_isRead_idx"               ON "Lead"("isRead");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_createdAt_idx"            ON "Lead"("createdAt" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_status_createdAt_idx"     ON "Lead"("status", "createdAt" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Lead_assignee_status_idx"      ON "Lead"("assignee", "status");

-- Customer indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Customer_phoneNumber_idx" ON "Customer"("phoneNumber");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Customer_email_idx"       ON "Customer"("email");
