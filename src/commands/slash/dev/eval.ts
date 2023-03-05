import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import Command from "../../../classes/command";
import Tom5 from "../../../classes/Tom5";
import { inspect } from "util"
import { CtxType } from "../../../types/context";

export default class extends Command {

    client: Tom5;

    constructor(client: Tom5) {
        super(
            {
                name: "eval",
                commandType: "slash",
                description: "Eval Command",
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: "code",
                        description: "Código para executar",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ],
                aliases: ["e"]
            },
            {
                userPermissions: ["Administrator"]
            }
        )
        this.client = client
        this.execute = async ( ctx: CtxType ) => {

            if(!this.client.devs.includes(ctx.interaction.user.id)) {
                return ctx.interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#302c34")
                            .setDescription(`**(${this.client._emojis.errado}) Somente os meus desenvolvedores podem usar este comando**`)
                        ]
                    }
                )
            }
    
            var code = ctx.interaction.options.get("code", true).value?.toString()           
    
            if(!code) {
                return ctx.interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#302c34")
                            .setDescription(`**(${this.client._emojis.errado}) Escreve o código a executar**`)
                        ]
                    }
                )
            }
    
            var output;
            
            try {
                const evalCode = await eval(code)
    
                if(typeof output !== "string") {
                    output = inspect(evalCode, { depth: 0 })
                }
    
                output = sub(output, 1950)
            } catch (err: any) {
                output = err.stack
            }
    
            const msg = await ctx.interaction.reply(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setColor("#302c34")
                        .setDescription(`>>> \`\`\`js\n${output}\`\`\``)
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("eval_delete")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({
                                animated: false,
                                id: "1013544051611533373",
                                name: "tom5_icons_Wrong"
                            })
                        )
                    ]
                }
            )
    
            msg.createMessageComponentCollector({
                time: 256000,
                componentType: ComponentType.Button,
                filter: (u) => u.user.id === ctx.interaction.user.id
            }).on("collect", async(interaction) => {
    
                if(interaction.customId !== "eval_delete") return
    
                interaction.deleteReply()
    
                interaction.message.delete()
            })
        }
    
        function sub(texto: string, limite: number) {
            if(texto.length > limite) {
                return texto.substring(0, limite) + "..."
            } else {
                return texto
            }
        }
    }
}