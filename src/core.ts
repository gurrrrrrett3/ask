import Database from "./database/index.js";
import AuthService from "./services/auth/authService.js";
import CacheService from "./services/cache/cacheService.js";
import ClientService from "./services/client/clientService.js";
import ContextService from "./services/context/contextService.js";
import WebService from "./services/web/webService.js";
import { Logger } from "./util/logger.js";

export default class Core {

    protected static logger = new Logger("Core");
    public static database: Database = new Database();
    public static BASE_URL: string = process.env.BASE_URL || "http://localhost:3000";
    public static readonly DEVELOPMENT = process.env.NODE_ENV === "development" || process.argv.includes("--dev")

    /**
     * A set of all services that are initialized by the core.
     * 
     * services are started synchronously in this order.
     */
    public static serviceList = [
        new CacheService(),
        new WebService(parseInt(process.env.PORT!) || 3000),
        new ContextService(),
        new AuthService(),
        new ClientService(), // make sure it registers its wildcard route last
    ];

    public static services: {
        [K in typeof this.serviceList[number]["name"]]: Extract<typeof this.serviceList[number], { name: K }>
    } = {} as any;

    public static async init() {

        if (this.DEVELOPMENT) {
            this.logger.warn("Development mode enabled.")
        }

        await this.database.init();

        for (const service of this.serviceList) {
            const serviceName = service.name
            // @ts-ignore - serviceName will always be the correct key in services
            this.services[serviceName] = service;

            try {
                await service.init();
                this.logger.log(`Service ${serviceName} initialized`);
            } catch (error) {
                this.logger.error(`Error initializing service ${serviceName}:`, error);
            }
        }

        this.logger.log("All services initialized, starting web service...");

        await this.database.em.flush();
        await this.services.web.start();

        this.logger.log("Ready!")
    }

    public static async destroy() {
        for (const service of Object.values(this.services)) {
            try {
                await service.destroy();
            } catch (error) {
                this.logger.error(`Error destroying service ${service.name}:`, error);
            }
        }
    }

    public static getService<T extends keyof typeof this.services>(name: T): typeof this.services[T] {
        const service = this.services[name];
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }
        return service;
    }
}
