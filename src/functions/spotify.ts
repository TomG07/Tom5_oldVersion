import fetch from "node-fetch"
import Tom5 from "../classes/Tom5"

export type Géneros = "Top Lists" | "Pop" | "Hip-Hop" | "Chill" | "At Home" | "Brazilian music" | "Mood" | "Latin" | "Indie" | "Dance/Electronic" |"Decades" |"Funk"

export default class SpotifyManager {
    
    client?: Tom5
    clientId: string
    clientSecret: string

    constructor(client?: Tom5) {
        this.client = client
        this.clientId = "12d50311638d45a8921a9f340b1fdee9"
        this.clientSecret = "66e2802bf29944218d91ac46ecae18f3"
    }

    async getToken() {

        const result = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(this.clientId + ":" + this.clientSecret)
                },
                body: 'grant_type=client_credentials'
            }
        )
    
        const data: any = await result.json()
    
        return data.access_token
    
    }

    async getGenero(token: String) {

        const reuslt = await fetch(
            'https://api.spotify.com/v1/browse/categories',
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )

        const data: any = await reuslt.json()
        
        
        return data.categories.items

    }

    async getPlaylistByGenero(token: String, genero: Géneros) {

        const generos = await fetch(
            'https://api.spotify.com/v1/browse/categories',
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )

        let dataGeneros: any = await generos.json()

        dataGeneros = dataGeneros.categories.items

        const generoId = dataGeneros.filter((g: any) => g.name == genero)[0].id

        const result = await fetch(
            `https://api.spotify.com/v1/browse/categories/${generoId}/playlists?limit=1`,
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )

        const data: any = await result.json()


        return data.playlists.items
    }

    async getTracks(token: String, tracksEndPoint: String) {

        const result = await fetch(
            `${tracksEndPoint}?limit=5`,
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )

        const data: any = await result.json()

        return data
    }

    async search(token: String, title: String) {

        const result = await fetch(
            `https://api.spotify.com/v1/search?q=${title}&type=track&limit=1`,
            {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    "Content-Type": 'application/json'
                }
            }
        )

        const data: any = await result.json().catch((err) => err)

        return data?.tracks?.items
    }
}