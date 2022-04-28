// import { forwardRef, Inject, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { Observable, from, of } from "rxjs";
// import { User } from "src/Entities/user.entity";
// import { loginCredentials } from "src/common/common";
// import { UserService } from "src/Services/user.service";
// import rethink from "rethinkdb";
// const bcrypt = require('bcrypt');

// @Injectable()
// export class AuthService {

//     private connection: rethink.Connection;

//     constructor(@Inject("RethinkProvider") connection,
//         @Inject(forwardRef( () => UserService))
//         private userService: UserService){
//             this.connection = connection;
//         }

//     async validateUser(credentials: loginCredentials ): Promise<any> {
//         const user = await this.userService.getUserByEmail(credentials.email)
//         console.log(user);
//         return;
//     }

//     // generateJWT(user: User): Observable <string> {
//     //     return from(this.jwtService.signAsync({user}));
//     // }

//     // hashPassword(password: string): Observable<string> {
//     //     return from<string>(bcrypt.hash(password,12));
//     // }

//     // comparePassword(newPassword: string, passwordHash: string): Observable<any>{
//     //     return from(bcrypt.compare(newPassword,passwordHash));
//     // }
// }

// export default AuthService;
