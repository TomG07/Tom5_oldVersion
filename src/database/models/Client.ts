import { model, Schema } from "mongoose";

const shema = new class ClientDB extends Schema {
    constructor() {
        super(
            {
                clientId: {
                    type: String,
                    default: null
                }
            }
        )
    }
}

export default model("clients", shema)