import type { User } from "../../models/user.models";

declare global {
    namespace Express {
        interface Request {
            /** Usuário autenticado, carregado uma única vez pelo AuthMiddleware. */
            user?: User;
            requestId?: string;
        }
    }
}

export {};
