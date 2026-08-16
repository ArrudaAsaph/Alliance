import { AppDataSource } from "../configs/data-base";
import type { Repository, FindOptionsWhere } from "typeorm";
import { User } from "../models/user.model";

export default class UserRepository {
    private userRepository: Repository<User>

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                email
            },
            relations: {
                person: true
            }
        })
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                username
            },
            relations: {
                person: true
            }
        })
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                id
            },
            relations: {
                person: true
            }
        })
    }

    async update(user: User, isLogin = false): Promise<User> {
        if (isLogin) {
            user.lastLogin = new Date
        } else {
            user.updatedAt = new Date();
        }

        await this.userRepository.save(user);

        return user;
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    // ==================
    // ADMIN
    // ==================
    
}