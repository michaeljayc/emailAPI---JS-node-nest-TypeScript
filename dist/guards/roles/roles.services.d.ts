import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";
export declare class RolesService {
    private userService;
    constructor(userService: UserService);
    getUserDataContext(data: any): Promise<User>;
}
