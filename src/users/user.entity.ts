export class User {

    id!: string;
    first_name!: string;
    last_name!: string;
    birthdate!: string;
    gender!: string;
    username!: string;
    email!: string;
    password?: string;
    created_date!: string;
    updated_date!: string;
    role_type_id!: number;

    constructor(
        id: string,
        first_name: string,
        last_name: string,
        birthdate: string,
        gender: string,
        username: string,
        email: string,
        password: string,
        created_date: string,
        updated_date: string,
        role: number,
    ){}
}

export default User;