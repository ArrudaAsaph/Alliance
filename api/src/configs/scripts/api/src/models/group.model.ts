import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import  { Person } from "./person.model";
import { Family } from "./family.model";
import { AppError } from "./error.model";
import  { GroupType } from "../@types/group/group.type";


@Entity('groups')
export class Group {
    private readonly entity = "group"
    
    @PrimaryGeneratedColumn("uuid")
    readonly id: string;
    @Column({
        type: "varchar",
        length: 100
    })
    name: string;
   
    @CreateDateColumn({ name: "created_at" })
    readonly createdAt: Date

    @Column({
        name: "type_group",
        type: "varchar",
        length: 20
    })
    typeGroup: GroupType
    
    @Column({
        name: "updated_at",
        type: "timestamp",
        nullable: true,
    })
    updatedAt: Date | null

    @ManyToOne(() => Person, {
        nullable: false,
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "created_by_id" })
    createdBy: Person;

    @ManyToOne(() => Family, {
        nullable: true,
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "family_id" })
    family: Family | null;

    validateForCreate(){
        this.validateName("create"),
        this.validateTypeGroup("create")
        this.normalize
    }

    private normalize():void{
        if(this.name) {
            this.name = this.name.trim()
        }
    }
    private validateName(action: string): void {
        if (!this.name) {
              throw new AppError(
                this.entity,
                action,
                "O nome do grupo é obrigatório.",
                400
              );
            }
        
            if (this.name.length < 2) {
              throw new AppError(
                this.entity,
                action,
                "O nome do grupo deve possuir pelo menos 2 caracteres.",
                400
              );
            }
        
            if (this.name.length > 20) {
              throw new AppError(
                this.entity,
                action,
                "O nome do grupo deve possuir no máximo 20 caracteres.",
                400
              );
            }
    }

    private validateTypeGroup(action: string): void {
        if (!this.typeGroup) {
            throw new AppError(
            this.entity,
            action,
            "O tipo do grupo é obrigatório.",
            400
            );
        }

        if (Object.values(GroupType).includes(this.typeGroup as GroupType)) {
            throw new AppError(
                this.entity,
                action,
                "O tipo do grupo é inválido.",
                400
            );
        }
    }
}
