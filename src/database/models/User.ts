import { model, Schema } from "mongoose";

const shema = new class UserDB extends Schema {
    constructor() {
        super(
            {
                userId: {
                    type: String,
                    default: null
                }
            }
        )
    }
}

export default model("users", shema)