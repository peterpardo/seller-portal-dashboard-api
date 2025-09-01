import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * Truncate all tables (but keep schema).
 * Uses deleteMany for safety in dev/test.
 */
export async function truncateAll() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Reset DB fully (drop & recreate) — slower but ensures clean state.
 */
export async function resetDatabase() {
  // WARNING: This wipes everything. Use only in test DB.
  await prisma.$executeRawUnsafe(`
    DO
    $do$
    DECLARE
        r RECORD;
    BEGIN
        -- disable FK constraints
        EXECUTE 'SET session_replication_role = replica';

        -- truncate all user tables
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
        END LOOP;

        -- enable FK constraints
        EXECUTE 'SET session_replication_role = DEFAULT';
    END
    $do$;
  `);
}
