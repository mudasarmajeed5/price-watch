"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile({ name, image }: { name: string, image?: File }) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    if (!name || name.trim() === "") {
      return { error: "Name is required" };
    }

    const db = client.db();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { email: session.user.email },
      { $set: { name: name.trim() } },
    );

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}
