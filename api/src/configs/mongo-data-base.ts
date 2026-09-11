import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv"
dotenv.config()

class MongoConnection {
    private client: MongoClient;
    private db!: Db;

    constructor() {
        this.client = new MongoClient(process.env.MONGO_URI!);
    }

    async connect() {
        await this.client.connect();

        this.db = this.client.db(process.env.MONGO_DATABASE);

        console.log("MongoDB conectado");
    }

    getDatabase(): Db {
        return this.db;
    }

    async close(): Promise<void> {
        await this.client.close();
    }
}

export default new MongoConnection();
