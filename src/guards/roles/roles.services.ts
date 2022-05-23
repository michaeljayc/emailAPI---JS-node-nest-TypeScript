import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";

@Injectable()
export class RolesService {

    constructor(private userService: UserService){}

    async getUserDataContext(data: any): Promise<User> {
        let user = await 
          this
          .userService
          .getUserByEmail(data.email);
    
        if (Object.keys(user._responses).length !== 0) 
          return user.next()._settledValue
        
        
    }
    
}