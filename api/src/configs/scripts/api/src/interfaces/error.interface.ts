export interface AppError {
    entity: string,
    action: string,
    message: string,
    code: number,
    data: Object,
    date: Date
}

export interface AppErrorResponse {
    message: string,
    code: number,
    data: string[] | Object
}

