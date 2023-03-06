import chalk from "chalk";
import { Channel, ChannelType, EmbedBuilder, flatten, Message, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { Query } from "mongoose";
import { Player, Vulkava } from "vulkava"
import Guild from "../../database/models/Guild";
import SpotifyManager from "../../functions/spotify";
import Tom5 from "../Tom5";
import { stringify } from "flatted"

export enum PlayerStatus {
    Playing = 1,
    Paused = 2,
    Destroyed = 3
}

export default class MusicManager extends Vulkava {

    client: Tom5
    spotify: SpotifyManager;
    playersArray: Array<Player>

    constructor(client: Tom5, spotify: SpotifyManager) {
        super(
            {
                nodes: [
                    {
                        hostname: "localhost",
                        port: 8080,
                        id: "Verão",
                        maxRetryAttempts: 300,
                        password: "tomasfrazao2007",
                        region: "EU",
                        secure: false,
                        followRedirects: true,
                        resumeKey: "resuming",
                        resumeTimeout: 240_000
                    }
                ],

                sendWS(guildId, payload) {
                    
                    const guild = client.guilds.cache.get(guildId)

                    guild?.shard.send(payload)
                },
            }
        )
        this.client = client
        this.spotify = spotify
        this.playersArray = []
    }

    async init() {

        this.client.on("raw", (x) => {
            this.handleVoiceUpdate(x)
        })

        this.start(`${this.client.user?.id}`)

        let endQueue: NodeJS.Timeout | null;

        // this.on("nodeConnect", async (node) => {
        //     console.log(chalk.green("[LAVALINK - NODES]"), `- ${node.identifier} conectado`)

        //     // let guilds = await this.client.guildDB.find({ player: !null })

        //     // if(guilds.length > 0) {
        //     //     for(let i = 0; i < guilds.length; i++) {

        //     //         let guild = await this.client.guilds.fetch(guilds[i].guildId)

        //     //         let player = this.client.vulkava.createPlayer({
        //     //             guildId: guild.id,
        //     //             queue: guilds[i].player?.queue,
        //     //             selfDeaf: guilds[i].player?.selfDeaf,
        //     //             selfMute: guilds[i].player?.selfMute,
        //     //             textChannelId: guilds[i].player.textChannelId,
        //     //             voiceChannelId: guilds[i].player.voiceChannelId,
        //     //         })

        //     //         player.setTrackLoop(guilds[i].player.trackRepeat)
        //     //         player.setQueueLoop(guilds[i].player.queueRepeat)
        //     //         player.filters.set(guilds[i].player.filters.options)
        //     //         player.lastPlayerMessageId = guilds[i].player.lastPlayerMessageId
        //     //         player.node = guilds[i].player.node

        //     //         player.connect()

        //     //         player.play({
        //     //             startTime: guilds[i].player.position,
        //     //             pause: guilds[i].player.paused
        //     //         })
        //     //     }
        //     // }
        // })

        // this.on("nodeDisconnect", (node, code, reaosn) => {
        //     console.log(chalk.red.bold("[LAVALINK - NODES]"), `- ${node.identifier} desconectado.\n\nCódigo de erro: ${code}\n\nMotivo: ${reaosn}`)
        // })

        this.on("pong", (node) => {
            console.log(chalk.green("[LAVALINK]"), `- Pong recebido do node ${node.identifier}`)
        })

        // this.on("error", (node, error) => {
        //     console.log(chalk.red.bold("[LAVALINK - ERRO]"), `- ${node.identifier} não conectado.\n\nErro: ${error.message}`)
        // })

        this.on("warn", (node, warn) => {
            console.log(chalk.yellow.bold("[LAVALINK - AVISO]"), `- ${node.identifier} avisado.\n\nAviso: ${warn}`)
        })

        this.on("trackStart", async (player: Player, track) => {

            const playerChannel: Channel | any = this.client.channels.cache.get(player.textChannelId || "")

            var lastPlayerMessageId = await this.client.guildDB.findOne({ guildId: player.guildId }).then(x => x?.player?.lastPlayerMessageId)

            if(lastPlayerMessageId) {

                const msg: Message = playerChannel.messages.cache.get(lastPlayerMessageId)

                if(msg) msg.delete()
            }

            lastPlayerMessageId = await playerChannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#2a2d31")
                    .setDescription(`**(<:tom5_playing_now:1023251385019531275>) [${track.title.substring(0, 40)}](${track.uri}) começou a tocar.**`)
                ]
            }).then((msg: Message) => msg.id)

            await this.client.guildDB.findOneAndUpdate(
                { 
                    guildId: player.guildId 
                }, 
                { 
                    player: { 
                        lastPlayerMessageId: lastPlayerMessageId 
                    } 
                }
            )

            if(endQueue) clearTimeout(endQueue)

        })

        this.on("trackStuck", (player, track, thresholdMs) => {
            console.log(chalk.red("[LAVALINK]"), `- ${track.title} stuck. ${thresholdMs}`)
        })

        this.on("trackException", (player, track, exceptio) => {
            console.log(chalk.red("[LAVALINK]"), `- ${track.title} ${exceptio}`)
        })

        this.on("queueEnd", (player) => {

            let canal: Channel | any = this.client.guilds.cache.get(player.guildId)?.channels.cache.get(player.textChannelId || "")

            canal.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#2a2d31")
                    .setDescription(`**(${this.client._emojis.load}) Vou sair do canal se não me utilizarem após 2 minutos**`)
                ]
            })

            endQueue = setTimeout(() => {

                player.destroy()

                endQueue = null
            }, 2 * 60000)
        })

        this.on("playerCreate", async (player) => {

            const getCircularReplacer = () => {
                const seen = new WeakSet();
                return (key: any, value: any) => {
                    if (typeof value === 'object' && value !== null) {
                        if (seen.has(value)) {
                            return;
                        }
                        seen.add(value);
                    }
                    return value;
                };
            };

            await this.client.guildDB.findOneAndUpdate(
                {
                    guildId: player.guildId
                },
                {
                    $set: {
                        player: stringify(player, getCircularReplacer())
                    }
                }
            );           
        })
    }
}