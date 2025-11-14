// app/api/section/like/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const getUserId = async () => {
  const s = await getServerSession(authOptions);
  return s?.user?.id ?? null;
};

/* ---------- LIKE ---------- */
export async function POST(req: Request) {
  try {
    const { sectionId } = await req.json();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauth" }, { status: 401 });

    await prisma.sectionLike.create({ data: { userId, sectionId } });
    return NextResponse.json({ liked: true }, { status: 200 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ liked: false }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ---------- UNLIKE ---------- */
export async function DELETE(req: Request) {
  try {
    const { sectionId } = await req.json();
    if (!sectionId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauth" }, { status: 401 });

    const { count } = await prisma.sectionLike.deleteMany({ where: { userId, sectionId } });
    return NextResponse.json({ unliked: count > 0 }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}