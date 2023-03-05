import { ActivityType, Client, GatewayIntentBits, Message } from 'discord.js'
import botConfig from '../configs/token.js'
import SpotifyManager from '../functions/spotify.js'
import CommandsManager from './managers/commandsManager'
import DatabaseManager from './managers/databaseManager.js'
import EmojisManager from './managers/emojisManager'
import EventsManager from "./managers/eventsManager"
import MusicManager from './managers/musicManager.js'
import UserDB from "../database/models/User";
import GuildDB from "../database/models/Guild";
import ClientDB from "../database/models/Client";
import i18next, { i18n } from 'i18next'
import LocalesManager from './managers/localesManager.js'

export default class Tom5 extends Client {

    public prefix: String
    public events: EventsManager
    public commands: CommandsManager 
    public vulkava: MusicManager
    public _emojis!: { 
        certo: string; 
        errado: string; 
        load: string 
    }
    public devs: string[]
    public database: DatabaseManager
    public userDB!: typeof UserDB
    public guildDB!: typeof GuildDB;
    public clientDB!: typeof ClientDB;
    public i18next: i18n
    public locales: LocalesManager

    constructor() {
        super({
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
            ],
            presence: {
                status: "online",
                activities: [
                    {
                        name: "🧪 t.play",
                        type: ActivityType.Playing,
                    }
                ],
            },
            shards: "auto"
        })
        this.devs = ["541030181616222218"]
        this.prefix = "t."
        this.commands = new CommandsManager(this)
        this.events = new EventsManager(this)
        this.vulkava = new MusicManager(this, new SpotifyManager(this))
        this.database = new DatabaseManager(this)
        this.userDB = UserDB
        this.guildDB = GuildDB
        this.clientDB = ClientDB
        this.i18next = i18next
        this.locales = new LocalesManager(this)
    }

    async start(): Promise<void> {

        await super.login(process.env.DISCORD_TOKEN || botConfig.token)

        await this.commands.loadCommands()
        await this.events.loadEvents()
        await this.vulkava.init()
        await new EmojisManager(this).loadEmojis();
        await this.database.start()
        await this.locales.loadLocales()
        
    }
}