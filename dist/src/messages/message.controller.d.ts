import { ResponseFormat } from "src/common/common";
import MessageService from "./message.service";
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    getMessages(menu: string): Promise<ResponseFormat>;
}
export default MessageController;
