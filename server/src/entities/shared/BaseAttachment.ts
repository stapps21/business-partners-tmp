import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "../Employee";

@Entity()
export class BaseAttachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Index()
    @Column()
    originalFilename: string;

    @Column()
    fileExtension: string;

    @Column()
    fileSize: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
