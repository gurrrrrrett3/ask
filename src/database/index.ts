import { MikroORM, PostgreSqlDriver, EntityManager } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import Logger from "../util/logger.js";
import { EntityRepository } from "@mikro-orm/core";
import Session from "./entities/Session.entity.js";
import User from "./entities/User.entity.js";
import UserAuth from "./entities/UserAuth.entity.js";
import { Ask } from "./entities/Ask.entity.js";

let instance: Database;

export default class Database {

    private _orm!: MikroORM;
    private _em!: EntityManager<PostgreSqlDriver>;
    public repository!: {
        ask: EntityRepository<Ask>
        session: EntityRepository<Session>
        user: EntityRepository<User>
        userAuth: EntityRepository<UserAuth>

    }

    constructor() {
        if (instance) {
            return instance;
        }
        instance = this;
    }

    public async init(): Promise<void> {
        const _orm = await MikroORM.init<PostgreSqlDriver>({
            entities: ["./dist/database/entities/*.js"],
            driver: PostgreSqlDriver,
            tsNode: true,
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASS,
            dbName: process.env.DB_NAME || "postgres",
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            metadataProvider: TsMorphMetadataProvider,
            debug: process.env.DEBUG === "true" || process.env.DB_DEBUG === "true",
        }).catch((err) => {
            Logger.error("Database", "Failed to initialize database");
            Logger.error("Database", err);
            console.error(err);
            process.exit(1);
        });

        this._orm = _orm;
        this._em = _orm.em;

        this.repository = {
            ask: this.em.getRepository(Ask),
            session: this.em.getRepository(Session),
            user: this.em.getRepository(User),
            userAuth: this.em.getRepository(UserAuth),
        }

        Logger.info("Database", "Database initialized");
    }

    public async close(): Promise<void> {
        await this._orm.close(true);
    }

    public get em(): EntityManager<PostgreSqlDriver> {
        if (!this._em) {
            throw new Error("Database not initialized");
        }
        return this._em.fork();
    }

    public get orm(): MikroORM {
        return this._orm;
    }
}