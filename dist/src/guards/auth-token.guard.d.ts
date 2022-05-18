import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/users/user.service";
export declare class AuthTokenGuard implements CanActivate {
    private userService;
    constructor(userService: UserService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
