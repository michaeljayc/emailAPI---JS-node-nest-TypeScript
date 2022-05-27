import { Optional } from "@nestjs/common";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { setDateTime } from "src/common/common.functions";

export class NewMessageDTO {

    constructor() {
        this.id;
        this.message_origin_id = "";
        this.subject;
        this.message;
        this.recipient;
        this.sender;
        this.status = 0;
        this.read = false;
        this.drafted = false;
        this.created_date = setDateTime();
        this.updated_date = setDateTime();
    }
    
    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    message_origin_id: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    recipient: string;

    @IsNotEmpty()
    @IsString()
    sender: string;
    
    @IsNotEmpty()
    @IsBoolean()
    read: boolean;

    @IsNotEmpty()
    @IsBoolean()
    drafted: boolean;

    @IsNotEmpty()
    @IsNumber()
    status: number;

    @IsOptional()
    @IsString()
    created_date: string;

    @IsOptional()
    @IsString()
    updated_date: string;
}