import { model, Schema } from "mongoose";

const shema = new Schema(
    {
        _id: {
            type: String,
            default: null
        }
    }
)

export default model("users", shema)