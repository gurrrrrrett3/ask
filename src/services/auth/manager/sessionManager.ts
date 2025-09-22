import Core from "../../../core.js";
import Session from "../../../database/entities/Session.entity.js";
import User from "../../../database/entities/User.entity.js";
import { ms } from "../../../util/time.js";

const sessionExpire = ms("1 week")
const sessionTouch = ms("5 minutes")

export default class SessionManager {

    private static touchCache: Map<string, NodeJS.Timeout> = new Map();

    public static async genSession(user: User, userAgent: string): Promise<Session> {
        const session = new Session();
        session.user = user;
        session.userAgent = userAgent;

        await Core.database.em.persistAndFlush(session);

        return session;
    }

    public static async checkSession(session: string, userAgent?: string): Promise<Session | undefined> {

        if (await Core.services.cache.get(`session_ignore:${session}`)) {
            return undefined;
        }

        const cachedSessionString = await Core.services.cache.get(`session:${session}`);
        const cachedSession = cachedSessionString && Session.deserialize(cachedSessionString);


        // check if session is in cache
        if (cachedSession) {

            if (userAgent && cachedSession.userAgent !== userAgent) {
                await Core.services.cache.set(`session_ignore:${session}`, "1");
                return undefined;
            }

            this.touchSession(cachedSession);
            return cachedSession;
        }

        // check if session exists
        const validSession = await Core.database.em.findOne(Session, {
            id: session,
        }, {
            populate: ["user", "user.auth"],
        });

        if (validSession) {

            // Add to cache
            await Core.services.cache.set(`session:${session}`, validSession.serialized, sessionExpire);

            if (userAgent && validSession.userAgent !== userAgent) {
                await Core.services.cache.set(`session_ignore:${session}`, "1");
                return undefined;
            }

            // Update the session
            validSession.lastUsed = new Date();

            // no need to await
            Core.database.em.persistAndFlush(validSession);
            return validSession;
        }

        await Core.services.cache.set(`session_ignore:${session}`, "1");
        return undefined;
    }

    public static async deleteSession(session: string): Promise<void> {
        await Core.database.em.nativeDelete(Session, {
            id: session,
        });

        await Core.services.cache.del(`session:${session}`);
    }

    public static async touchSession(session: Session): Promise<void> {
        session.lastUsed = new Date();
        await Core.services.cache.set(`session:${session.id}`, session.serialized, sessionExpire);

        if (this.touchCache.has(session.id)) {
            clearTimeout(this.touchCache.get(session.id)!);
        }

        this.touchCache.set(session.id, setTimeout(async () => {
            this.touchCache.delete(session.id);
            await Core.database.em.persistAndFlush(session);
        }, sessionTouch));
    }

    public static async checkSessionExpire(): Promise<void> {
        if (!Core.database.em) return;
        const sessions = await Core.database.em.find(Session, {
            lastUsed: {
                $lt: new Date(Date.now() - sessionExpire),
            },
        })

        await Core.database.em.removeAndFlush(sessions);
    }
}