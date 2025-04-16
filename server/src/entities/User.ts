import { Column, CreateDateColumn, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from "../entities/Employee";
import { Log } from './Log';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    password: string;

    @Column('simple-array')
    roles: number[];

    @Column({ unique: true })
    mail: string;

    @Index()
    @Column()
    firstName: string;

    @Index()
    @Column()
    lastName: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    oneTimePassword: string;

    @Column({ nullable: true })
    otpExpiry: Date;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    lastPasswordChange: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(type => Employee, employee => employee.usersInContact)
    employees: Employee[];

    @OneToMany(() => Log, log => log.user)
    logs: Log[];
}
