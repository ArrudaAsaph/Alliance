export class AppError extends Error {
    readonly entity: string;
    readonly action: string;
    readonly code: number;
    readonly data?: unknown;
    readonly date: Date;
    readonly internal?: unknown;

    constructor(
        entity: string,
        action: string,
        message: string,
        code: number,
        data?: unknown,
        internal?: unknown
    ) {
        super(message);

        this.name = "AppError";
        this.entity = entity;
        this.action = action;
        this.code = code;
        this.data = data;
        this.date = new Date();
        this.internal = internal;
    }

    static badRequest(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        throw new AppError(entity, action, message, 400, data);
    }

    static validation(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        return AppError.badRequest(entity, action, message, data);
    }

    static unauthorized(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        throw new AppError(entity, action, message, 401, data);
    }

    static forbidden(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        throw new AppError(entity, action, message, 403, data);
    }

    static notFound(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        throw new AppError(entity, action, message, 404, data);
    }

    static conflict(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        throw new AppError(entity, action, message, 409, data);
    }

    static unprocessable(
        entity: string,
        action: string,
        message: string,
        data?: unknown
    ): never {
        throw new AppError(entity, action, message, 422, data);
    }

    static internal(
        entity: string,
        action: string,
        message = "Erro interno do servidor.",
        internal?: unknown
    ): never {
        throw new AppError(entity, action, message, 500, undefined, internal);
    }
}