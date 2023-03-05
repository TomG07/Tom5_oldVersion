import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ComponentType, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuOptionBuilder } from "discord.js";
import { Track, UnresolvedTrack } from "vulkava";
import Command from "../../../classes/command";
import Tom5 from "../../../classes/Tom5";
import { CtxType } from "../../../types/context";

export default class extends Command {

    client: Tom5;

    constructor(client: Tom5) {
        super(
            {
                commandType: "slash",
                name: "play",
                description: "Play a music",
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: "track",
                        nameLocalizations: {
                            "pt-BR": "música"
                        },
                        description: "The track/playlist name/url",
                        descriptionLocalizations: {
                            "pt-BR": "O nome/url da música/playlist",
                        },
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    }
                ]
            },
        )
        this.client = client
        this.execute = async ( ctx: CtxType ) => {

            let defe = {
                canalVoz: this.client.guilds.cache.get(ctx.interaction.guild?.id.toString() || "")?.members.cache.get(ctx.interaction.user.id)?.voice.channel,
                canalTexto: ctx.interaction.channel,
                server: ctx.interaction.guild,
                musica: ctx.interaction.options.get("track", true).value
            }

            if(!defe.canalVoz) {
                return ctx.interaction.reply(
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
                
            const player = this.client.vulkava.createPlayer({
                guildId: defe.server?.id || "",
                voiceChannelId: defe.canalVoz.id,
                textChannelId: defe.canalTexto?.id,
                selfDeaf: true,
                selfMute: false
            })

            let result = await this.client.vulkava.search(defe.musica?.toString() || "")

            const tracksArray = new Array<Track | UnresolvedTrack>

            switch(result.loadType) {
                case "LOAD_FAILED": {

                    ctx.interaction.reply(
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

                    ctx.interaction.reply(
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

                        track.setRequester(ctx.interaction.user)

                        player.queue.add(track)
                    }
                    
                    player.connect()

                    if(!player.current || !player.playing) await player.play()

                    ctx.interaction.reply(
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

                    const msg = await ctx.interaction.reply(
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
                            filter: (u) => u.user.id === ctx.interaction.user.id,
                            time: 256000
                        }
                    ).on("collect", async(i) => {     
                        
                        if(!i.isStringSelectMenu()) return
                        
                        const tracksURIs = tracksArray.map(t => t.uri.substring(0, 99))

                        if(!tracksURIs.includes(i.values[0])) return

                        let id: Track | UnresolvedTrack = tracksArray.filter(track => track.uri.substring(0, 99) == i.values[0])[0]

                        await player.queue.add(id)

                        player.connect()

                        if(!player.current || !player.playing) await player.play()

                        i.reply(
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
                    
                    ctx.interaction.reply(
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