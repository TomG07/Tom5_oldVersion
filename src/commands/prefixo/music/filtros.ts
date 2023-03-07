import { ActionRowBuilder, ActionRowComponent, ApplicationCommandType, ComponentType, EmbedBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
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

            const configs = {
                bass: {
                    equalizer: [0.29, 0.29, 0.19, 0.16, 0.08]
                },
                pop: {
                    equalizer: [-0.09, -0.09, -0.09, 0.02, 0.04, 0.16, 0.18, 0.22, 0.22, 0.18, 0.12, 0.02, -0.03, -0.06, -0.1]
                },
                soft: {
                    equalizer: [0, 0, 0, 0, 0, 0, 0, 0, -0.25, -0.25, -0.25, -0.25, -0.25, -0.25, -0.25]
                },
                trebleBass: {
                    equalizer: [0.55, 0.55, 0.5, 0.15, 0.3, 0.45, 0.23, 0.35, 0.45, 0.55, 0.55, 0.5, 0.10]
                },
                nightCore: {
                    equalizer: [0.3, 0.3],
                    timescale: { 
                        pitch: 1.2, 
                        rate: 1.1 
                    },
                    tremolo: { 
                        depth: 0.3, 
                        frequency: 14 
                    },
                },
                vaporWave: {
                    equalizer: [0.3, 0.3],
                    timescale: { 
                        pitch: 0.5 
                    },
                    tremolo: { 
                        depth: 0.3, 
                        frequency: 14 
                    },
                },
                lowPass: {
                    lowPass: { 
                        smoothing: 15 
                    }
                },
                '8d': {
                    rotation: { 
                        rotationHz: .2 
                    } 
                },
            }

            let activeFilters = defe.player?.filters.active

            // let menu: StringSelectMenuBuilder[] = [
            //     {
            //         customId: "menu_filtros",
            //         type: ComponentType.StringSelect,
            //         placeholder: "Selecionar Filtros",
            //         options: [
            //             data: {
            //                 "Bass"),
            //                 setValue("bass")
            //             },
            //             {
            //                 label: "Pop",
            //                 value: "pop"
            //             },
            //             {
            //                 label: "Soft",
            //                 value: "soft"
            //             },
            //             {
            //                 label: "Treblebass",
            //                 value: "treblebass"
            //             },
            //             {
            //                 label: "Nightcore",
            //                 value: "nightcore"
                    
            //             },
            //             {
            //                 label: "Vaporwave",
            //                 value: "vaporwave"
            //             },
            //             {
            //                 label: "Lowpass",
            //                 value: "lowpass"
            //             },
            //             {
            //                 label: "8D",
            //                 value: "8d"
            //             },
            //         ]
            //     }
            // ]

            // let optionsStringMenu = []

            // for(let option of options) {

            //     optionsStringMenu.push(
            //         new StringSelectMenuOptionBuilder()
            //         .setLabel(option.name)
            //         .setValue(option.name.toLocaleLowerCase())
            //         .setDescription(option.description || "")
            //     )
            // }

            // let menu = new StringSelectMenuBuilder()
            // .setCustomId("menu_filtros")
            // .setPlaceholder("Selecionar Filtros")
            // .setOptions([menuOptions])

            const msg = await ctx.message.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#2a2d31")
                        .setDescription(
                            ctx.t(
                                "commands:musica:filters:reply1.embed",
                                {
                                    emoji: this.client._emojis.load
                                }
                            )
                        )
                    ],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            // new StringSelectMenuBuilder()
                            // .setCustomId("menu_filters")
                            // .setPlaceholder("Selecionar Filtros")
                            // .setOptions(optionsStringMenu)
                            // .setMinValues(1)
                        )
                    ]
                }
            )

            msg.createMessageComponentCollector(
                {
                    componentType: ComponentType.StringSelect,
                    filter: (u) => u.user.id === ctx.message.author.id,
                    time: 256000
                }
            ).on("collect", (interaction) => {

                const data = interaction.values

                const filters = {}

                for(let opt in data)  {

                    switch(opt) {
                        case "bass": {

                            // Object.assign(filters, options[options.indexOf({name: "Bass"})])
                        }
                    }
                }
            })
        }
    }
}