import chalk from "chalk"
import { ShardingManager } from "discord.js"
import botConfig from "../configs/token"

const manager = new ShardingManager('./src/launcher.js', {
    token: botConfig.token,
    totalShards: "auto"
})

manager.on("shardCreate", (shard) => {
    console.log(chalk.green.bold("[SHARDS MANAGER]"), `- Shard ${shard.id} iniciada`)
})

await manager.spawn()