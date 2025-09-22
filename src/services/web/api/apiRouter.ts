import { Router } from 'express';
import { usernameCheckRegex } from '../../client/components/settings/Username.js';
import { promptMaxLen, promptMinLen } from '../../client/components/settings/Prompt.js';
import AuthMiddleware from '../../auth/middleware.js';
import Session from '../../../database/entities/Session.entity.js';
import Core from '../../../core.js';
import { askMaxLen } from '../../client/components/user/guest/AskPrompt.js';
import { Ask } from '../../../database/entities/Ask.entity.js';
const router = Router();

const cleanRegex = /[^ -~]/


router.post("/ask", async (req, res) => {
    const { ask, userId } = req.body as {
        ask: string
        userId: string
    }

    if (!ask) {
        res.status(400).send("uhh, thats not right. try again please :3")
        return
    }

    if (ask.length > askMaxLen) {
        res.status(400).send("that ask is a little *too* silly for my tastes :/")
        return
    }

    const cleanAsk = ask.replace(cleanRegex, '')

    const user = await Core.database.repository.user.findOne({
        id: userId
    })

    if (!user) {
        res.status(400).send("they dont have an account here, youre looking for someone else :p")
        return
    }

    const askEntity = new Ask(cleanAsk, req.headers["x-remote-ip"] as string || req.socket.remoteAddress as string, user)
    await Core.database.em.persistAndFlush(askEntity).catch((err) => {
        console.error(err)
        res.status(500).send("something went wrong on our end :/")
    })

    res.send("sent!")

})

router.use(AuthMiddleware)

router.post("/settings", async (req, res) => {

    const { username, prompt } = req.body as {
        username: string,
        prompt: string
    }

    const session = req.body.session as Session

    if (!session || !session.user) {
        res.status(400).send("youve gotta be logged in for this one, silly!")
        return
    }


    if (!username || !prompt) {
        res.status(400).send("uhh, thats not right. try again please :3")
        return
    }

    if (!usernameCheckRegex.test(username)) {
        res.status(400).send("that username is a little *too* silly for my tastes :/")
        return
    }

    if (prompt.length < promptMinLen || prompt.length > promptMaxLen) {
        res.status(400).send("that prompt is a little *too* silly for my tastes :/")
        return
    }

    const cleanPrompt = prompt.replace(cleanRegex, '')

    session.user.username = username
    session.user.prompt = cleanPrompt

    await Core.database.em.persistAndFlush(session.user).catch(() => {
        res.status(500).send("something went wrong on our end :/")
    })

    res.send("settings updated!")

})




export default router;