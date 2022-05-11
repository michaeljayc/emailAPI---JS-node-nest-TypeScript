export declare class AuthService {
    private connection;
    constructor(connection: any);
    getUserData(email: string): Promise<any>;
    ecnryptPassword(password: string): Promise<string>;
    comparePassword(newPassword: string, passwordHash: string): Promise<any>;
}
