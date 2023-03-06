import Command from "../../../classes/command";
import Tom5 from "../../../classes/Tom5";
import { CtxType } from "../../../types/context";

export default class extends Command {

    client: Tom5;

    constructor(client: Tom5) {
        super(
            {
                name: "addbot",
                description: "Add o bot",
                aliases: ["ab"],
                commandType: "prefix"                
            }
        )
        this.client = client
        this.execute =  async ( ctx: CtxType ) => {
            
            const botListDB = await this.client.botlist.findOne(
                {
                    _id: ctx.message.guild?.id
                }
            )

            console.log(botListDB)
        }
    }
    
}