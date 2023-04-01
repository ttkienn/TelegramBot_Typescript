import { Telegraf } from "telegraf";
import { Context } from "telegraf/typings/context";
import { Update } from "telegraf/typings/core/types/typegram";
import { createUtils } from "./utils";
import config from "./setup/config";
import Commands from "./middleware/commands.middleware";
import chalk from "chalk";
declare global {
    var client: {
        commands: Map<string, any>,
        config: object,
        bot: Telegraf<Context>,
        utils: any
    }
}
class Bot {
    private readonly bot: Telegraf<Context>;
    private readonly commands: Commands;
    private regisCommands: any[] = []
    constructor() {
        this.bot = new Telegraf(config.TOKEN_BOT);
        this.commands = new Commands();
        global.client = {
            commands: new Map(),
            config,
            bot: this.bot,
        } as any;
    }

    async start(): Promise<void> {
        await this.commands.loadCommands();
        this.bot.on("text", async (ctx: Context<Update>) => {
            const utils = await createUtils({ ctx })
            await this.commands.handleCommand({ ctx, utils });
        });
        this.bot.launch();
        this.bot.catch((err) => {
            console.error(`Lỗi khi chạy bot: ${err}`);
        });
        this.bot.telegram.getMe().then((botInfo) => {
            console.table({
                "Tên bot": botInfo.first_name,
                "Username": botInfo.username,
                "ID": botInfo.id,
                "Link": `https://t.me/${botInfo.username}`,
                "Trạng thái": 'Đang hoạt động',
                "Author": "https://facebook.com/ThieuTrungKi3n"
            })
        })
        for (const [name, command] of global.client.commands) {
            this.regisCommands.push({
                command: name,
                description: command.description
            })
        }
        this.bot.telegram.setMyCommands(this.regisCommands)
    }
}

const bot = new Bot();
bot.start()