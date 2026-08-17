import type { FindOptionsWhere, Repository } from "typeorm";
import { Between, ILike } from "typeorm";
import { User } from "../models/user.models";
import { AppDataSource } from "../config/data-base";
import { AppError } from "../models/error.model";
import type { FindUserFilters } from "../interfaces/user.interface";


export default class UserRepository {
    private userRepository: Repository<User>

    constructor () {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user)
        return await this.userRepository.save(newUser)
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne(
            {
                where: {email},
                relations: {
                    person: true
                }
            }
        )
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne(
            {
                where: {username},
                relations: {
                    person: true
                }
            }
        )
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
            relations: {
                person: true
            }
        })
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        await this.userRepository.update(id, { ...user, updatedAt: new Date() });
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new AppError('user', 'update', 'Usuário não encontrado', 404);
        }
        return updatedUser;
    }

    async updateLogin(id: string): Promise<User> {
        await this.userRepository.update(id, {  lastLogin: new Date() });
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new AppError(
                'user', 
                'updateLogin', 
                'Usuário não encontrado', 
                404
            );
        }
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async findAll(filters: FindUserFilters): Promise<User[]> {
        const where: FindOptionsWhere<User> = {};

        if (filters.id) {
            where.id = ILike(`%${filters.id}%`);
        }

        if (filters.username) {
            where.username = ILike(`%${filters.username}%`);
        }

        if (filters.email) {
            where.email = ILike(`%${filters.email}%`);
        }

        if (filters.createdAtFrom || filters.createdAtTo) {
            where.createdAt = Between(
                filters.createdAtFrom ?? new Date("1900-01-01"),
                filters.createdAtTo ?? new Date("9999-12-31")
            );
        }

        if (filters.updatedAtFrom || filters.updatedAtTo) {
            where.updatedAt = Between(
                filters.updatedAtFrom ?? new Date("1900-01-01"),
                filters.updatedAtTo ?? new Date("9999-12-31")
            );
        }

        if (filters.lastLoginFrom || filters.lastLoginTo) {
            where.lastLogin = Between(
                filters.lastLoginFrom ?? new Date("1900-01-01"),
                filters.lastLoginTo ?? new Date("9999-12-31")
            );
        }

        if (filters.isAdmin !== undefined) {
            where.isAdmin = filters.isAdmin;
        }

        return this.userRepository.find({
            where,
            relations: {
                person: true,
            },
        });
    }


}
