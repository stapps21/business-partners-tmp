import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "../Company";
import { Employee } from "../Employee";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Index()
    @Column()
    street: string;

    @Index()
    @Column()
    houseNumber: string;

    @Index()
    @Column()
    postalCode: string;

    @Index()
    @Column()
    city: string;

    @ManyToOne(type => Company)
    company: Company;

    @OneToMany(type => Employee, employee => employee.location)
    employees: Employee[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
