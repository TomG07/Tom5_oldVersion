import chalk from "chalk";
import Tom5 from "../Tom5.js";
import fs from "fs"

export default class EventsManager {

    client: Tom5

    constructor(client: Tom5) {
        this.client = client
    }

    async loadEvents():Promise<void> {  

        console.log(chalk.yellow("[LOAD]"), `- A caregar eventos`);

        const folders = fs.readdirSync(`./src/events`)

        folders.forEach(async (folder) => {
            const files = fs.readdirSync(`./src/events/${folder}`).filter(f => f.endsWith(`.ts`));

            files.forEach(async (file) => {

                const EventClass = (await import(`../../events/${folder}/${file}`)).default
                
                // console.log(await new EventClass().execute());

                const Event = new EventClass(this.client);

                if(Event.once) {
                    this.client.once(Event.eventName, async(...args) => Event.execute(...args))
                } else {
                    this.client.on(Event.eventName, async(...args) => Event.execute(...args))
                }
            });
        })

        console.log(chalk.green("[EVENTS]"), `- Carregados`);

    }
}