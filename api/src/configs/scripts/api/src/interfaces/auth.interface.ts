export interface AuthReponse {
    access: string,
    refresh: string,
}

export interface AuthTokenPayload {
    id: string;
    username: string;
    email: string;
}

export interface AuthUpdateLastLoginDTO {
    lastLogin: Date
}

export interface AuthUserInternal {
    id: string,
    username: string,
    email: string,
    iat: number,
    exp: number
}
