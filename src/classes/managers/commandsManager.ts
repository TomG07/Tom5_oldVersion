import chalk from "chalk";
import Tom5 from "../Tom5";
import fs from "fs"
import { Collection } from "discord.js";

// export interface CommandsObject {
//     prefix: Array<Object>,
//     slash: Array<Object>
// }

// export interface AliasesObject {
//     prefix: Array<String>,
//     slash: Array<String>
// }

export default class CommandsManager {

    client: Tom5;
    commands = {
        prefixo: new Collection(),
        slash: new Collection()
    }
    aliases = {
        prefixo: new Collection(),
        slash: new Collection()
    }

    constructor(client: Tom5) {
        this.client = client
    }

    async loadCommands():Promise<void> {  
        
        console.log(chalk.yellow("[LOAD]"), '- A carregar comandos')

        /* COMANDOS EM PREFIXO */
        const foldersPrefix = fs.readdirSync('./src/commands/prefixo')

        foldersPrefix.forEach(async (folder) => {

            const filesPrefix = fs.readdirSync(`./src/commands/prefixo/${folder}`).filter(f => f.endsWith(`.ts`))

            filesPrefix.forEach(async (file) => {

                const PrefixCommandsClass = (await import(`../../commands/prefixo/${folder}/${file}`)).default

                const PrefixCommand = new PrefixCommandsClass(this.client)

                this.commands.prefixo.set(PrefixCommand.name, PrefixCommand)

                if(PrefixCommand.aliases?.length > 0 ) {
                    for(let aliase of PrefixCommand.aliases) {
                        this.aliases.prefixo.set(aliase, PrefixCommand)
                    }
                }
            })
        })

        /* COMANDOS EM SLASH */
        let comandosSlashs = this.client.application?.commands.cache.map(c => c.id)

        for(let slash in comandosSlashs) {

            console.log(slash)            
            
            this.client.application?.commands.cache.delete(slash)
        }

        const foldersSlash = fs.readdirSync('./src/commands/slash')

        foldersSlash.forEach(async (folder) => {

            const filesSlash = fs.readdirSync(`./src/commands/slash/${folder}`)

            filesSlash.forEach(async (file) => {

                const SlashCommandsClass = (await import(`../../commands/slash/${folder}/${file}`)).default

                const SlashCommand = new SlashCommandsClass(this.client)

                this.commands.slash.set(SlashCommand.name, SlashCommand)             

                await this.client.application?.commands.create(SlashCommand)
            })
        })

        console.log(chalk.green("[COMMANDS]"), '- Carregados')
    }
}