import { Optional } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { setDateTime } from "src/common/common.functions";

export class NewMessageDTO {

    constructor() {
        this.id;
        this.created_date = setDateTime();
        this.updated_date = setDateTime();
    }
    
    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    created_date: string;

    @IsOptional()
    @IsString()
    updated_date: string;
}