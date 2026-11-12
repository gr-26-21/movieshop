import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, ShoppingCart, Users, Wallet } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/check-permissions";
import {
  getTotalUsers,
  getTotalMovies,
  getTotalOrders,
  getTotalRevenue,
} from "@/app/admin/_components/stats";

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

  const [totalUsers, totalMovies, totalOrders, totalRevenue] =
    await Promise.all([
      getTotalUsers(),
      getTotalMovies(),
      getTotalOrders(),
      getTotalRevenue(),
    ]);

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
            <p className="text-center text-3xl">{totalUsers}</p>
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
            <p className="text-center text-3xl">{totalMovies}</p>
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
            <p className="text-center text-3xl">{totalOrders}</p>
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
            <p className="text-center text-3xl">{totalRevenue} SEK</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
