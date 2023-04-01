export type sendMessageSchema = {
    messages?: string | string[];
    images?: string | string[];
    replyToMessageId?: number;
    replyMarkup?: any;
}
export interface HandleCommandArgs {
    ctx: any;
    utils: any;
}

export interface Command {
    name: string;
    description: string;
    execute({ ctx, args, utils }: { ctx: any; args: any[], utils: any }): Promise<void>;
}
