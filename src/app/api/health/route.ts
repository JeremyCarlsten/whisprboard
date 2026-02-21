import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Quick DB check — count products
    const productCount = await prisma.product.count();
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db: { connected: true, products: productCount },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        db: { connected: false, error: String(error) },
      },
      { status: 503 }
    );
  }
}
