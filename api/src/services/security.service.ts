import argon2 from "argon2";
import dotenv from "dotenv";
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import crypto from "crypto"
import { AppError } from "../errors/error";

import { User } from "../models/user.model";
dotenv.config();


export default class SecurityService {
    private readonly pepper: string;
    private readonly secretKeyJwt: Secret;
    private readonly refreshSecret: Secret;
    private readonly expiresInJwt: SignOptions["expiresIn"];
    private readonly refreshExpires: SignOptions["expiresIn"];

    constructor() {
        const pepper = process.env.PASSWORD_PEPPER?.trim();
        const secretKeyJwt = process.env.SECRET_KEY_JWT?.trim();
        const refreshSecret = process.env.SECRET_REFRESH_KEY_JWT?.trim();
        const expiresInJwt = process.env.JWT_EXPIRES_IN?.trim();
        const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN?.trim();


        if (!pepper) {
            throw new AppError(
                "SecurityService",
                "constructor",
                "PASSWORD_PEPPER não configurado.",
                500
            );
        }
        if (!secretKeyJwt) {
            throw new AppError(
                "SecurityService",
                "constructor",
                "SECRETKEYJWT não configurado.",
                500
            );
        }
        if (!refreshSecret) {
            throw new AppError(
                "SecurityService",
                "constructor",
                "SECRETREFRESHKEYJWT não configurado.",
                500
            );
        }
        if (!expiresInJwt) {
            throw new AppError(
                "SecurityService",
                "constructor",
                "EXPIRESINJWT não configurado.",
                500
            );
        }
        if (!refreshExpires) {
            throw new AppError(
                "SecurityService",
                "constructor",
                "RESFRESHEXPIRESINJWT não configurado.",
                500
            );
        }

        this.pepper = pepper;
        this.secretKeyJwt = secretKeyJwt;
        this.refreshSecret = refreshSecret;
        this.expiresInJwt = expiresInJwt as SignOptions["expiresIn"];
        this.refreshExpires = refreshExpires as SignOptions["expiresIn"];

    }

    async hash(password: string): Promise<string> {
        try {
            return await argon2.hash(password + this.pepper, {
                type: argon2.argon2id,
                memoryCost: 65536, // 64 MB
                timeCost: 3,
                parallelism: 1,
                hashLength: 32,
            });
        } catch {
            throw new AppError(
                "SecurityService",
                "hash",
                "Erro ao gerar hash da senha.",
                500
            );
        }
    }

    async verify(password: string, hash: string): Promise<boolean> {
        try {
            return await argon2.verify(
                hash,
                password + this.pepper
            );
        } catch {
            throw new AppError(
                "SecurityService",
                "verify",
                "Erro ao verificar senha.",
                500
            );
        }
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secretKeyJwt, {
            algorithm: "HS256",
            expiresIn: this.expiresInJwt,
        });
    }

    generateRefreshToken(payload: object): string {
        return jwt.sign(
            payload,
            this.refreshSecret,
            {
                algorithm: "HS256",
                expiresIn: this.refreshExpires,
            }
        );
    }

    verifyToken(token: string) {
        return jwt.verify(token, this.secretKeyJwt, { algorithms: ["HS256"] });
    }

    generateTokenInvite() {
        const token = crypto.randomBytes(32).toString("hex");
        return token
    }

    needBeAdmin(user: User, entity: string, action: string, message?: string): void  {
        if (!message) {
            message = "usuário sem permissao"
        }
        if (!user.isAdmin) {
            AppError.unauthorized(
                entity,
                action,
                message
            )
        }
    }
}
