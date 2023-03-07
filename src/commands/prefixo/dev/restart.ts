import { EmbedBuilder, Message } from "discord.js";
import Command from "../../../classes/command.js";
import Tom5 from "../../../classes/Tom5.js";
import { CtxType } from "../../../types/context.js";
import fs from "fs"

export default class extends Command {

    client: Tom5;
    restart: () => void;

    constructor(client: Tom5) {
        super(
            {
                name: "restart",
                description: ".",
                aliases: ["rr"],
                commandType: "prefix",
            }
        ),
        this.client = client
        this.execute = async ( ctx: CtxType ) => {

            if(!this.client.devs.includes(ctx.message.author.id)) {
                return ctx.message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#302c34")
                            .setDescription(`**(${this.client._emojis.errado}) Somente os meus desenvolvedores podem usar este comando**`)
                        ]
                    }
                )
            }
            
            const msg = await ctx.message.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2a2d31")
                        .setDescription(`**(${this.client._emojis.load}) A reiniciar...**`)
                    ]
                }
            )

            await this.restart()

            setTimeout(() => {
                msg.edit(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(`**(${this.client._emojis.certo}) Reiniciei com sucesso.**`)
                        ]
                    }
                )
            }, 5000)
            
        }
        this.restart = () => {
            /* COMANDOS EM PREFIXO */
            const foldersPrefix = fs.readdirSync('./src/commands/prefixo')

            foldersPrefix.forEach(async (folder) => {

                const filesPrefix = fs.readdirSync(`./src/commands/prefixo/${folder}`).filter(f => f.endsWith(`.ts`))

                filesPrefix.forEach(async (file) => {

                    const PrefixCommandsClass = (await import(`../${folder}/${file}`)).default

                    const PrefixCommand = new PrefixCommandsClass(this.client)

                    this.client.commands.commands.prefixo.set(PrefixCommand.name, PrefixCommand)

                    if(PrefixCommand.aliases?.length > 0 ) {
                        for(let aliase of PrefixCommand.aliases) {
                            this.client.commands.aliases.prefixo.set(aliase, PrefixCommand)
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

                    const SlashCommandsClass = (await import(`../../slash/${folder}/${file}`)).default

                    const SlashCommand = new SlashCommandsClass(this.client)

                    this.client.commands.commands.slash.set(SlashCommand.name, SlashCommand)             

                    await this.client.application?.commands.create(SlashCommand)
                })
            })
        }
    }
}