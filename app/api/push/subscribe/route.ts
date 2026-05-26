import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PushSubscriptionRepository } from "@/lib/repositories/push-subscription.repository";
import { ObjectId } from "mongodb";

const subscriptionRepo = new PushSubscriptionRepository();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await request.json();

    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 },
      );
    }

    // Get user ID from session (you'd need to fetch this from the database)
    // For now, this is a placeholder
    const userId = new ObjectId(); // Replace with actual user ID from DB

    const subscriptionId = await subscriptionRepo.saveSubscription(
      userId,
      subscription,
    );

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId,
      },
    });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save subscription",
      },
      { status: 400 },
    );
  }
}
