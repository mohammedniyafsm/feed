import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const topic = searchParams.get('topic');
        const category = searchParams.get('category');
        const username = searchParams.get('username');
        const date = searchParams.get('date');

        const filters: any = {}

        if (topic) {
            filters.topic = {
                contains: topic,
                mode: "insensitive"
            }
        }

        if (category) {
            filters.category = {
                contains: category.toUpperCase(),
                mode: "insensitive"
            }
        }

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            filters.date = {
                gte: start,
                lte: end
            };
        }


        let userFilter = {};
        if (username) {
            userFilter = {
                user: {
                    username: {
                        contains: username,
                        mode: "insensitive",
                    },
                },
            };
        }

        console.log(date)

        const sections = await prisma.section.findMany({
            where: {
                AND: [filters, userFilter],
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
                _count: {
                    select: {
                        feedback: true,
                        sectionLikes: true,
                    },
                },
                sectionLikes: {
                    where: {
                        userId: session.user.id, 
                    },
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: { date: "asc" },
        });
        return NextResponse.json({ sections })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}