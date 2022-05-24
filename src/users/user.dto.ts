import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserLoginDTO {

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class UserRegisterDTO {

    @IsOptional()
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

    @IsNumber()
    @IsNotEmpty()
    role_type_id: number


    @IsString()
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