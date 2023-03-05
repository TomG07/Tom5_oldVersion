import { ActionRowBuilder, ApplicationCommandType, EmbedBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js";
import Command from "../../../classes/command";
import Tom5 from "../../../classes/Tom5";
import { CtxType } from "../../../types/context";

export default class extends Command {

    client: Tom5;
    
    constructor(client: Tom5) {
        super(
            {
                name: "filtros",
                description: "Aplique filtros no player",
                aliases: ["f"],
                commandType: "prefix"
            }
        )
        this.client = client
        this.execute = async ( ctx: CtxType ) => {

            let defe = {
                canalVozMembro: ctx.message.member?.voice.channel,
                canalVozClient: ctx.message.guild?.members.me?.voice.channel,
                server: ctx.message.guild,
                player: this.client.vulkava.players.get(ctx.message.guild?.id.toString() || "")
            }

            if(!defe.player) {
                return ctx.message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:filters.noPlayer",
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
                return ctx.message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:filters.semCanal",
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
                return ctx.message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:filters.mesmoCanal",
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

            let activeFilters = defe.player?.filters.active

            let options = ctx.t("commands:musica:filters:reply1:menu.options")

            let optionsArray = [options]

            // for(let option of options) {

            //     optionsArray.push(
            //         new SelectMenuOptionBuilder()
            //         .setLabel(options.name)
            //         .setDescription(option.description)
            //         .setValue(option.value)
            //     )
                
            // }

            // const msg = await ctx.message.reply(
            //     {
            //         embeds: [
            //             new EmbedBuilder()
            //             .setColor("#2a2d31")
            //             .setDescription(
            //                 ctx.t(
            //                     "commands:musica:filters:reply1.embed",
            //                     {
            //                         emoji: this.client._emojis.load
            //                     }
            //                 )
            //             )
            //         ],
            //         components: [
            //             new ActionRowBuilder<StringSelectMenuBuilder>()
            //             .addComponents(
            //                 new StringSelectMenuBuilder()
            //                 .setCustomId("menu_filters")
            //                 .setPlaceholder(
            //                     ctx.t(
            //                         "commands:musica:filters:reply1:menu.placeholder"
            //                     )
            //                 )
            //             )
            //         ]
            //     }
            // )
        }
    }
}