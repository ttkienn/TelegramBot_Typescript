import axios, { AxiosRequestConfig } from 'axios';
import { sendMessageSchema } from './types';

export const createUtils = async ({ ctx }: { ctx: any }) => {
    const request = async ({ url, method, data, responseType }: AxiosRequestConfig) => {
        const response = await axios({
            url,
            method,
            data,
            responseType
        });
        return response.data;
    }
    const sendImage = async ({ message, url }: { message?: string; url: string }) => {
        const response = await request({
            url,
            method: "GET",
            responseType: "stream"
        });
        message ? await ctx.replyWithPhoto({ source: response }, { reply_to_message_id: ctx.message.message_id, caption: message }) : await ctx.replyWithPhoto({ source: response }, {
            reply_to_message_id: ctx.message.message_id
        });
    }
    const reply = async ({ messages, images }: sendMessageSchema) => {
        let hasMessagesOrImages = false;
        if (messages) {
            hasMessagesOrImages = true;
            const messagesArray = Array.isArray(messages) ? messages : [messages];
            for (const message of messagesArray) {
                await ctx.reply(message, { reply_to_message_id: ctx.message.message_id });
            }
        }
        if (images) {
            hasMessagesOrImages = true;
            const imagesArray = Array.isArray(images) ? images : [images];
            for (const image of imagesArray) {
                await sendImage({ url: image });
            }
        }
        if (!hasMessagesOrImages) {
            await ctx.reply("Không có tin nhắn nào được gửi");
        }
    }
    return {
        request,
        sendImage,
        reply
    }
};