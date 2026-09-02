import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { AppError } from "../errors/error";

type RequestPart = "body" | "params" | "query" | "headers";

export type RequestValidationSchemas = Partial<
    Record<RequestPart, z.ZodType>
>;

export default class ValidationMiddleware {
    static validate(schemas: RequestValidationSchemas): RequestHandler {
        return (req: Request, _res: Response, next: NextFunction): void => {
            try {
                for (const [part, schema] of Object.entries(schemas)) {
                    if (!schema) continue;

                    const value = schema.parse(req[part as RequestPart]);

                    // Preserves transformed values, such as coerced query numbers.
                    Object.assign(req, { [part]: value });
                }

                next();
            } catch (error: unknown) {
                if (error instanceof z.ZodError) {
                    next(
                        new AppError(
                            "request",
                            "validation",
                            "Dados da requisição inválidos.",
                            400,
                            { issues: error.issues }
                        )
                    );
                    return;
                }

                next(error);
            }
        };
    }
}
