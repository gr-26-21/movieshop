import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

// Better auth uses prisma ORM to save and get information about users, sessions and authorizations
// replaced better auth admin-plugin with standardconfiguration -> to align better auths admin plugin to give functions for user management and rolebased permissions
// chose roles that the admin plugin will use whereas
// Users will be able to use standard movieshop functions
// Admins can use standard functions and admin functions

// https://better-auth.com/docs/plugins/admin#pass-roles-to-the-plugin