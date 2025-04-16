import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from "../../entities/Employee";

@Entity()
export class JobTitle {
    @PrimaryGeneratedColumn()
    id: number;

    //@Index()
    @Column({ unique: true })
    name: string;

    @ManyToMany(type => Employee, employee => employee.jobTitles)
    employees: Employee[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}