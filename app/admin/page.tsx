import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, ShoppingCart, Users, Wallet } from "lucide-react";
import UserCounter from "./_components/user-counter";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/check-permissions";



export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const allowed = await canAccessAdmin(session.user.id);

  if (!allowed) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
        {/* total no. of users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Users />
              <Badge variant="secondary" className="px-6 py-5 text-xl">
                Total Users
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl">
              <UserCounter />
            </p>
          </CardContent>
        </Card>
        {/* total no. of movies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Film />
              <Badge variant="secondary" className="px-6 py-5 text-xl">
                Total Movies
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl">500</p>
          </CardContent>
        </Card>
        {/* total no. of orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <ShoppingCart />
              <Badge variant="secondary" className="px-6 py-5 text-xl">
                Total Orders
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl">999</p>
          </CardContent>
        </Card>

        {/* total revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Wallet />
              <Badge variant="secondary" className="px-6 py-5 text-xl">
                Total Revenue
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-3xl">5000 SEK</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
