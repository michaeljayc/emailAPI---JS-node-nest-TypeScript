import { JwtService } from "@nestjs/jwt";
export declare class AuthTokenService {
    private jwtService;
    constructor(jwtService: JwtService);
    getContextData(data: any): Promise<any>;
}
