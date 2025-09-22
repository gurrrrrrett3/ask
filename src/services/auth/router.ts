import { Router } from 'express';
import OAuthManager from './manager/oAuthManager.js';
import Core from '../../core.js';
import SessionManager from './manager/sessionManager.js';
import { AuthTypeNames } from '../../database/entities/UserAuth.entity.js';
const authRouter = Router();


authRouter.get('/status', async (req, res) => {

    const session = await SessionManager.checkSession(req.cookies?.session, req.headers["user-agent"] as string)

    if (!session) {
        res.status(401).send("Unauthorized")
        return;
    }

    const providers = session.user.auth.getItems()

    const sessions = session.user.sessions

    if (!sessions.isInitialized()) {
        await sessions.init()
    }

    res.json({
        user: {
            id: session.user.id,
            username: session.user.username,
            avatar: session.user.avatarHash
        },
        providers:
            providers.reduce((acc, provider) => {
                acc[AuthTypeNames[provider.type]] = {
                    id: provider.authId,
                    username: provider.username
                }
                return acc
            }, {} as Record<string, { id: string, username: string }>),
        currentSession: session.id,
        sessions: sessions.getItems().map(s => ({
            userAgent: s.userAgent,
            lastUsed: s.lastUsed,
            current: s.id === session.id
        }))

    })
})

authRouter.get('/logout', async (req, res) => {
    await SessionManager.deleteSession(req.cookies?.session)

    res.clearCookie("session")
    res.redirect("/")
})

authRouter.get('/:provider', async (req, res) => {
    const provider = OAuthManager.getProvider(req.params.provider as keyof typeof OAuthManager.authProviders);
    if (!provider) {
        res.status(404).send("Provider not found");
        return;
    }

    res.redirect(provider.generateOauthUrl(OAuthManager.addRedirectHandler(req.query?.i as string, true)));
})

authRouter.get('/:provider/callback', async (req, res) => {
    const provider = OAuthManager.getProvider(req.params.provider as keyof typeof OAuthManager.authProviders);
    if (!provider) {
        res.status(404).send("Provider not found");
        return;
    }
    await provider.handleCallback(req, res);
});


export default authRouter;