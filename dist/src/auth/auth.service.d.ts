import * as common from "src/common/common";
export declare class AuthService {
    private connection;
    constructor(connection: any);
    getUserData(credentials: common.loginCredentials): Promise<any>;
    ecnryptPassword(password: string): Promise<string>;
    comparePassword(newPassword: string, passwordHash: string): Promise<any>;
}
