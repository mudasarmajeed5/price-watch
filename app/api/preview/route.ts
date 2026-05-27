import { NextRequest, NextResponse } from "next/server";
import { StrategyFactory } from "@/lib/fetching/strategy-factory";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const data = await StrategyFactory.fetchProduct(url);

    return NextResponse.json({
      success: true,
      data: {
        title: data.title,
        image: data.image,
        price: data.price,
      },
    });
  } catch (error) {
    console.error("Preview fetch error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch product preview",
      },
      { status: 400 },
    );
  }
}
