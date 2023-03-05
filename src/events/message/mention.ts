import chalk from "chalk";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Message } from "discord.js";
import i18next from "i18next";
import Event from "../../classes/event.js";
import Tom5 from "../../classes/Tom5.js";

export default class extends Event {

    client: Tom5

    constructor(client: Tom5) {
        super(
            {
                eventName: "messageCreate",
                name: "mention",
                once: false
            }
        ),
        this.client = client
        this.execute = async (message: Message) => {
            
            if(message.author.bot) return
            if(message.channel.type === ChannelType.DM) return

            if(message.content !== `<@${this.client.user?.id}>`) return

            let userDoc = await this.client.userDB.findOne(
                {
                    userId: message.author.id
                }
            )

            let guildDoc = await this.client.guildDB.findOne(
                {
                    guildId: message.guild?.id
                }
            )

            if(!userDoc) {
                userDoc = await new this.client.userDB(
                    {
                        userId: message.author.id
                    }
                ).save()
            }

            if(!guildDoc) {
                guildDoc = await new this.client.guildDB(
                    {
                        guildId: message.guild?.id
                    }
                ).save()
            }

            let lang = Number(message.guild?.preferredLocale.toString() == "pt-BR" ? 1 : null)
            || Number(message.guild?.preferredLocale.toString() == "fr" ? 3 : null)
            || Number(message.guild?.preferredLocale.toString() == "es-ES" ? 4 : null)
            || 2
        
            guildDoc.language = lang
            guildDoc.save()

            let tGuildLang: number = guildDoc.language
            var t = i18next.t

            switch(tGuildLang) {
                case 1: {
                    t = i18next.getFixedT("pt-BR")
                    break
                }

                case 2: {
                    t = i18next.getFixedT("en-US")
                    break
                }

                case 3: {
                    t = i18next.getFixedT("fr")
                    break
                }

                case 4: {
                    t = i18next.getFixedT("es-ES")
                    break
                }
            }

            try {

                message.reply(
                    {
                        content: `${
                            t(
                                "events:message:mention.content",
                                {
                                    author: message.author.id,
                                    prefix: this.client.prefix
                                }
                            )
                        }`,
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setTitle(`<:tom5_icons_supportscommandsbadge:1013545551100383355> Slash Commands (/)`)
                            .setDescription(
                                t(
                                    "events:message:mention.embed",
                                    {
                                        slash: "</help:123456789>"
                                    }
                                )
                            )
                        ],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setLabel(
                                    t(
                                        "events:message:mention.button"
                                    )
                                )
                                .setEmoji(
                                    {
                                        animated: false,
                                        id: "1013545489980981308",
                                        name: "tom5_icons_link"
                                    }
                                )
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://canary.discord.com/api/oauth2/authorize?client_id=1079120730983235615&permissions=1099749969286&scope=applications.commands%20bot")
                            )
                        ]
                    }
                )
            } catch (err) {
                console.log(err)
            }
        }
    }
}