import { Message } from "discord.js";
import Command from "../../../classes/command.js";
import Tom5 from "../../../classes/Tom5.js";

export default class extends Command {

    client: Tom5;

    constructor(client: Tom5) {
        super(
            {
                name: "ping",
                description: "Comando de Ping - Teste",
                commandType: "prefix",
            },
            {
                botPermissions: [],
                devOnly: false,
                dmPermission: false,
                userPermissions: []
            }
        ),
        this.client = client
        this.execute = (message: Message, args: Array<String>) => {
            
            // const ping = this.client.ws.ping

            // message.reply(
            //     {
            //         content: `\`\`\`js\n${ping}\`\`\``
            //     }
            // )
            
        }
    }
}