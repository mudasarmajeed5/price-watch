import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";

const productRepo = new ProductRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await productRepo.findById(new ObjectId(id));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch user's target price for this product
    const db = getDb();
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const alert = await db.collection("price_alerts").findOne({
      userId: user._id,
      productId: new ObjectId(id),
      isActive: true,
    });

    const targetPrice = alert?.targetPrice || product.latestPrice;

    // Return only necessary fields for the product page
    return NextResponse.json({
      success: true,
      data: {
        _id: product._id,
        title: product.title,
        image: product.image,
        latestPrice: product.latestPrice,
        targetPrice: targetPrice,
        currency: product.currency,
        canonicalUrl: product.canonicalUrl,
        store: product.store,
      },
    });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}
