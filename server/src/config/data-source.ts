import "reflect-metadata"
import dotenv from 'dotenv'
import { DataSource } from "typeorm"
import { Company } from "../entities/Company"
import { Location } from "../entities/shared/Location";
import { Industry } from "../entities/company/Industry";
import { EmployeeAttachment } from "../entities/employee/EmployeeAttachment";
import { CompanyAttachment } from "../entities/company/CompanyAttachment";
import { Employee } from "../entities/Employee";
import { Distributor } from "../entities/Distributor";
import { JobTitle } from "../entities/employee/JobTitle";
import { Subject } from "../entities/employee/Subject";
import { User } from "../entities/User";
import { EmployeeContact } from "../entities/employee/EmployeeContact";
import { CompanyContact } from "../entities/company/CompanyContact";
import { BaseAttachment } from "../entities/shared/BaseAttachment";
import { SearchView } from "../entities/SearchView";
import { Log } from "../entities/Log";

dotenv.config()

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
    entities: [Company, Location, Industry, EmployeeAttachment, CompanyAttachment, Employee, Distributor, JobTitle, Subject, User, EmployeeContact, CompanyContact, BaseAttachment, SearchView, Log],
    migrations: [],
    subscribers: [],
})
