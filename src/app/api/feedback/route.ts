import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// ADD COMMENT TO SECTION (User)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId, comment, anonymous } = await request.json();

    if (!sectionId || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        sectionId,
        comment,
        anonymous: Boolean(anonymous),
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE COMMENT (User)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feedbackId, comment } = await request.json();

    if (!feedbackId || !comment) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!existingFeedback || existingFeedback.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { comment },
    });

    return NextResponse.json(updatedFeedback, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE COMMENT (User)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feedbackId } = await request.json();

    if (!feedbackId) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 });
    }

    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!existingFeedback || existingFeedback.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.feedback.delete({
      where: { id: feedbackId },
    });

    return NextResponse.json({ message: "Feedback deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET feedback of session
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const sectionId = url.searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json({ error: "Section ID required" }, { status: 400 });
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { sectionId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks, { status: 200 });

  } catch (error) {
    console.error("GET User Feedback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
