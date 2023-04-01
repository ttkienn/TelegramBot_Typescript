import { HandleCommandArgs } from "../types"
export default {
    name: "help",
    description: "Danh sách các lệnh",
    /**
     * @param {any} ctx - Context of message
     * @param {any} args - Arguments of command
     * @param {any} utils - Utils
     */
    async execute({ ctx }: HandleCommandArgs) {
        const client = (global as any).client
        const commands = client.commands
        let message = "Danh sách lệnh:\n"
        commands.forEach((command: any): void => {
            message += `\n\`${client.config.PREFIX}${command.name}\` - ${command.description}`
        })
        ctx.reply(
            message,
            {
                reply_to_message_id: ctx.message.message_id,
                parse_mode: "Markdown"
            })
    }
}