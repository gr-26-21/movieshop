import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Functions to fetch various statistics for the admin dashboard
export async function getTotalUsers() {
  try {
    const users = await auth.api.listUsers({
      query: { sortBy: "name" },
      headers: await headers(),
    });
    return users.total;
  } catch (error) {
    console.error("Failed to fetch users count:", error);
    return 0;
  }
}

// fetch total movies
export async function getTotalMovies() {
  try {
    return await prisma.movie.count({
      where: { deletedAt: null },
    });
  } catch (error) {
    console.error("Failed to fetch movies count:", error);
    return 0;
  }
}

// fetch total orders
export async function getTotalOrders() {
  try {
    return await prisma.order.count();
  } catch (error) {
    console.error("Failed to fetch orders count:", error);
    return 0;
  }
}

// fetch total revenue
export async function getTotalRevenue() {
  try {
    const result = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });
    return result._sum.totalAmount ?? 0;
  } catch (error) {
    console.error("Failed to fetch revenue:", error);
    return 0;
  }
}
