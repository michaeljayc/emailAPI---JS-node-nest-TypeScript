import { Controller, Get, Query } from "@nestjs/common";
import { ResponseFormat } from "src/common/common";
import Message from "./message.entity";
import MessageService from "./message.service";

@Controller("messages")
export class MessageController {

    constructor(private readonly messageService: MessageService){}

    @Get()
    async getMessages(@Query('menu') menu:string): Promise<ResponseFormat> {
        console.log(menu);
        return
    }
}

export default MessageController;