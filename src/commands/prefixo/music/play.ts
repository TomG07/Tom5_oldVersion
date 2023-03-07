import { ActionRowBuilder, ComponentType, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuOptionBuilder } from "discord.js";
import { Track, UnresolvedTrack } from "../../../libs/vulkava";
import Command from "../../../classes/command";
import Tom5 from "../../../classes/Tom5";
import { CtxType } from "../../../types/context";

export default class extends Command {

    client: Tom5;

    constructor(client: Tom5) {
        super(
            {
                commandType: "prefix",
                description: "Play a music",
                name: "play",
                aliases: ["p", "tocar"]
            },
        )
        this.client = client
        this.execute = async ( ctx: CtxType ) => {

            let defe = {
                canalVoz: ctx.message.member?.voice.channel,
                canalTexto: ctx.message.channel,
                server: ctx.message.guild,
                musica: ctx.args.join(` `)
            }

            if(!defe.canalVoz) {
                return ctx.message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:play.voiceChannel",
                                    {
                                        emoji: this.client._emojis.errado
                                    }
                                )
                            )
                        ]
                    }
                )
            }

            if(!defe.musica) {
                return ctx.message.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                            .setColor("#2a2d31")
                            .setDescription(
                                ctx.t(
                                    "commands:musica:play.song",
                                    {
                                        emoji: this.client._emojis.errado
                                    }
                                )
                            )
                        ]
                    }
                )
            }
                
            const player = this.client.vulkava.createPlayer({
                guildId: ctx.message.guild?.id || "",
                voiceChannelId: ctx.message.member?.voice.channel?.id || "",
                textChannelId: ctx.message.channel.id,
                selfDeaf: true,
                selfMute: false
            })

            let result = await this.client.vulkava.search(defe.musica)

            const tracksArray = new Array<Track | UnresolvedTrack>

            switch(result.loadType) {
                case "LOAD_FAILED": {

                    ctx.message.reply(
                        {
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#2a2d31")
                                .setDescription(
                                    ctx.t(
                                        "commands:musica:play:loadTypes.loadFailed",
                                        {
                                            emoji: this.client._emojis.errado
                                        }
                                    )
                                ),
                            ]
                        }
                    )

                    if(!player.current || !player.playing) player.destroy()

                    break
                }

                case "NO_MATCHES": {

                    ctx.message.reply(
                        {
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#2a2d31")
                                .setDescription(
                                    ctx.t(
                                        "commands:musica:play:loadTypes.noMatches",
                                        {
                                            emoji: this.client._emojis.errado
                                        }
                                    )
                                )
                            ]
                        }
                    )

                    if(!player.current || !player.playing) player.destroy()

                    break
                }

                case "PLAYLIST_LOADED": {

                    for(const track of result.tracks) {

                        track.setRequester(ctx.message.author)

                        player.queue.add(track)
                    }
                    
                    player.connect()

                    if(!player.current || !player.playing) await player.play()

                    ctx.message.reply(
                        {
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#2a2d31")
                                .setDescription(
                                    ctx.t(
                                        "commands:musica:play:loadTypes.playlistLoaded",
                                        {
                                            emoji: this.client._emojis.certo,
                                            playlistName: result.playlistInfo.name.substring(0, 40)
                                        }
                                    )
                                )
                            ]
                        }
                    )

                    break
                }

                case "SEARCH_RESULT": {

                    const tracks = result.tracks

                    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId("result_tracks_selector")
                        .setPlaceholder(
                            ctx.t(
                                "commands:musica:play:loadTypes:searchResult.menuPlaceholder"
                            )
                        )
                    )

                    for(let i = 0; i < tracks.length; i++) {

                        if(i < 25) {

                            tracksArray.push(tracks[i])
                            
                            row.components[0].addOptions(
                                [
                                    new StringSelectMenuOptionBuilder()
                                    .setLabel(tracks[i].title.substring(0, 40))
                                    .setValue(tracks[i].uri.substring(0, 99))
                                    .setDescription(tracks[i].author)
                                ]
                            )
                        }
                    }

                    const msg = await ctx.message.reply(
                        {
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#2a2d31")
                                .setDescription(
                                    ctx.t(
                                        "commands:musica:play:loadTypes:searchResult.selectMenuEmbed",
                                        {
                                            emoji: this.client._emojis.load
                                        }
                                    )
                                )
                            ],
                            components: [
                                row
                            ]
                        }
                    )

                    msg.createMessageComponentCollector(
                        {
                            componentType: ComponentType.StringSelect,
                            filter: (u) => u.user.id === ctx.message.author.id,
                            time: 256000
                        }
                    ).on("collect", async(interaction) => {     
                        
                        if(!interaction.isStringSelectMenu()) return
                        
                        const tracksURIs = tracksArray.map(t => t.uri.substring(0, 99))

                        if(!tracksURIs.includes(interaction.values[0])) return

                        let id: Track | UnresolvedTrack = tracksArray.filter(track => track.uri.substring(0, 99) == interaction.values[0])[0]

                        await player.queue.add(id)

                        player.connect()

                        if(!player.current || !player.playing) await player.play()

                        interaction.reply(
                            {
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor("#2a2d31")
                                    .setDescription(
                                        ctx.t(
                                            "commands:musica:play:loadTypes:searchResult.loadMusic",
                                            {
                                                emoji: this.client._emojis.certo,
                                                title: id.title.substring(0, 40),
                                                uri: id.uri
                                            }
                                        )
                                    )
                                ]
                            }
                        )
                        
                    })
                    
                    break
                    
                }

                case "TRACK_LOADED": {

                    await player.queue.add(result.tracks[0])

                    player.connect()

                    if(!player.current || !player.playing) await player.play()                
                    
                    ctx.message.reply(
                        {
                            embeds: [
                                new EmbedBuilder()
                                .setColor("#2a2d31")
                                .setDescription(
                                    ctx.t(
                                        "commands:musica:play:loadTypes.trackLoaded",
                                        {
                                            emoji: this.client._emojis.certo,
                                            title: result.tracks[0].title.substring(0, 40),
                                            uri: result.tracks[0].uri
                                        }
                                    )
                                )
                            ]
                        }
                    )

                    break
                }
            }
        }
    }
}