import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.propertyListing.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, location, bedrooms, bathrooms, area, status, images, approvedContent } = body;

    const property = await prisma.propertyListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(location && { location }),
        ...(bedrooms !== undefined && { bedrooms: parseInt(bedrooms) }),
        ...(bathrooms !== undefined && { bathrooms: parseInt(bathrooms) }),
        ...(area !== undefined && { area: parseInt(area) }),
        ...(status && { status }),
        ...(images && { images: JSON.stringify(images) }),
        ...(approvedContent && { approvedContent: JSON.stringify(approvedContent) }),
        ...(status === "approved" && { reviewedAt: new Date() }),
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.propertyListing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
