import chalk from "chalk";
import Event from "../../classes/event.js";
import Tom5 from "../../classes/Tom5.js";

export default class extends Event {

    client: Tom5

    constructor(client: Tom5) {
        super(
            {
                eventName: "ready",
                name: "loadPlayers",
                once: false
            }
        ),
        this.client = client
        this.execute = () => {
            console.log(chalk.bold.green("[CLIENT]"), '- Conectado')
        }
    }
}