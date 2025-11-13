import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { userId: string };
}

// USER GET ALL SESSION OF USER  
export async function GET(req: Request, { params }: Params) {
  const { userId } = await params;

  try {
    const section = await prisma.section.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
