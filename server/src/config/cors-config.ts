import allowedOrigins from "@config/allowed-origins";

interface CorsCallback {
    (err: Error | null, success?: boolean): void;
}

const corsConfig = {
    origin: (origin: string | undefined, callback: CorsCallback) => {
        //console.debug("Request from origin: ", origin)
        if (allowedOrigins.indexOf(<string>origin) !== -1 || !origin) { // TODO: remove !origin on production
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

export default corsConfig
