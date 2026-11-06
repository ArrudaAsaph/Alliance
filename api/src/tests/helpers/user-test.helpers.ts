import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import UserRepository from "../../repositories/user.repository";
import SecurityService from "../../services/security.service";

export function createValidUser(id?: string): User {
    const user = new User();

    if (id) {
        user.id = id;
    }

    user.username = "asaph";
    user.email = "asaph@email.com";
    user.password = "12345678";

    return user;
}

export function createUserService(overrides?: {
    userRepository?: Partial<UserRepository>;
    securityService?: Partial<SecurityService>;
}) {
    const userRepository = {
        findByEmail: async () => null,
        findByUsername: async () => null,
        create: async (user: User) => user,
        update: async (user: User) => user,
        ...overrides?.userRepository,
    } as unknown as UserRepository;

    const securityService = {
        hash: async (password: string) => `hashed:${password}`,
        ...overrides?.securityService,
    } as unknown as SecurityService;

    const service = new UserService(userRepository, securityService);

    return { service, userRepository, securityService };
}
