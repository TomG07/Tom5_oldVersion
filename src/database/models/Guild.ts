import { model, Schema } from "mongoose";

const shema = new Schema({
        guildId: {
            type: String,
            default: null
        },
        language: {
            type: Number,
            default: 1
        },
        player: {
            lastPlayerMessageId: {
                type: String,
                default: null
            }
        }
    }
)

export default model("guilds", shema)