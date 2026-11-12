import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th scope="col" className="p-3">
                  Order
                </th>
                <th scope="col" className="p-3">
                  Date
                </th>
                <th scope="col" className="p-3">
                  Customer
                </th>
                <th scope="col" className="p-3">
                  Status
                </th>
                <th scope="col" className="p-3 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">
                    {order.createdAt.toLocaleDateString("sv-SE")}
                  </td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {order.totalAmount} kr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
