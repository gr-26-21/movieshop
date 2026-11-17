import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "admin") {
    redirect("/user");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      customerName: true,
      status: true,
      totalAmount: true,
    },
  });

  return (
    <section className="mx-auto max-w-6xl rounded-2xl border p-5">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableCaption>A list of orders</TableCaption>
            <TableHeader className="text-xl">
              <TableRow>
                <TableHead className="hidden sm:table-cell">Order Id</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>

                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-row items-center gap-1">
                      <span>{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>

                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.totalAmount} kr</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
