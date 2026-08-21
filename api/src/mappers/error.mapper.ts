import { AppError } from "../errors/error";

export class AppErrorMapper {
    
        static toResponseDTO(appError: AppError) {
            return {
                message: appError.message,
                code: appError.code,
                data: appError.data ?? {}
            };
        }

        
}
