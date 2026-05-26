import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { WatchlistService } from "@/lib/services/watchlist.service";
import { ObjectId } from "mongodb";

const watchlistService = new WatchlistService();

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

    // Get user ID from session (you'd need to fetch this from the database)
    // For now, this is a placeholder
    const userId = new ObjectId(); // Replace with actual user ID from DB

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

    // Get user ID from session (you'd need to fetch this from the database)
    // For now, this is a placeholder
    const userId = new ObjectId(); // Replace with actual user ID from DB

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

    // Get user ID from session
    const userId = new ObjectId(); // Replace with actual user ID from DB

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
