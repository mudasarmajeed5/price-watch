import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PushSubscriptionRepository } from "@/lib/repositories/push-subscription.repository";
import { ObjectId } from "mongodb";
import { UserRepository } from "@/lib/repositories/user.repository";

const subscriptionRepo = new PushSubscriptionRepository();
const userRepo = new UserRepository();

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

    let userId: ObjectId | null = null;

    if (session.user?.id && ObjectId.isValid(session.user.id)) {
      userId = new ObjectId(session.user.id);
    } else if (session.user?.email) {
      const user = await userRepo.findByEmail(session.user.email);
      if (user?._id) {
        userId = user._id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unable to resolve user account" },
        { status: 400 },
      );
    }

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
