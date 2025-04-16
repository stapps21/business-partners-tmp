import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class BaseContact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: 'mail' | 'phone' | 'mobile' | 'fax';

    @Index()
    @Column()
    value: string;

    @Index()
    @Column()
    normalizedValue: string;

    @BeforeInsert()
    @BeforeUpdate()
    normalizePhoneNumber() {
        this.normalizedValue = this.value.replace(/\D/g, '');
    }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}