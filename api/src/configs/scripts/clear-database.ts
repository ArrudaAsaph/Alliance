import { AppDataSource,initializeDatabase } from "../data-base";

function validateEnvironment(): void {
    if (process.env.DEV !== "true") {
        throw new Error(
            'Operação bloqueada. Para limpar o banco, defina DEV="true" no ambiente.'
        );
    }
}

async function clearPostgres(): Promise<void> {
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

async function clearDatabase(): Promise<void> {
    validateEnvironment();

    await initializeDatabase();

    try {
        await clearPostgres();


        console.log("🧹 MongoDB limpo.");
        console.log("🎉 Todas as bases foram limpas.");
    } finally {
        await AppDataSource.destroy();
    }
}

clearDatabase().catch((error: unknown) => {
    console.error("❌ Erro ao limpar banco:", error);
    process.exitCode = 1;
});