import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { ObjectId } from "mongodb";

const productRepo = new ProductRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    // Return only necessary fields for the product page
    return NextResponse.json({
      success: true,
      data: {
        id: product._id,
        title: product.title,
        image: product.image,
        latestPrice: product.latestPrice,
        currency: product.currency,
        canonicalUrl: product.canonicalUrl,
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
