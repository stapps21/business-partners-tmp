import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { Company } from "../Company";

@Entity()
export class Industry {
    @PrimaryGeneratedColumn()
    id: number;

    //@Index()
    @Column({ unique: true })
    name: string;

    @ManyToMany(type => Company, company => company.industries)
    companies: Company[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
