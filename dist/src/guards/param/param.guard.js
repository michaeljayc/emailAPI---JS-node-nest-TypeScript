"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamGuard = void 0;
const user_dto_1 = require("../../users/user.dto");
class ParamGuard {
    canActivate(context) {
        const login_data = context.getArgs()[0].body;
        const default_value = new user_dto_1.UserLoginDTO();
        const params = (Object.assign(Object.assign({}, default_value), login_data));
        console.log(default_value);
        return;
    }
}
exports.ParamGuard = ParamGuard;
//# sourceMappingURL=param.guard.js.map