import { UserRole } from "./user_role.entity";

export class User {

    id: number;
    first_name: string;
    last_name: string;
    birthdate: string;
    gender: string;
    email: string;
    password: string;
    created_date: string;
    updated_date: string;
    role: UserRole;

    constructor(
        id: number,
        first_name: string,
        last_name: string,
        birthdate: string,
        gender: string,
        email: string,
        password: string,
        created_date: Date,
        updated_date: Date,
        role: UserRole,
    ){}
}

export default User;