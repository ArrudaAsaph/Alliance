import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany
} from "typeorm";
import { Person } from "./person.model";
import { AppError } from "./error.model";

@Entity('families')
export class Family {
  private readonly entity = "family";
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  
  @Column({
    type: "varchar",
    length: 50
  })
  name: string;

  @CreateDateColumn({ name: "created_at" })
  readonly createdAt: Date;

  @Column({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Person, person => person.createdFamilies)
  @JoinColumn({ name: "created_by_id" })
  createdBy: Person;

  @ManyToMany(() => Person, person => person.families, { nullable: true})
  members: Person[];

  validateForCreate(): void {
    this.normalize();
    this.validateName("create");
  }

  validateForUpdate(): void {
    this.normalize();
    this.validateName("update");
  }

  private normalize(): void {
    if (this.name) this.name = this.name.trim();
  }

  private validateName(action: "create" | "update"): void {
    if (!this.name) {
      AppError.validation(
        this.entity, 
        action, 
        "O nome da família é obrigatório.", 
        400
      );
    }

    if (this.name.length < 3 || this.name.length > 50) {
      AppError.validation(
        this.entity, 
        action, 
        "O nome da família deve possuir entre 3 e 50 caracteres.",
        400
      );
    }
  }
}
