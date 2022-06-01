import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { setDateTime } from "src/common/common.functions";
import { USER_ROLES } from "./user.common";

export class UserLoginDTO {

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class UserDTO {

    constructor() {
        this.id;
        this.username;
        this.first_name;
        this.last_name;
        this.gender;
        this.birthdate;
        this.role_type_id;
        this.email;
        this.password;
        this.created_date = setDateTime();
        this.updated_date = setDateTime();
    }

    @IsOptional()
    @IsString()
    id: string
    
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    gender: string

    @IsString()
    @IsNotEmpty()
    birthdate: string

    @IsIn(USER_ROLES)
    @IsNumber()
    @IsNotEmpty()
    role_type_id: number


    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    created_date: string

    @IsString()
    @IsOptional()    
    updated_date: string

}