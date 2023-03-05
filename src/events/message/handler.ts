import { EmbedBuilder, Message, TextChannel } from "discord.js";
import i18next, { TFunction } from "i18next";
import Event from "../../classes/event.js";
import Tom5 from "../../classes/Tom5.js";
import ctx from "../../others/context";

export default class extends Event {

    client: Tom5

    constructor(client: Tom5) {
        super(
            {
                eventName: "messageCreate",
                name: "handler",
                once: false
            }
        ),
        this.client = client
        this.execute = async (message: Message) => {
            
            if(!message.guild) return
            if(message.author.bot) return


            var prefix;

            const mentionRegex = message.content.match(
                new RegExp(`^<@!?(${this.client.user?.id})>`, 'gi')
            )

            if(mentionRegex) {
                prefix = String(mentionRegex)
            } else if(message.content.startsWith('tom5 ')) {
                prefix = 'tom5'
            } else if(message.content.startsWith('TOM5 ')) {
                prefix = 'TOM5'
            } else {
                prefix = this.client.prefix
            }


            let userDoc = await this.client.userDB.findOne(
                {
                    userId: message.author.id
                }
            )

            let guildDoc = await this.client.guildDB.findOne(
                {
                    guildId: message.guild.id
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
                        guildId: message.guild.id
                    }
                ).save()
            }


            if(!message.content.toLocaleLowerCase().startsWith(prefix.toString())) return
            if(!message.content.startsWith(prefix.toString())) return

            const args = message.content.slice(prefix.length).trim().split(" ")

            var messageCommand = args.shift()?.toLowerCase()

            if(!messageCommand || !messageCommand.length || !message.content) return

            let command: any;

            let lang = Number(message.guild.preferredLocale.toString() == "pt-BR" ? 1 : null)
            || Number(message.guild.preferredLocale.toString() == "fr" ? 3 : null)
            || Number(message.guild.preferredLocale.toString() == "es-ES" ? 4 : null)
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
                    message: message,
                    args: args,
                    interaction: null,
                    t: t
                }
            ).get()


            let prob = Math.random()

            try {

                command = this.client.commands.commands.prefixo.get(messageCommand) || this.client.commands.aliases.prefixo.get(messageCommand)

                if(prob >= 0.9) {

                    if(
                        this.client.commands.commands.slash.get(command.name)
                    ) {
    
                        console.log("Comando igual e prob maior ou igual a 0.9");                    
    
                        let comandoSlash = this.client.application?.commands.cache.find(c => c.name == command.name)   
                        
                        const channel = message.channel as TextChannel
    
                        channel.send(
                            {
                                content: `${message.author}`,
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor("#2a2d31")
                                    .setTitle(`<:tom5_icons_supportscommandsbadge:1013545551100383355> Slash Commands (/)`)
                                    .setDescription(
                                        context.t(
                                            "events:message:handler.msgSlash",
                                            {
                                                slash: `</${comandoSlash?.name}:${comandoSlash?.id}>`
                                            }
                                        )
                                    )
                                ]
                            }
                        )
                    }
                }

                command.execute( context )

            } catch (err) {

                message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                context.t(
                                    "events:message:handler.cmdNaoExistente",
                                    {
                                        emoji: this.client._emojis.errado,
                                        command: messageCommand
                                    }
                                )
                            )
                        ]
                    }
                )
            }
        }
    }
}