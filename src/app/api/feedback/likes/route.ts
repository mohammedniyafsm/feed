import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

//  POST — Add a like to a section
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId } = await request.json();

    if (!sectionId) {
      return NextResponse.json({ error: "Section ID is required" }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await prisma.sectionLike.findUnique({
      where: {
        sectionId_userId: {
          sectionId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ message: "Already liked" }, { status: 200 });
    }

    const newLike = await prisma.sectionLike.create({
      data: {
        sectionId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newLike, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  DELETE — Remove like
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId } = await request.json();
    if (!sectionId) {
      return NextResponse.json({ error: "Section ID is required" }, { status: 400 });
    }

    await prisma.sectionLike.deleteMany({
      where: {
        sectionId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Like removed successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


