import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// ✅ POST — Add a new idea
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, title, description, anonymous } = await request.json();

    if (!category || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newIdea = await prisma.ideas.create({
      data: {
        userId: session.user.id,
        category,
        title,
        description,
        anonymous: anonymous ?? false,
      },
    });

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    console.error("Error adding idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET — Get all ideas (optional filter by category)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const ideas = await prisma.ideas.findMany({
      where: category ? { category: category as any } : {},
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ideas, { status: 200 });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
