import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, Validate, validate, ValidateNested, ValidationTypes } from "class-validator";
import { setDateTime } from "src/common/common.functions";

export class EmailReference {

    @IsNotEmpty()
    @IsString()
    email: String;

    @IsNotEmpty()
    @IsString()
    menu: Number;
}
export class NewMessageDTO {

    constructor() {
        this.uuid;
        this.message_origin_id = "";
        this.subject;
        this.message;
        this.sender;
        this.recipient;
        this.status = 0;
        this.created_date = setDateTime();
        this.updated_date = setDateTime();
    }

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=> EmailReference)
    sender: EmailReference;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=> EmailReference)
    recipient: EmailReference;
    
    @IsOptional()
    @IsString()
    uuid: string;

    @IsOptional()
    @IsString()
    message_origin_id: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsString()
    message: string;

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
