import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Location } from "./shared/Location";
import { Distributor } from "./Distributor";
import { EmployeeAttachment } from "../entities/employee/EmployeeAttachment";
import { JobTitle } from "../entities/employee/JobTitle";
import { Subject } from "../entities/employee/Subject";
import { User } from "../entities/User";
import { EmployeeContact } from "../entities/employee/EmployeeContact";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Location)
    location: Location;

    @Column({ nullable: true })
    salutation: string;

    @Column({ nullable: true })
    title: string;

    @Index()
    @Column()
    firstName: string;

    @Index()
    @Column()
    lastName: string;

    @ManyToMany(() => JobTitle)
    @JoinTable()
    jobTitles: JobTitle[];

    @ManyToMany(() => User)
    @JoinTable()
    usersInContact: User[];

    @OneToMany(() => EmployeeContact, contact => contact.employee)
    @JoinTable()
    contacts: EmployeeContact[];

    @ManyToMany(() => Subject)
    @JoinTable()
    subjects: Subject[];
    // Fachstelle / Firmenschulung

    @Index({ where: `"isActive" = true` })
    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    lastContact: Date;

    @Column({ default: false })
    DSGVOConsent: boolean;

    @OneToMany(type => EmployeeAttachment, attachment => attachment.employee)
    attachments: EmployeeAttachment[];

    @Column({ nullable: true, type: 'longtext' })
    notes: string | null;

    @ManyToMany(type => Distributor)
    @JoinTable()
    distributors: Distributor[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
