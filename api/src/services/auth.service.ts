import UserRepository from '../repositories/user.repository';
import SecurityService from './security.service';
import { AppError } from '../errors/error';
import { Validator } from '../utils/validator.utils';
import type { AuthLoginRequest, AuthReponse } from '../dtos/auth.dto';
import { User } from '../models/user.model';
export class AuthService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly securityService: SecurityService
    ) {}

    async login(data: AuthLoginRequest | null | undefined): Promise<User> {
        const isEmail: boolean = this.loginValidation(data);
        const payload = data as AuthLoginRequest;
        let user: User | null;
        if (isEmail) {
            user = await this.userRepository.findByEmail(payload.username);
        } else {
             user = await this.userRepository.findByUsername(payload.username);
        }
        if (!user) {
            AppError.badRequest (
                'auth',
                'login',
                'usuário não encontrado ou senha inválida',
                payload
            );
        }

        const isUser = await this.securityService.verify(payload.password, user.password);

        if (!isUser) {
            AppError.badRequest (
                'auth',
                'login',
                'usuário não encontrado ou senha inválida',
                payload
            )
        }

        user.lastLogin = new Date();
        await this.userRepository.update(user, true);

        return user
    }

    token(user: User): AuthReponse {
        const payload = {
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

    private loginValidation(data: AuthLoginRequest | null | undefined): boolean {
        if (!data || typeof data !== "object") {
            AppError.validation(
                "auth", 
                "login", 
                "campos inválidos", 
                ["body é obrigatório."]
            );
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
            AppError.validation(
                'auth',
                'login',
                'campos inválidos',
                erros
            )
        }

        return isEmail
    }
}
export default new AuthService(new UserRepository(), new SecurityService());
