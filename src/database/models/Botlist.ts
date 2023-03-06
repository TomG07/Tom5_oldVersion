import { model, Schema } from "mongoose"

const schema = new Schema(
    {
        _id: {
            type: String,
            default: null
        },
        configs: {

        },
        bots: {
            type: Array,
            default: [] || null
        },
        users: {
            type: Array,
            default: [] || null
        }
    }
)

export default model("botlists", schema)