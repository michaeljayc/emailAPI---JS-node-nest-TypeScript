import { Controller, Get, Query } from "@nestjs/common";
import User from "src/Entities/user.entity";
import { UserRole } from "src/Entities/user_role.entity";
import { UserRoleService } from "src/Services/user_role.service";

@Controller("api/user-roles")
export class UserRoleResolver {

    constructor(private userRoleService: UserRoleService){}

    @Get()
    async getUserRoles(): Promise<UserRole> {
        let response: UserRole = await this.userRoleService.getUserRoles()
            .then( result => {
                return result;
            })
            .catch( error => {
                return error;
            })

        return response;
    }

    // ==== TO DETERMINE ENDPOINT === 
    // @Get()
    // async getUserRoleById(@Query() query): Promise<void | UserRole> {
    //     let response =  await this.userRoleService.getUserRoleById(query.id)
    //         .then( result => {
    //             return result;
    //         })
    //         .catch( error => {
    //             console.log(error);
    //         })
        
    //     return response;
    // }

}