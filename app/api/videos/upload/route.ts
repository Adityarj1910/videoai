import { connectToDatabase } from "@/lib/db";
import Video from "@/model/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorised" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoFile = formData.get("videoFile") as File;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!title || !description || !videoFile) {
      return NextResponse.json(
        { error: "Title, description, and video file are required" },
        { status: 400 }
      );
    }

    // TODO: Upload videoFile & thumbnail to ImageKit and get real URLs
    const videoUrl = `videos/${Date.now()}-${videoFile.name}`;
    const thumbnailUrl = thumbnail 
      ? `thumbnails/${Date.now()}-${thumbnail.name}`
      : "default-thumbnail.jpg";

    // Save video record to database
    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      controls: true,
    });

    return NextResponse.json(
      { message: "Video uploaded successfully", video },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}