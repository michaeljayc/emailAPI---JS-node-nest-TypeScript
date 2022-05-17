import AuthService from './auth/auth.service';
import { TLoginCredentials } from './users/user.types';
export declare class AppController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, credentials: TLoginCredentials): Promise<any>;
}
