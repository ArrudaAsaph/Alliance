import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { Person } from "./person.model";
import { AppError } from "../errors/error";
import validator from 'validator';


@Entity("users")
export class User {
    private entity: string = "user"
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
    type: "varchar",
    length: 100,
    unique: true
    })
    username: string;

    @Column({
    type: "varchar",
    unique: true,
    })
    email: string;

    @Column({
    type: "varchar",
    })
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({
    name: "last_login",
    type: "timestamp",
    nullable: true,
    })
    lastLogin: Date | null;

    @Column({
    name: "is_admin",
    type: "boolean",
    default: false
    })
    isAdmin: boolean;

    @OneToOne(() => Person, person => person.user)
    person: Person;

    @Column({ name: "updated_at", type: "timestamp", nullable: true })
    updatedAt: Date | null;

    // =========================
    // VALIDATIONS
    // =========================

    validateForCreate(): void {
        this.normalize();

        this.validateUsername("create");
        this.validateEmail("create");
        this.validatePassword("create");
    }

    validateForUpdate(): void {
        this.normalize();

        this.validateUsername("update");
        this.validateEmail("update");
    }

    validatePasswordChange(): void {
        this.validatePassword("changePassword");
    }

    userAdmin() {
        return this.isAdmin === true;
    }

    requirePerson(entity: string, action: string) {
        if (!this.person) {
            AppError.unprocessable(
                entity,
                action,
                'Usuário não possui pessoa.'
            )
        }
    }

    // =========================
    // HELPERS 
    // =========================

    private normalize(): void {
        if (this.username) {
            this.username = this.username.trim();
        }

        if (this.email) {
            this.email = this.email.trim().toLowerCase();
        }
    }

    private validateUsername(action: string): void {
        if (!this.username) {
            AppError.validation(
            this.entity,
            action,
            "O nome de usuário é obrigatório."
            );
        }

        if (this.username.length < 3) {
            AppError.validation(
            this.entity,
            action,
            "O nome de usuário deve possuir pelo menos 3 caracteres."
            );
        }

        if (this.username.length > 100) {
            AppError.validation(
            this.entity,
            action,
            "O nome de usuário deve possuir no máximo 100 caracteres."
            );
        }

        if (!validator.isAlphanumeric(this.username, "pt-BR", { ignore: "_-" })) {
            AppError.validation(
            this.entity,
            action,
            "O nome de usuário contém caracteres inválidos."
            );
        }
    }

    private validateEmail(action: string): void {
        if (!this.email) {
            AppError.validation(
            this.entity,
            action,
            "O e-mail é obrigatório."
            );
        }

        if (!validator.isEmail(this.email)) {
            AppError.validation(
            this.entity,
            action,
            "E-mail inválido."
            );
        }
    }

    private validatePassword(action: string): void {
        if (!this.password) {
            AppError.validation(
            this.entity,
            action,
            "A senha é obrigatória."
            );
        }

        if (this.password.length < 8) {
            AppError.validation(
            this.entity,
            action,
            "A senha deve possuir pelo menos 8 caracteres."
            );
        }

        if (this.password.length > 128) {
            AppError.validation(
            this.entity,
            action,
            "A senha deve possuir no máximo 128 caracteres."
            );
        }
    }

}