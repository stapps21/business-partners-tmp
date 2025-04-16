export class InvalidUserRoleError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidUserRoleError";

        // Set the prototype explicitly if targeting ES5
        Object.setPrototypeOf(this, InvalidUserRoleError.prototype);
    }
}
