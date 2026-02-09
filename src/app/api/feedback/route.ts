import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productSlug, title, body } = await req.json();

    if (!productSlug || !title?.trim()) {
      return NextResponse.json(
        { error: "productSlug and title are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        productId: product.id,
        title: title.trim(),
        body: body?.trim() || "",
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
