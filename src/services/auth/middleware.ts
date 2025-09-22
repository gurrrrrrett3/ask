import { NextFunction, Request, Response } from "express";
import SessionManager from "./manager/sessionManager.js";

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const session = await SessionManager.checkSession(req.cookies.session, req.headers["user-agent"] as string);


    if (session) {
        req.body.session = session
    }

    next();
}