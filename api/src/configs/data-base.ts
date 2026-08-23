import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()

const DB_HOST = process.env.DB_HOST ?? "db";
const DB_PORT = Number.parseInt(process.env.DB_PORT ?? "5432", 10);
const DB_USERNAME = process.env.DB_USERNAME ?? "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "postgres";
const DB_NAME = process.env.DB_NAME ?? "postgres";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: process.env.NODE_ENV !== "production",
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

        process.exit(1);
    }
};
