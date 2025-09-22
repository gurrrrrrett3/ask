import path from "path";
import AbstractService from "../../base/abstractSerice.js";
import Core from "../../core.js";
import express from "express"
import componentRouter from "./componentRouter.js";
import ComponentCache from "./componentCache.js";
import { renderToStream } from "@kitajs/html/suspense";
import Index from "./components/index.js";
import SessionManager from "../auth/manager/sessionManager.js";

export default class ClientService extends AbstractService<"client"> {

    public componentCache: ComponentCache;

    constructor() {
        super("client")
        this.componentCache = new ComponentCache(path.join(process.cwd(), 'dist/services/client/components'));
    }

    public async init(): Promise<void> {
        await this.componentCache.init();
        Core.services.web.addRoute("/component", componentRouter)

        Core.services.web.app.get("*root", async (req, res) => {
            const stream = renderToStream(async (r) => {
                const rid = r.toString()

                const context = Core.services.context.open(rid)

                req.body = {
                    ...req.body,
                    ...context
                }

                Core.services.context.set(req.body.rid, "path", req.query.path || req.path)
                res.setHeader("x-request-id", req.body.rid)

                const session = await SessionManager.checkSession(req.cookies.session, req.headers["user-agent"] as string);

                if (session) {
                    Core.services.context.set(rid, "session", session)
                    Core.services.context.set(rid, "loggedIn", true)
                }

                return Index({
                    path: req.path,
                    rid
                })
            })

            res.writeHead(200, {
                "Content-Type": "text/html",
                "Transfer-Encoding": "chunked"
            });

            if (stream && typeof stream.on === 'function') {
                stream.on("data", (chunk: any) => {
                    res.write(chunk);
                });

                stream.once("end", () => {
                    res.end();
                });
            } else {
                res.end('Stream error');
            }
        })
    }

    public async destroy(): Promise<void> {
        this.componentCache.close();
    }

}