import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from "../../entities/Employee";
import { BaseContact } from '../shared/BaseContact';

@Entity()
export class EmployeeContact extends BaseContact {
    @ManyToOne(() => Employee, employee => employee.contacts)
    employee: Employee;
}