import { Router, RequestHandler } from 'express';
import ComponentCache from './componentCache.js';
import Core from '../../core.js';
import { renderToStream } from '@kitajs/html/suspense';
import { Fragment } from '@kitajs/html/jsx-runtime';
import OutOfBand from './components/shared/OutOfBand.js';
import SessionManager from '../auth/manager/sessionManager.js';

const componentRouter = Router();

componentRouter.get("/:id", async (req, res) => {
    const id = req.params.id.toLowerCase();
    const component = Core.services.client.componentCache.get(id);

    if (!component) {
        res
            .status(404)
            .setHeader("Content-Type", "text/plain")
            .send(`Component "${id}" not found`);
        return;
    }

    const query = req.query as Record<string, string>

    if (query.rid) {
        res
            .status(400)
            .setHeader("Content-Type", "text/plain")
            .send("really? :p")
        return
    }

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

        return Fragment({
            children: [
                component({ ...query, rid }),
                OutOfBand({
                    rid,
                    path: (req.query?.path as string) || req.path
                })
            ]
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
});

export default componentRouter
