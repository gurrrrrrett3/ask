import express, { Application, RequestHandler } from "express";
import AbstractService from "../../base/abstractSerice.js";
import { Server } from "http";
import cookieParser from "cookie-parser";
import { resolve } from "path";
import AuthMiddleware from "../auth/middleware.js";
import apiRouter from "./api/apiRouter.js";

export default class WebService extends AbstractService<"web"> {

    public app: Application;
    public server: Server;

    constructor(public readonly port: number) {
        super("web");
        this.app = express();
        this.server = new Server(this.app);
    }

    public async init(): Promise<void> {
        this.app.use(cookieParser())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use("/_", express.static(resolve("./src/static/")))
        this.app.use("/api", apiRouter)
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                this.logger.log(`Started on port ${this.port}`);
                resolve();
            }).on("error", (err) => {
                this.logger.error("Error starting service:", err);
                reject(err);
            });
        });
    }

    public destroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    return reject(err);
                }
                this.logger.log("Service stopped");
                resolve();
            });
        });
    }

    public addRoute(path: string, handler: RequestHandler): void {
        this.app.use(path, handler);
    }

    public addMiddleware(handler: RequestHandler): void {
        this.app.use(handler)
    }

}