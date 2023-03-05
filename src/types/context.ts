import { CommandInteraction, Message } from "discord.js"
import { TFunction } from "i18next"

export type CtxType = {
    message: Message
    args: Array<String>
    interaction: CommandInteraction
    t: TFunction
}