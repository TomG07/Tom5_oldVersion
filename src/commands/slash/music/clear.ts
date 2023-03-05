import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import Command from "../../../classes/command";
import Tom5 from "../../../classes/Tom5";
import { CtxType } from "../../../types/context";

export default class extends Command {

    client: Tom5;
    
    constructor(client: Tom5) {
        super(
            {
                name: "clear",
                description: "Limpe a lista de músicas",
                type: ApplicationCommandType.ChatInput,
                commandType: "slash"
            }
        )
        this.client = client
        this.execute = async ( ctx: CtxType ) => {

            let defe = {
                canalVozMembro: this.client.guilds.cache.get(ctx.interaction.guild?.id || "")?.members.cache.get(ctx.interaction.user.id)?.voice.channel,
                canalVozClient: ctx.interaction.guild?.members.me?.voice.channel,
                server: ctx.interaction.guild,
                player: this.client.vulkava.players.get(ctx.interaction.guild?.id.toString() || "")                
            }

            if(!defe.player) {
                return ctx.interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:clear.noPlayer",
                                    {
                                        emoji: this.client._emojis.errado
                                    }
                                )
                            )
                        ]
                    }
                )
            }

            if(!defe.canalVozMembro) {
                return ctx.interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:clear.semCanal",
                                    {
                                        emoji: this.client._emojis.errado
                                    }
                                )
                            )
                        ]
                    }
                )
            }

            if(defe.canalVozMembro?.id !== defe.canalVozClient?.id) {
                return ctx.interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:clear.mesmoCanal",
                                    {
                                        emoji: this.client._emojis.errado,
                                        voiceChannel: defe.canalVozClient?.id
                                    }
                                )
                            )
                        ]
                    }
                )
            }

            defe.player?.queue.clear()

            ctx.interaction.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2a2d31")
                        .setDescription(
                            ctx.t(
                                "commands:musica:clear.embed",
                                {
                                    emoji: this.client._emojis.certo
                                }
                            )
                        )
                    ]
                }
            )
        }
    }
}