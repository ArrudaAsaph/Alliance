import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
  ManyToMany
} from "typeorm";
import { User } from "./user.model";
import { AppError } from "../errors/error";

@Entity('persons')
export class Person {
    private readonly entity = "person";

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column ({
        name: "first_name",
        type: "varchar",
        length: 50,
    })
    firstName: string;

    @Column ({
        name: "last_name",
        type: "varchar",
        length: 50,
    })
    lastName: string;

    @Column({
        type: "date",
        nullable: true
    })
    birthday: Date | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @OneToOne(() => User, user => user.person)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "updated_at", type: "timestamp", nullable: true })
    updatedAt: Date | null;

    // =========================
    // VALIDATIONS
    // =========================

    validateForCreate(): void {
        this.validateFirstName("create");
        this.validateLastName("create");
        this.validateBirthday("create");
        this.normalize();
    }

    validateForUpdate(): void {
        this.normalize();

        this.validateFirstName("update");
        this.validateLastName("update");
        this.validateBirthday("update");
    }

    // =========================
    // HELPERS 
    // =========================

    private normalize(): void {
        if (this.firstName) {
            this.firstName = this.firstName.trim();
        }

        if (this.lastName) {
            this.lastName = this.lastName.trim();
        }
    }

    private validateFirstName(action: string): void {
        if (!this.firstName) {
            AppError.validation(
                this.entity,
                action,
                "O primeiro nome é obrigatório.",
                400
            );
        }
        if (this.firstName.length < 2) {
            AppError.validation(
                this.entity,
                action,
                "O primeiro nome deve possuir pelo menos 2 caracteres.",
                400
            );
        }
        if (this.firstName.length > 50) {
            AppError.validation(
                this.entity,
                action,
                "O primeiro nome deve possuir no máximo 50 caracteres.",
                400
            );
        }
    }

    private validateLastName(action: string): void {
        if (!this.lastName) {
            AppError.validation(
                this.entity,
                action,
                "O sobrenome é obrigatório.",
                400
            );
        }

        if (this.lastName.length < 2) {
            AppError.validation(
                this.entity,
                action,
                "O sobrenome deve possuir pelo menos 2 caracteres.",
                400
            );
        }

        if (this.lastName.length > 50) {
            AppError.validation(
                this.entity,
                action,
                "O sobrenome deve possuir no máximo 50 caracteres.",
                400
            );
        }
    }

    private validateBirthday(action: string): void {
        if (!this.birthday) {
            return;
        }

        const birthday = new Date(this.birthday);

        if (Number.isNaN(birthday.getTime())) {
            AppError.validation(
                this.entity,
                action,
                "Data de nascimento inválida.",
                400
            );
        }

        if (birthday > new Date()) {
            AppError.validation(
                this.entity,
                action,
                "A data de nascimento não pode ser futura.",
                400
            );
        }
    }
}
