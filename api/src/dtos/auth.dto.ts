export interface AuthLoginRequest{
    username: string,
    password:string
}
export interface AuthReponse {
    access: string,
    refresh: string,
}