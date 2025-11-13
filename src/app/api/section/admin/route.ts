import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options";

//add Session (admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { githubId : session.user.id },
      select: { role: true }
    })


    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied: Admins only" }, { status: 403 });
    }
    const { userId, category, topic, date } = await request.json();

    if (!userId || !category || !topic || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newSection = await prisma.section.create({
      data: {
        userId,
        category,
        topic,
        date: new Date(date),
      },
      include: { user: true },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET Session FILTER = [name,email,topic,email,category] (admin)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { githubId : session.user.id },
      select: { role: true }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied: Admins only" }, { status: 403 });
    }

    const url = new URL(request.url);
    const topic = url.searchParams.get("topic");
    const date = url.searchParams.get("date");
    const username = url.searchParams.get("username");
    const email = url.searchParams.get("email");
    const category = url.searchParams.get("category");

    const section = await prisma.section.findMany({
      where: {
        AND: [
          category ? { category: { contains: category, mode: "insensitive" } } : {},
          topic ? { topic: { contains: topic, mode: "insensitive" } } : {},
          date ? { date: { equals: new Date(date) } } : {},
          username
            ? { user: { username: { contains: username, mode: "insensitive" } } }
            : {},
          email
            ? { user: { email: { contains: email, mode: "insensitive" } } }
            : {},
        ],
      },
      include: { user: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
