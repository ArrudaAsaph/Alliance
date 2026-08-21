import express from "express";
import helmet from 'helmet';
import { initializeDatabase } from "./configs/data-base";
import router from "./routes/index.routes";
import { auditErrorHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/request.middleware";

const app = express();

await initializeDatabase();

app.use(requestLogger);

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

app.use('/api/v1',router);

app.use(auditErrorHandler);


export default app;