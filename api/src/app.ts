import express from "express";
import morgan from 'morgan';
import helmet from 'helmet';
import { initializeDatabase } from "./configs/data-base";

const app = express();

await initializeDatabase();

app.use(morgan('tiny'));

app.use(helmet());

app.use(express.json());

app.use("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});


export default app