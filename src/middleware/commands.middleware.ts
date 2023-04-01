import * as fs from 'fs/promises';
import { HandleCommandArgs, Command } from "../types";
import path from "path"
class CommandLoader {
    private commands: Map<string, Command> = new Map();

    async loadCommands(): Promise<void> {
        try {
            const commandFiles = await fs.readdir(path.join(__dirname, "../commands"));
            console.log(`Đang tải ${commandFiles.length} lệnh...`);
            const commandPromises = commandFiles.map(async (file) => {
                const commandModule = await import(path.join(__dirname, `../commands/${file}`));
                const command = commandModule.default as Command;
                console.log(`Đã tải lệnh: ${command.name}`);
                return command;
            });
            const loadedCommands = await Promise.all(commandPromises);
            loadedCommands.forEach((command) => {
                global.client.commands.set(command.name.toLowerCase(), command);
                this.commands.set(command.name.toLowerCase(), command);
            });
        } catch (err) {
            console.log(err)
            console.error(`Lỗi khi tải lệnh: ${err}`);
        }
    }

    async handleCommand({ ctx, utils }: HandleCommandArgs): Promise<void> {
        try {
            const client = (global as any).client;
            if (!ctx.message.text.startsWith(client.config.PREFIX)) return;
            const args = ctx.message.text.split(/ +/);
            const commandName = args
                .shift()
                .toLowerCase()
                .slice(client.config.PREFIX.length);
            const command = this.commands.get(commandName);
            if (command) {
                console.log(`${ctx.from.username} đã sử dụng lệnh: ${command.name}`);
                await command.execute({ ctx, args, utils });
            } else {
                ctx.reply("Lệnh không tồn tại");
            }
        } catch (err) {
            ctx.reply(`Lỗi khi thực thi lệnh: ${err}`);
        }
    }
}

export default CommandLoader;
