"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkoutSchema } from "@/lib/schemas/checkout.schema";

const profileSchema = checkoutSchema.omit({ email: true });

export async function updateProfile(
  _previousState: { success: boolean; message: string },
  formData: FormData
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      message: "Please sign in to update your details.",
    };
  }

  const result = profileSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    postcode: formData.get("postcode"),
    city: formData.get("city"),
  });

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  const { name, address, postcode, city } = result.data;
  const deliveryAddress = { name, street: address, postalCode: postcode, city };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        address: {
          upsert: { create: deliveryAddress, update: deliveryAddress },
        },
      },
    });
  } catch (error) {
    console.error("Failed to update customer profile:", error);
    return {
      success: false,
      message: "Could not save your details. Please try again.",
    };
  }

  revalidatePath("/user");
  return { success: true, message: "Your details have been saved." };
}
