import chalk from "chalk"
import mongoose, { Model } from "mongoose"
import Tom5 from "../Tom5";

export default class DatabaseManager {

    client: Tom5;

    constructor(client: Tom5) {
        this.client = client
    }

    async start() {

        mongoose.Promise = global.Promise

        mongoose.set('strictQuery', true);

        try {

            await mongoose.connect(process.env.DB_TOKEN || "", {
                dbName: "Tom5",
            })

            import("../../database/allModels")

            console.log(chalk.green("[DATABASE]"), `- Conectada`)

        } catch (err) {

            console.log(chalk.red.bold("[DATABASE]"), `- Erro ao conectar | Erro: ${err}`)
        }
    }
}