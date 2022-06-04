import { setDateTime } from "./common/common.functions";
const {DB,TABLES} = process.env;

export const initial_values = {

    db: DB ?? "emailAPI",
    tables: TABLES ? TABLES.split(" "): [],
    roles: [
        {
            "id": "0508ae7d-a806-4810-a115-06d99a890a6d",
            "user_role_type": "Normal User" ,
            "user_role_type_id": 2
        },
        {
            "id": "34cb38ee-ef5b-480d-b58b-639f3034d3f5",
            "user_role_type": "Super Admin" ,
            "user_role_type_id": 1
        }
    ],
    users: {
        super_admin: {
            "id": "425f0e72-3701-4e47-b86a-aa0e77ba0229",
            "birthdate": "1995-07-30" ,
            "created_date": setDateTime(),
            "email": "michaeljayfox@gmail.com",
            "gender": "Male" ,
            "last_name": "Fox" ,
            "password": "$2b$10$kdKXxN1c.yNScFGlRGdgX.aock4O3QK.KgCGRt3ljquPzxmhhD.oq",
            "role_type_id": 1 ,
            "updated_date": setDateTime(),
            "username": "michaeljayfox"
        }
    
    }
}
