import Tom5 from "./classes/Tom5";
import Log from "./others/log";
import * as dotenv from "dotenv"
dotenv.config()

await new Tom5().start()

process.on('unhandledRejection', (reason, p) => {
    new Log({
        content: "Script rejeitado",
        tag: "anticrash",
        type: "error",
        aditionals: reason
    })
});

process.on("uncaughtException", (err, origin) => {
    new Log({
        content: "Erro Capturado",
        tag: "anticrash",
        type: "error",
        aditionals: `Erro:\n${err}\n\nStack:\n${err.stack}`
    })
})

process.on('uncaughtExceptionMonitor', (err, origin) => {
    new Log({
        content: "Bloquado",
        tag: "anticrash",
        type: "error",
        aditionals: `Erro:\n${err}\n\nStack:\n${err.stack}`
    })
});

// const spotify = new SpotifyManager()

// const token = await spotify.getToken()

// const generos = await spotify.getGenero(token)

// const playlistByGeneros = await spotify.getPlaylistByGenero(token, "Pop")

// // const playlistsTracks = await spotify.getTracks(token, "https://open.spotify.com/playlist/6XMN5en27MDNFigJgrU3o1")

// const searchResult = await spotify.search(token, "Teste Bass JBL")