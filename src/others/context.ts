import { CommandInteraction, Message } from "discord.js"
import { TFunction } from "i18next"

export interface ctxInterface {
    message: Message | null
    interaction: CommandInteraction | null
    args: Array<String> | null
    t: TFunction
}

export default class ctx implements ctxInterface {
    message: Message | null
    interaction: CommandInteraction | null
    args: Array<String> | null
    t: TFunction

    constructor(options: ctxInterface) {
        this.message = options.message
        this.interaction = options.interaction
        this.args = options.args
        this.t = options.t
    }

    get() {
        return {
            message: this.message,
            args: this.args,
            interaction: this.interaction,
            t: this.t
        }
    }
}