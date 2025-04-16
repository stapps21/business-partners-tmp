import { Entity, ManyToOne } from 'typeorm';
import { Company } from "../../entities/Company";
import { BaseContact } from '../shared/BaseContact';

@Entity()
export class CompanyContact extends BaseContact {
    @ManyToOne(() => Company, company => company.contacts)
    company: Company;
}