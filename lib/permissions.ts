import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

// CreateAccessControl is used to create a system with permissions
// In this case about what roles are gonna be able to do with "default" permissions and the adminAc roles built in permissions
// To give the admin role the right permissions

const statement = {
  ...defaultStatements,
  adminPage: ["view", "use"],
} as const;

export const ac = createAccessControl(statement);

// USER
export const user = ac.newRole({});

// ADMIN
export const admin = ac.newRole({
  ...adminAc.statements,
  adminPage: ["view", "use"],
});

// https://better-auth.com/docs/plugins/admin at custom permissions for more info about permissions