import { AttachmentBuilder, Message } from "discord.js";
import Command from "../../../classes/command.js";
import Tom5 from "../../../classes/Tom5.js";
import { createCanvas, loadImage, registerFont } from "canvas"
import { CtxType } from "../../../types/context.js";

registerFont(`src/assets/fonts/MontSerrat/Montserrat-Black.ttf`, { family: "Montserrat" })

export default class extends Command {

    client: Tom5;
    addBreaks: (string: string, max: number) => string;

    constructor(client: Tom5) {
        super(
            {
                commandType: "prefix",
                description: "Teste canvas",
                name: "testecanvas",
                aliases: ["perfil", "canvas"]
            },
        )
        this.client = client
        this.execute = async( ctx: CtxType ) => {
            
            const canvas = createCanvas(700, 500)
            const context = canvas.getContext("2d")
            
            const background = await loadImage('src/assets/images/profile_card2.png')
            const avatar = await loadImage(ctx.message.author.displayAvatarURL({ extension: "png", size: 4096 }))

            context.drawImage(background, 0, 0, 700, 500)

            // Username
            context.textAlign = "left"
            context.font = '45px "sans"'
            context.fillStyle = "#fff"
            context.fillText(ctx.message.author.username.length > 30 ? ctx.message.author.username.slice(0, 20) + "..." : ctx.message.author.username, 240, 225)

            //Moedas
            context.textAlign = "left"
            context.font = '30px "sans"'
            context.fillStyle = "#fff"
            context.fillText('TCoins: 0', 50, 300)

            //XP
            context.textAlign = "left"
            context.font = '30px "sans"'
            context.fillStyle = "#fff"
            context.fillText('XP: 0', 50, 300 + 35)

            //About Me
            context.textAlign = "left"
            context.font = '30px "sans bold"'
            context.fillStyle = "#fff"
            context.fillText("Sobre Mim", 240, 300, 410)
            context.fillStyle = "#8b8b8b"
            context.font = '20px "sans"'
            context.fillText(this.addBreaks("SLALSLALSLALSLA tetste ete ds et sdet vdfffvdf bsfdb dsb sdfb dsbn", 150), 240, 300 + 10)

            //User Avatar
            context.arc(137, 165, 87, 0, Math.PI * 2)
            context.lineWidth = 1
            context.strokeStyle = "#242424"
            context.stroke()
            context.closePath()
            context.clip()
            context.drawImage(avatar, 50, 76, 175, 175)

            context.quality = "bilinear"

            ctx.message.reply(
                {
                    files: [
                        new AttachmentBuilder(canvas.toBuffer())
                        .setName(`${ctx.message.author.username}ProfileCard.png`)
                        .setFile(canvas.toBuffer())
                    ]
                }
            )
            
        }
        this.addBreaks = (string: string, max: number) => {

            max = max + 1

            for(let i = 0; i < (string.length / max); i++) {

                string = string.substring(0, max * i) + `\n` + string.substring(max * i, string.length)

            }

            console.log(string);

            return string
        }
    }
}