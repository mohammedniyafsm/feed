import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

//  Helper function to verify admin access
async function verifyAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  // Fetch role from DB based on GitHub ID
  const user = await prisma.user.findUnique({
    where: { githubId: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return session;
}

//  GET SPECIFIC SESSION BY ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await  params;
  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    const section = await prisma.section.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!section) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  UPDATE SESSION DETAIL
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await  params;
  const { topic, category, date } = await req.json();

  try {
    const updatedSession = await prisma.section.update({
      where: { id },
      data: {
        topic,
        category,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  DELETE SESSION
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
