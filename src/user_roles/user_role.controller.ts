import { Controller, Get, Query } from "@nestjs/common";
import { User } from "../users/user.entity";
import { UserRole } from "src/user_roles/user_role.entity";
import { UserRoleService } from "../user_roles/user_role.service";

@Controller("user-roles")
export class UserRoleController {

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