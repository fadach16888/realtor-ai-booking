import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const properties = await prisma.propertyListing.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      area,
      images = [],
    } = body;

    if (
      !title ||
      !description ||
      !price ||
      !location ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      area === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const property = await prisma.propertyListing.create({
      data: {
        title,
        description,
        price: parseInt(price),
        location,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseInt(area),
        images: JSON.stringify(images),
        status: "draft",
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
