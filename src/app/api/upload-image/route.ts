import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { message: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are supported" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { message: "Image file is too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    const fileExtension = image.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    const publicDir = join(process.cwd(), "public");
    const uploadsDir = join(publicDir, "uploads");
    const filePath = join(uploadsDir, fileName);

    try {
      await writeFile(filePath, Buffer.from(await image.arrayBuffer()));
    } catch (error: any) {
      return NextResponse.json(
        { message: "Server error: Upload directory may not exist" },
        { status: 500 }
      );
    }

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      message: "Image uploaded successfully",
      imageUrl 
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to upload image: " + error.message },
      { status: 500 }
    );
  }
}