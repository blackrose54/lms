import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = (await req.json()) as Array<{ id: string; position: number }>;
    if (!data)
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });

    const owner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });

    if (!owner)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    data.forEach(async (chapter) => {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: chapter.position },
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
