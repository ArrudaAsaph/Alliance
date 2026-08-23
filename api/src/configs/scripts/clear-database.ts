import { pathToFileURL } from "node:url";
import { AppDataSource, initializeDatabase } from "../data-base";

export function validateEnvironment(): void {
    if (process.env.DEV !== "true") {
        throw new Error(
            'Operação bloqueada. Para limpar o banco, defina DEV="true" no ambiente.'
        );
    }
}

export async function clearPostgres(): Promise<void> {
    const tables = await AppDataSource.query(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    `);

    if (tables.length === 0) {
        return;
    }

    const tableNames = tables
        .map((table: { tablename: string }) => `"${table.tablename}"`)
        .join(", ");

    await AppDataSource.query(`
        TRUNCATE TABLE ${tableNames}
        RESTART IDENTITY
        CASCADE
    `);

    console.log("🧹 PostgreSQL limpo.");
}

export async function clearDatabase(options: { destroyConnection?: boolean } = {}): Promise<void> {
    validateEnvironment();

    await initializeDatabase();

    try {
        await clearPostgres();
        console.log("🎉 Todas as bases foram limpas.");
    } finally {
        if (options.destroyConnection !== false && AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

async function main(): Promise<void> {
    await clearDatabase();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((error: unknown) => {
        console.error("❌ Erro ao limpar banco:", error);
        process.exitCode = 1;
    });
}
