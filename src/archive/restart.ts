import { EmbedBuilder } from "discord.js";
import Command from "../classes/command.js";
import Tom5 from "../classes/Tom5.js";
import { CtxType } from "../types/context.js";
import child, { spawn } from 'child_process'

export default class extends Command {

    client: Tom5;

    constructor(client: Tom5) {
        super(
            {
                name: "restart",
                description: "Comando de restart",
                commandType: "prefix",
            },
            {
                botPermissions: [],
                devOnly: false,
                dmPermission: false,
                userPermissions: []
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

            let msg = await ctx.message.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2a2d31")
                        .setDescription(`**(${this.client._emojis.load}) A reiniciar...**`)
                    ]
                }
            )

            this.client.lastRestartMessageId = {
                channelId: ctx.message.channel.id || "",
                guildId: ctx.message.guildId || "",
                messageId: msg.id
            }

            child.exec('ts-node src/launcher.ts')
            process.exit()
            
        }
    }
}