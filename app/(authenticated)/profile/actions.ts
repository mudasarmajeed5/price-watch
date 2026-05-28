"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function updateProfile({
  name,
  image,
}: {
  name: string;
  image?: File;
}) {
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

export async function deleteAccount() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return { error: "Unauthorized" };
    }

    const db = client.db();
    const userId = new ObjectId(session.user.id);

    // Remove app-specific user data first.
    await Promise.all([
      db.collection("price_alerts").deleteMany({ userId }),
      db.collection("push_subscriptions").deleteMany({ userId }),
      db.collection("notification_queue").deleteMany({ userId }),
    ]);

    // Remove auth-related records managed by the Mongo adapter.
    await Promise.all([
      db.collection("accounts").deleteMany({ userId }),
      db.collection("sessions").deleteMany({ userId }),
      db.collection("users").deleteOne({ _id: userId }),
      db
        .collection("verificationTokens")
        .deleteMany({ identifier: session.user.email }),
    ]);

    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Delete account failed:", error);
    return { error: "Failed to delete account. Please try again." };
  }
}
