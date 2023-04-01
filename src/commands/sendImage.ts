import { HandleCommandArgs } from "../types";
export default {
    name: "images",
    description: "Send image",
    /**
     * @param {HandleCommandArgs} args
     * @param {any} args.ctx - Context of message
     * @param {any} args.utils - Utils
     */
    async execute({ ctx, utils }: HandleCommandArgs) {
        var options = [
            {
                "text": "Anime",
                "callback_data": "anime"
            },
            {
                "text": "NSFW",
                "callback_data": "nsfw"
            }
        ]
        ctx.reply(`Chọn loại ảnh:`, {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    options
                ]
            }
        });
        (global as any).client.bot.on("callback_query", async (ctx: any) => {
            const data = ctx.update.callback_query.data;
            console.log(ctx)
            var url = "https://thieutrungkien.dev/image" as string
            data === "anime" ? url += "/anime" : url += "/nsfw"
            console.log(url)
            const stream = await utils.request({
                url,
                method: "GET",
                responseType: "stream"
            }) as any;
            ctx.sendChatAction("upload_photo");
            ctx.telegram.sendPhoto(ctx.chat.id, { source: stream }, {
                reply_to_message_id: ctx.update.callback_query.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        options
                    ]
                }
            })
        })
    }
} as any;
