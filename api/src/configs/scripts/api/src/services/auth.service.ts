import type { UserLoginRequest } from "../interfaces/user.interface";
import { Validator } from "../utils/validator.utils";
import { AppError } from "../models/error.model";
import UserRepository from "../repositories/user.repositories";
import SecurityService from './security.service';
import type { User } from "../models/user.models";
import type { AuthReponse, AuthTokenPayload } from "../interfaces/auth.interface";


export class AuthService {
    
    constructor (
            private readonly userRepository: UserRepository,
            private readonly securityService: SecurityService
        ) {}

    async login(data: UserLoginRequest | null | undefined): Promise<User> {
        const isEmail: boolean = this.loginValidation(data)
        const payload = data as UserLoginRequest;
        let user: User | null
        if (isEmail) {
            user = await this.userRepository.findByEmail(payload.username)
        } else {
             user = await this.userRepository.findByUsername(payload.username)
        }
        if (!user) {
            throw new AppError (
                'auth',
                'login',
                'usuário não encontrado ou senha inválida',
                400,
                payload,
                `usuário com ${isEmail ? 'email' : 'username'} ${payload.username} não encontrado`
            )
        }

        

        const isUser = await this.securityService.verify(payload.password, user.password)

        if (!isUser) {
            throw new AppError (
                'auth',
                'login',
                'usuário não encontrado ou senha inválida',
                400,
                payload,
                `usuário com senha incorreta`
            )
        }

        user.lastLogin = new Date();
        await this.userRepository.updateLogin(user.id);

        return user

    }

    token(user: User): AuthReponse {
        const payload: AuthTokenPayload = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        const token: AuthReponse = {
            access: this.securityService.generateToken(payload),
            refresh: this.securityService.generateRefreshToken(payload),
        };

        return token
    }

    private loginValidation(data: UserLoginRequest | null | undefined): boolean {
        if (!data || typeof data !== "object") {
            throw new AppError("auth", "login", "campos inválidos", 400, ["body é obrigatório."]);
        }
        const erros: string[] = [];
        let erroTam: string[] | null = []
        let isEmail: boolean = Validator.isEmail(data.username)
        let erro;
        if (!isEmail) {
            erro = Validator.required(data.username, "username");
            if (erro) {
                erros.push(erro);
            } else {
                erroTam = Validator.length(data.username, 3, 100, "username");
                if (erroTam) erros.push(...erroTam);
            }
        }

        erro = Validator.required(data.password, "password");
        if (erro) {
            erros.push(erro);
        } else {
            erroTam = Validator.length(data.password, 8,'',"password");
            if (erroTam) erros.push(...erroTam);
        }

        if (erro) {
            erros.push(erro);
        }

        if (erros.length > 0) {
            throw new AppError(
                'auth',
                'login',
                'campos inválidos',
                400,
                erros
            )
        }

        return isEmail

        
    }
}
export default new AuthService(new UserRepository(), new SecurityService());
