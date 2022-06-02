"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGuard = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = "roles";
const RoleGuard = (role) => (0, common_1.SetMetadata)(exports.ROLES_KEY, role);
exports.RoleGuard = RoleGuard;
//# sourceMappingURL=role.decorator.js.map