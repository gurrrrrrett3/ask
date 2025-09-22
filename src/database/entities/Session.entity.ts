import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import User from "./User.entity.js";

@Entity()
export default class Session {

    @PrimaryKey()
    id: string = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

    @ManyToOne(() => User)
    user!: Rel<User>;

    @Property()
    userAgent!: string

    @Property()
    lastUsed: Date = new Date();

    public get serialized(): string {
        return `$ses:${this.id}:${this.userAgent}:${this.lastUsed.getTime()}`;
    }

    public static deserialize(serialized: string): Session | undefined {
        const parts = serialized.split(":");
        if (parts.length !== 4 || parts[0] !== "$ses") {
            return undefined;
        }

        const session = new Session();
        session.id = parts[1];
        session.userAgent = parts[2];
        session.lastUsed = new Date(parseInt(parts[3], 10));

        return session;
    }
}
