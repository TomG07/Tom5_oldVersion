import { ApplicationCommandOption } from "discord.js"

export interface CommandOptions {
    name: String,
    description: String,
    aliases?: Array<String>,
    type?: Number,
    options?: Array<ApplicationCommandOption>,
    commandType: "prefix" | "slash",
}

export interface DevOptions {
    devOnly?: Boolean,
    dmPermission?: Boolean,
    userPermissions?: Array<String>,
    botPermissions?: Array<String>
}

export default class Command implements CommandOptions, DevOptions {
    
    name: String
    description: String
    aliases?: Array<String> | undefined
    type?: Number | undefined
    options?:Array<ApplicationCommandOption> | undefined
    commandType: "prefix" | "slash"
    devOnly?: Boolean | undefined
    dmPermission?: Boolean | undefined
    userPermissions?: Array<String> | undefined
    botPermissions?: Array<String> | undefined
    execute: Function

    constructor(options: CommandOptions, dev?: DevOptions) {
        this.name = options.name,
        this.description = options.description,
        this.aliases = options.aliases,
        this.type = options.type,
        this.options = options.options,
        this.commandType = options.commandType
        this.devOnly = dev?.devOnly,
        this.dmPermission = dev?.dmPermission,
        this.userPermissions = dev?.userPermissions,
        this.botPermissions = dev?.botPermissions
        this.execute = () => {}
    }
}