import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import Id from "../../util/id.js";
import User from "./User.entity.js";
import type { Rel } from "@mikro-orm/core"
import crypto from "crypto"

@Entity()
export class Ask {
    @PrimaryKey()
    id: string = Id.get()

    @Property()
    text: string

    @ManyToOne({
        entity: () => User
    })
    user!: Rel<User>

    @Property()
    ipHash: string

    @Property()
    timestamp = new Date()

    constructor(text: string, ip: string, user: Rel<User>) {
        this.text = text
        this.ipHash = crypto.createHash("sha256").update(ip).digest("hex")
        this.user = user
    }

}