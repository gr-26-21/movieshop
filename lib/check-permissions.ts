import { auth } from "./auth";

export async function canAccessAdmin(userId: string) {
  const result = await auth.api.userHasPermission({
    body: {
      userId,
      permissions: {
        adminPage: ["view"],
      },
    },
  });

  return result.success;
}

// The function takes a userId 
// information is saved in result
// Better Auths server function controls a users permissions.
// Send ID to canAccessAdmin to ask if user has access to adminPage: ["view"]. If no access, send them to "/"
// return true or false

// https://better-auth.com/docs/plugins/admin#access-control-usage
// Describes how to check if a user has the required permissions to access the admin page.