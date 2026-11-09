import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, user } from "./permissions";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

// get the information from the logged in user 
// Instead of standard settings, the admin client plugin will use the customed ac (Access Control) system
// Where roles will register the admin and the user 
// which will  let the client use same permission definitions as the server

// https://better-auth.com/docs/plugins/admin#pass-roles-to-the-plugin