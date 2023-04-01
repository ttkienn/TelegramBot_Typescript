import { HandleCommandArgs } from "../types";
export default {
    name: "example",
    description: "Mẫu lệnh cơ bản",
    /**
     * @param {any} ctx - Context of message
     * @param {any} args - Arguments of command
     * @param {any} utils - Utils
     */
    async execute({ ctx }: HandleCommandArgs) {
        ctx.reply("Hello World!", { reply_to_message_id: ctx.message.message_id });
    },
} as any;
