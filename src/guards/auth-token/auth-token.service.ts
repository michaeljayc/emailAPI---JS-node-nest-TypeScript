import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthTokenService {

    constructor(private jwtService:JwtService){}

    async getContextData(data: any): Promise<any> {
        const cookie = await this.jwtService.verifyAsync(data);
        return !!cookie
    }
}


