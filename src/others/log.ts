import chalk from "chalk"

export interface LogInterface {
    content: String
    type: "error" | "sucess" | "warn" | "log" | String
    tag: "client" | "command" | "event" | "lavalink" | "other" | "anticrash" | String
    aditionals?: String | unknown
}

export default class Log implements LogInterface {

    content!: String
    type!: "error" | "sucess" | "warn" | "log" | String
    tag!: "client" | "command" | "event" | "lavalink" | "other" | "anticrash" | String
    aditionals?: String | unknown

    constructor(options: LogInterface) {
        this.content = options.content
        this.type = options.type
        this.tag = options.tag
        this.aditionals = options.aditionals

        let allString = ""

        switch(this.tag) {
            case "client": {
                this.tag = "CLIENT"
                
                break
            }

            case "command": {
                this.tag = "COMMAND"

                break
            }

            case "event": {
                this.tag = "EVENT"

                break
            }

            case "lavalink": {
                this.tag = "LAVALINK"

                break
            }

            case "other": {
                this.tag = "OTHER"

                break
            }

            case "anticrash": {
                this.tag = "ANTICRASH"

                break
            }
        }

        switch(this.type) {
            case "error": {
                allString += `${chalk.red(`[${this.tag}]`)} `

                break
            }

            case "log": {
                allString += `${chalk.grey(`[${this.tag}]`)} `

                break
            }

            case "sucess": {
                allString += `${chalk.green(`[${this.tag}]`)} `

                break
            }

            case "warn": {
                allString += `${chalk.yellow(`[${this.tag}]`)} `

                break
            }
        }

        allString += `- ${this.content}`

        if(this.aditionals) allString += `\n${this.aditionals}`

        console.log(allString)
    }
}