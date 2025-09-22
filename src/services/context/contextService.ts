import AbstractService from "../../base/abstractSerice.js";
import Core from "../../core.js";
import Id from "../../util/id.js";
import ContextMiddleware from "./contextMiddleware.js";

export default class ContextService extends AbstractService<"context"> {

    private _context: Record<string, Record<string, any>> = {}
    private _clean: NodeJS.Timeout
    private readonly _cleanInterval = 10_000

    constructor() {
        super("context");

        this._clean = setInterval(() => {
            const now = Date.now();
            for (const rid in this._context) {
                if (now - this._context[rid]._created > this._cleanInterval / 2) {
                    delete this._context[rid];
                }
            }
        }, this._cleanInterval)
    }

    public async init(): Promise<void> {
        Core.services.web.addMiddleware(ContextMiddleware)
    }

    public async destroy(): Promise<void> {
        clearInterval(this._clean)
    }

    public open(rid?: string) {
        rid = rid || Id.get()
        while (this._context[rid]) {
            rid = Id.get()
        }

        this._context[rid] = {
            _created: Date.now()
        };

        return {
            rid,
            context: this._context[rid]
        }
    }

    public set(rid: string, key: string, value: any) {
        if (!this._context[rid]) {
            this._context[rid] = {
                _created: Date.now()
            };
        }
        this._context[rid][key] = value;
    }

    public setMany(rid: string, values: Record<string, any>) {
        if (!this._context[rid]) {
            this._context[rid] = {
                _created: Date.now()
            };
        }

        Object.assign(this._context[rid], values);
    }

    public get(rid: string, key: string): any {
        if (!this._context[rid]) {
            return undefined;
        }
        return this._context[rid][key];
    }

    public clear(rid: string) {
        delete this._context[rid];
    }
}
