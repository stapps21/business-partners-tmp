import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User"; // Assuming this is your User entity

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    entityName: "Company" | "Employee";

    @Column()
    entityId: number;

    @Column()
    name: string;

    @Column()
    action: "CREATE" | "UPDATE" | "DELETE";

    @Column('text', { nullable: true })
    previousState: string;

    @Column('text', { nullable: true })
    afterState: string;

    @CreateDateColumn({ type: 'timestamp' })
    timestamp: Date;

    // Many-To-One relationship to the User entity
    @ManyToOne(() => User, user => user.logs, { nullable: true })
    user: User;
}
