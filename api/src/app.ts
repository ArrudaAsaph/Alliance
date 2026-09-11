import express from "express";
import morgan from 'morgan';
import helmet from 'helmet';
import { initializeDatabase } from "./configs/data-base";
import router from "./routes/index.routes";
import { AppError } from "./errors/error";
import { AppErrorMapper } from "./mappers/error.mapper";

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

app.use('/api/v1',router);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    void _next;
    if (err instanceof AppError) {
        console.error(`[AppError] ${err.entity}.${err.action}: ${err.message}`, err.internal ?? err.data);

        const payload = AppErrorMapper.toResponseDTO(err);
        res.status(payload.code).json({
            success: false,
            ...payload
        });
        return;
    }

    console.error("[UnhandledError]", err);

    res.status(500).json({
        success: false,
        message: "Erro interno do servidor.",
        code: 500,
        data: {}
    });
});


export default app;
