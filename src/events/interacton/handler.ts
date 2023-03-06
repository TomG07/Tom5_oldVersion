import { ChannelType, CommandInteraction } from "discord.js";
import i18next, { TFunction } from "i18next";
import Event from "../../classes/event.js";
import Tom5 from "../../classes/Tom5.js";
import ctx from "../../others/context";

export default class extends Event {

    client: Tom5

    constructor(client: Tom5) {
        super(
            {
                eventName: "interactionCreate",
                name: "handler",
                once: false
            }
        ),
        this.client = client
        this.execute = async (interaction: CommandInteraction) => {

            if(!interaction.guild) return
            if(interaction.user.bot) return

            if(interaction.channel?.type !== ChannelType.GuildText) return

            if(!interaction.isChatInputCommand()) return

            let userDoc = await this.client.userDB.findOne(
                {
                    _id: interaction.user.id
                }
            )

            let guildDoc = await this.client.guildDB.findOne(
                {
                    _id: interaction.guild.id
                }
            )

            if(!userDoc) {
                userDoc = await new this.client.userDB(
                    {
                        _id: interaction.user.id
                    }
                ).save()
            }

            if(!guildDoc) {
                guildDoc = await new this.client.guildDB(
                    {
                        _id: interaction.guild.id
                    }
                ).save()
            }

            let lang = Number(interaction.guild.preferredLocale.toString() == "pt-BR" ? 1 : null)
            || Number(interaction.guild.preferredLocale.toString() == "fr" ? 3 : null)
            || Number(interaction.guild.preferredLocale.toString() == "es-ES" ? 4 : null)
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

            const context = new ctx(
                {
                    args: null,
                    message: null,
                    interaction: interaction,
                    t: t
                }
            )

            let comando: any = this.client.commands.commands.slash.get(interaction.commandName)

            if(comando) {
                comando.execute( context )
            }
        }
    }
}