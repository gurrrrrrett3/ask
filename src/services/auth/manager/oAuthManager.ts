import DiscordOAuthProvider from "../providers/discordOAuthProvider.js";
import { RedirectAuthHandler } from "../types.js";

export default class OAuthManager {
    private static _authHandlers: Map<string, RedirectAuthHandler> = new Map();
    public static authProviders = {
        discord: new DiscordOAuthProvider()
    }

    public static addRedirectHandler(url: string = "/", skipTokenCreation?: boolean) {
        const identifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this._authHandlers.set(identifier, { type: "redirect", oneTimeUse: true, url, createAccessToken: !skipTokenCreation });
        return identifier;
    }

    public static addNamedRedirectHandler(identifier: string, key: string, url: string) {
        if (this._authHandlers.has(identifier)) {
            const handler = this._authHandlers.get(identifier);
            if (handler?.key && handler.key === key) {
                this._authHandlers.set(identifier, { type: "redirect", url });
            } else {
                return {
                    success: false,
                    message: "Incorrect key"
                }
            }

            return {
                success: true,
                message: "Handler updated"
            }
        } else {
            this._authHandlers.set(identifier, { type: "redirect", url, key });

            return {
                success: true,
                message: "Handler added"
            }
        }
    }

    public static getHandler(identifier: string) {
        return this._authHandlers.get(identifier);
    }

    public static getProvider(provider: keyof typeof this.authProviders) {
        return this.authProviders[provider];
    }
}