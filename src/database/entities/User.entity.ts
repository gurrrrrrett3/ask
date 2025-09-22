import { Collection, Entity, EntityRepositoryType, Index, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import UserAuth, { AuthType } from "./UserAuth.entity.js";
import Id from "../../util/id.js";
import Session from "./Session.entity.js";
import Core from "../../core.js";
import { Ask } from "./Ask.entity.js";

@Entity()
export default class User {


    @PrimaryKey()
    id: string = Id.get()

    @Property({
        unique: true,
        length: 32,
        type: "varchar",
    })
    @Index()
    username: string

    @Property({
        type: "text"
    })
    prompt: string = "ask me anything!"

    @OneToMany({
        entity: () => Ask,
        mappedBy: "user"
    })
    asks = new Collection<Ask>(this)

    @Property({
        nullable: true
    })
    avatarHash?: string

    @OneToMany({
        entity: () => UserAuth,
        mappedBy: "user",
    })
    auth = new Collection<UserAuth>(this)

    @OneToMany({
        entity: () => Session,
        mappedBy: "user",
    })
    sessions = new Collection<Session>(this)

    @Property()
    createdAt: Date = new Date()

    constructor(username: string, avatarHash?: string) {
        this.username = username
        this.avatarHash = avatarHash
    }

    public addAuth(auth: UserAuth) {
        this.auth.add(auth)
    }

    public async getAuth(authType: AuthType) {
        return await Core.database.em.findOne(UserAuth, {
            user: this,
            type: authType
        }) || undefined
    }
}