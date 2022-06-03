"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = __importDefault(require("./auth/auth.service"));
const common_functions_1 = require("./common/common.functions");
const logger_service_1 = __importDefault(require("./services/logger.service"));
const user_entity_1 = __importDefault(require("./users/user.entity"));
const user_dto_1 = require("./users/user.dto");
const database_service_1 = require("./database/database.service");
let AppController = class AppController {
    constructor(authService, loggerService, jwtService, databaseService) {
        this.authService = authService;
        this.loggerService = loggerService;
        this.jwtService = jwtService;
        this.databaseService = databaseService;
    }
    async onModuleInit() {
        console.log("initializing");
        await this.databaseService.createDatabase("emailAPI");
        await this.databaseService.createTable("emailAPI", ["users", "user_roles", "messages", "logs"]);
        const roles = [
            {
                "id": "0508ae7d-a806-4810-a115-06d99a890a6d",
                "user_role_type": "Normal User",
                "user_role_type_id": 2
            },
            {
                "id": "34cb38ee-ef5b-480d-b58b-639f3034d3f5",
                "user_role_type": "Super Admin",
                "user_role_type_id": 1
            }
        ];
        await this.databaseService.insertRecord("emailAPI", "user_roles", roles);
        const super_admin = {
            "birthdate": "1995-07-30",
            "created_date": (0, common_functions_1.setDateTime)(),
            "email": "michaeljayfox@gmail.com",
            "gender": "Male",
            "last_name": "Fox",
            "password": "Password123!",
            "role_type_id": 1,
            "updated_date": (0, common_functions_1.setDateTime)(),
            "username": "michaeljayfox"
        };
        await this.databaseService.insertRecord("emailAPI", "users", super_admin);
    }
    async registerUser(user) {
        let formatted_response;
        let user_register_dto = new user_dto_1.UserDTO();
        const default_value = ({
            ...user_register_dto,
            ...user
        });
        try {
            default_value.password = await this
                .authService
                .ecnryptPassword(default_value.password);
            await this
                .authService
                .register(default_value)
                .then(result => {
                formatted_response = (0, common_functions_1.formatResponse)([default_value], true, "Registration Successful");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Registration Failed");
            throw new Error(error);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("registerUser", default_value, formatted_response));
        return formatted_response;
    }
    async loginUser(request, credentials, response) {
        let formatted_response;
        if (Object.keys(credentials).length < 1)
            throw new common_1.BadRequestException("Input email and password", response.statusMessage);
        try {
            if (request.cookies["jwt"])
                return (0, common_functions_1.formatResponse)(null, true, 'You are currently logged in.');
            let user_data;
            let response_data = await this
                .authService
                .login(credentials.email);
            if (response_data.length === 0)
                throw new common_1.NotFoundException(`User ${credentials.email} doesn't exist`);
            user_data = response_data[0];
            if (!await this.authService.comparePassword(credentials.password, user_data.password))
                throw new common_1.BadRequestException("Incorrect password.");
            console.log(user_data);
            const jwt = await this.jwtService.signAsync({
                id: user_data.id,
                username: user_data.username,
                email: user_data.email
            });
            response.cookie("jwt", jwt, { httpOnly: true });
            formatted_response = (0, common_functions_1.formatResponse)([user_data], true, "Login Successful.");
        }
        catch (error) {
            console.log(error);
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Login Failed.");
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("loginUser", credentials, formatted_response));
        return formatted_response;
    }
    async logoutUser(request, response) {
        let formatted_response;
        try {
            if (!request.cookies["jwt"])
                formatted_response = (0, common_functions_1.formatResponse)(null, false, "You are currently logged out.");
            else {
                response.clearCookie("jwt");
                formatted_response = (0, common_functions_1.formatResponse)([], true, "Logout successful.");
            }
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed.");
        }
        return formatted_response;
    }
};
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.default]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UserLoginDTO, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logoutUser", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.default,
        logger_service_1.default,
        jwt_1.JwtService,
        database_service_1.DatabaseService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map