import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/users/user.service";

@Injectable()
export class AuthTokenGuard implements CanActivate {

    constructor(
        @Inject(forwardRef( () => UserService))
        private userService: UserService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        console.log(params)
        return true;
    }

}