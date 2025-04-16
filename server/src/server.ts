require('module-alias/register')
import "reflect-metadata"
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import validateEnv from '@utils/validateEnv'
import { loggerMiddleware } from '@middlewares/LogMiddleware'
import { AppDataSource } from "@config/data-source";
import companyRouter from "@/routes/CompanyRoutes";
import { errorMiddleware } from "@middlewares/ErrorMiddleware";
import employeeRouter from "@/routes/EmployeeRoutes";
import industryRouter from "@/routes/IndustryRoutes";
import jobTitleRouter from "@/routes/JobTitleRoutes";
import subjectRouter from "@/routes/SubjectRoutes";
import { checkUserRoleMiddleware, checkValidTokenMiddleware, fakeAuthMiddleware } from "@middlewares/AuthMiddleware";
import { USER_ROLES } from "@/enum/UserRoles";
import userRouter from "@/routes/UserRoutes";
import * as process from "process";
import attachmentRouter from "@/routes/AttachmentRoutes";
import corsConfig from "@config/cors-config";
import credentials from "@middlewares/CredentialsMiddleware";
import authRouter from "@/routes/AuthRoutes"
import distributorRouter from "./routes/DistributorRoutes"
import locationRouter from "./routes/LocationRouter"
import contactRouter from "./routes/ContactRoutes"
import searchRouter from "./routes/SearchRoutes"
import logRouter from "./routes/LogRoutes"
import { initializeAdminUser } from "./config/initializeAdminUser"

dotenv.config()
validateEnv();

const app = express();

app.use(loggerMiddleware)

app.use(helmet());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

// All user must have a valid token and have at least the role of a user
if (process.env.DEV_AUTH === 'NO_AUTH') {
    app.use(fakeAuthMiddleware)
} else {
    app.use(checkValidTokenMiddleware)
    app.use(checkUserRoleMiddleware(USER_ROLES.USER, USER_ROLES.ADMIN))
}

app.use('/api/users', userRouter)
app.use('/api/log', logRouter)
app.use('/api/companies', companyRouter)
app.use('/api/locations', locationRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/distributors', distributorRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/industries', industryRouter)
app.use('/api/subjects', subjectRouter)
app.use('/api/job-titles', jobTitleRouter)
app.use('/api/attachments', attachmentRouter)
app.use('/api/search', searchRouter)
app.use(errorMiddleware);
app.use('*', (req, res, next) => {
    console.error("")
    console.error("+-------------------------->")
    console.error("| Route is most possible not defined!! Make sure it exist and you dont have any typo.!!!!!!!!!")
    console.error("+-------------------------->")
    console.error("")
    return res.status(500).json({ error: "Route is most possible not defined!! Make sure it exist and you dont have any typo." })
})

const PORT = process.env.PORT || 3000

AppDataSource.initialize()
    .then(() => {
        AppDataSource.runMigrations()
            .then(() => {
                console.log('Migrations run successfully');
                //AppDataSource.destroy();
                app.listen(PORT, () => {
                    console.log(`Server started on port ${PORT}`);
                    setTimeout(() => initializeAdminUser(), 10000);
                });
            })
            .catch(error => {
                console.error('Error running migrations', error);
                AppDataSource.destroy();
            });
    })
    .catch(error => {
        console.error('Error during Data Source initialization', error);
    });
