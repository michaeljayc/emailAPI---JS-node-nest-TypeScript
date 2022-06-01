import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsIn, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, Validate, validate, ValidateNested, ValidationTypes } from "class-validator";
import { setDateTime } from "src/common/common.functions";
import { MENU, STATE } from "./message.common";

export class EmailReference {

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsIn(Object.values(MENU))
    @IsOptional()
    @IsNumber()
    public menu: number;
}
export class NewMessageDTO {

    constructor() {
        this.id;
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
    public sender: EmailReference;

    @IsOptional()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=> EmailReference)
    public recipient: EmailReference;
    
    @IsOptional()
    @IsString()
    public id: string;

    @IsOptional()
    @IsString()
    public message_origin_id: string;

    @IsNotEmpty()
    @IsString()
    public subject: string;

    @IsString()
    public message: string;

    @IsOptional()
    //@IsIn(Object.values(STATE))
    @IsNumber()
    public status: number;

    @IsOptional()
    @IsString()
    public created_date: string;

    @IsOptional()
    @IsString()
    public updated_date: string;
}
