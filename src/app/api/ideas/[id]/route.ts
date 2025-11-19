import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET — Fetch one idea
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const idea = await prisma.ideas.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
      },
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH — Update idea
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.ideas.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const body = await request.json();

    const updated = await prisma.ideas.update({
      where: { id },
      data: {
        category: body.category ?? existing.category,
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        anonymous: body.anonymous ?? existing.anonymous,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE — Delete idea
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.ideas.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.ideas.delete({ where: { id } });

    return NextResponse.json({ message: "Idea deleted successfully" });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
