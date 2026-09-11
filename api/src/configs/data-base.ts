import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME,
    // Alterações automáticas no esquema só podem ocorrer em desenvolvimento.
    synchronize: process.env.NODE_ENV === "development",
    entities: ["src/models/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();

            const now = new Date().toISOString();

            console.log(
                `[${now}] ✓ Database connection initialized successfully`
            );
        }
    } catch (error) {
        const now = new Date().toISOString();

        console.error(
            `[${now}] ✗ Error initializing database`,
            error
        );

        throw error;
    }
};
