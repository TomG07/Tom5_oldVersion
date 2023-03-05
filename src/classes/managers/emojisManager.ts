import { Collection } from "discord.js";
import Tom5 from "../Tom5";

export default class EmojisManager {

    client: Tom5;

    constructor(client: Tom5) {
        this.client = client
    }

    async loadEmojis(): Promise<void> {

        this.client._emojis = {
            "certo": "<:tom5_icons_Correct:1013543813647704105>",
            "errado": "<:tom5_icons_Wrong:1013544051611533373>",
            "load": "<a:load:1036030535060967476>"
        }
    }
}