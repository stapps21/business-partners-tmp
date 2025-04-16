import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Location } from "./shared/Location";
import { Industry } from "./company/Industry";
import { CompanyContact } from "../entities/company/CompanyContact";
import { CompanyAttachment } from "../entities/company/CompanyAttachment";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Index("idx_company_name")
    @Column({ unique: true })
    name: string;

    //@OneToMany(type => Location, location => location.company, { lazy: true })
    @OneToMany(type => Location, location => location.company)
    locations: Location[];

    @Column({ nullable: true })
    website: string | null;

    @OneToMany(() => CompanyContact, contact => contact.company)
    @JoinTable()
    contacts: CompanyContact[];

    @ManyToMany(type => Industry)
    @JoinTable()
    industries: Industry[];

    @OneToMany(type => CompanyAttachment, attachment => attachment.company)
    attachments: CompanyAttachment[];

    @Column({ nullable: true, type: 'longtext' })
    notes: string | null;

    @Index({ where: `"isActive" = true` })
    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
