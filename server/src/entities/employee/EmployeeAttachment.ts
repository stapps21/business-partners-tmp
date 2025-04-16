import { Entity, ManyToOne } from "typeorm";
import { Employee } from "../Employee";
import { BaseAttachment } from "../shared/BaseAttachment";

@Entity()
export class EmployeeAttachment extends BaseAttachment {
    @ManyToOne(type => Employee, employee => employee.attachments)
    employee: Employee;
}
