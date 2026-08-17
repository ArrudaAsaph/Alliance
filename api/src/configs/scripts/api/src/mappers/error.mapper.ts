import { AppError } from "../models/error.model";
import type { AppErrorResponse } from "../interfaces/error.interface";

export class AppErrorMapper {
    
        static toResponseDTO(appError: AppError): AppErrorResponse {
            return {
                message: appError.message,
                code: appError.code,
                data: appError.data ?? {}
            };
        }

        
}
