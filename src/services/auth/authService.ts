import AbstractService from "../../base/abstractSerice.js";
import Core from "../../core.js";
import authRouter from "./router.js";

export default class AuthService extends AbstractService<"auth"> {

    constructor() {
        super("auth");
    }

    public async init(): Promise<void> {
        Core.services.web.addRoute("/auth", authRouter)
    }

    public async destroy(): Promise<void> {
        // Cleanup logic for the auth service
    }
}