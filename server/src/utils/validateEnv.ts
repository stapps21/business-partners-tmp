import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: port(),
        ACCESS_TOKEN_SECRET: str(),
        REFRESH_TOKEN_SECRET: str(),
        ACCESS_TOKEN_EXPIRES_IN: str(),
        REFRESH_TOKEN_EXPIRES_IN: str(),

        //Database
        DB_HOST: str(),
        DB_PORT: port(),
        DB_USERNAME: str(),
        DB_PASSWORD: str(),
        DB_DATABASE: str(),

        // SMTP Configuration
        SMTP_HOST: str(),
        SMTP_PORT: port(),
        SMTP_USER: str(),
        SMTP_PASSWORD: str()
    })
}

export default validateEnv;