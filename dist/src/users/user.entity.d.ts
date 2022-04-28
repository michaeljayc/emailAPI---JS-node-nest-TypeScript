export declare class User {
    id: number;
    first_name: string;
    last_name: string;
    birthdate: string;
    gender: string;
    email: string;
    password?: string;
    created_date: string;
    updated_date: string;
    role_type_id: number;
    constructor(id: number, first_name: string, last_name: string, birthdate: string, gender: string, email: string, password: string, created_date: string, updated_date: string, role: number);
}
export default User;
