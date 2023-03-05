import Tom5 from "../Tom5";
import i18next from "i18next"
import i18nbackend from "i18next-fs-backend"
import fs from "fs"
import chalk from "chalk";

export enum Languages {
    pt_BR = 1,
    en_US = 2,
    fr = 3,
    es_ES = 4
}

export default class LocalesManager {

    client: Tom5

    constructor(client: Tom5) {
        this.client = client
    }

    async loadLocales() {

        console.log(chalk.yellow("[LOAD]"), `- A carregar locales`)

        await this.client.i18next
        .use(i18nbackend)
        .init(
            {
                ns: ['commands', 'events'],
                defaultNS: 'commands',
                preload: fs.readdirSync('src/languages'),
                fallbackLng: 'en-US',
                backend: {
                    loadPath: 'src/languages/{{lng}}/{{ns}}.json'
                },
                load: 'all',
                interpolation: {
                    escapeValue: false,
                    useRawValueToEscape: true
                },
                returnEmptyString: false,
                returnObjects: true
            }
        )

        console.log(chalk.green("[LOCALES]"), `- Carregados`)
    }
}