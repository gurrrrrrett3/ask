import { NextFunction, Request, Response } from "express";
import Core from "../../core.js";

export default function ContextMiddleware(req: Request, res: Response, next: NextFunction) {
    req.body = {
        ...req.body,
        ...Core.services.context.open()
    }

    Core.services.context.set(req.body.rid, "path", req.query.path || req.path)
    res.setHeader("x-request-id", req.body.rid)

    next()
}
