import { JwtUserPayload } from "types/api/AuthTypes";

export { }

declare global {
    namespace Express {
        export interface Request extends JwtUserPayload { }
    }
}