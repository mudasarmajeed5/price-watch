import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { WatchlistService } from "@/lib/services/watchlist.service";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

const watchlistService = new WatchlistService();

async function getUserIdFromEmail(email: string): Promise<ObjectId> {
  const db = getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user._id;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, targetPrice } = await request.json();

    if (!url || !targetPrice) {
      return NextResponse.json(
        { error: "URL and targetPrice are required" },
        { status: 400 },
      );
    }

    const userId = await getUserIdFromEmail(session.user.email);

    const result = await watchlistService.addToWatchlist(
      userId,
      url,
      parseFloat(targetPrice),
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add to watchlist",
      },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromEmail(session.user.email);

    const watchlist = await watchlistService.getUserWatchlist(userId);

    return NextResponse.json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch watchlist",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    // Validate productId is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid productId format" },
        { status: 400 },
      );
    }

    const userId = await getUserIdFromEmail(session.user.email);

    await watchlistService.removeFromWatchlist(userId, new ObjectId(productId));

    return NextResponse.json({
      success: true,
      message: "Removed from watchlist",
    });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove from watchlist",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, targetPrice } = await request.json();
    if (!productId || targetPrice === undefined) {
      return NextResponse.json(
        { error: "productId and targetPrice are required" },
        { status: 400 },
      );
    }

    // Validate productId is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid productId format" },
        { status: 400 },
      );
    }

    const userId = await getUserIdFromEmail(session.user.email);

    await watchlistService.updateTargetPrice(
      userId,
      new ObjectId(productId),
      parseFloat(targetPrice),
    );

    return NextResponse.json({
      success: true,
      message: "Target price updated",
    });
  } catch (error) {
    console.error("Watchlist PATCH error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update target price",
      },
      { status: 400 },
    );
  }
}
