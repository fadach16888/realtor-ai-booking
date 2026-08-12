import { prisma } from "@/lib/db";
import { generateContentForAllPlatforms } from "@/lib/claude";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      );
    }

    // 獲取房源資訊
    const property = await prisma.propertyListing.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // 調用 Claude 生成文案
    const generatedContent = await generateContentForAllPlatforms({
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
    });

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate content",
      },
      { status: 500 }
    );
  }
}
