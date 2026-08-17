import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "alliance_db",
    synchronize: process.env.NODE_ENV !== "production",
    logging: ["query", "error"],
    entities: ["src/models/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("[-----Database connection initialized successfully-----]");
        }
    } catch (error) {
        console.error("[*****Error initializing database:*****]", error);
        process.exit(1);
    }
};
