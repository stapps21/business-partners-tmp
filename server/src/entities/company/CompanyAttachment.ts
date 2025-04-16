import { Entity, ManyToOne } from "typeorm";
import { Company } from "../Company";
import { BaseAttachment } from "../shared/BaseAttachment";

@Entity()
export class CompanyAttachment extends BaseAttachment {
    @ManyToOne(type => Company, company => company.attachments)
    company: Company;
}
