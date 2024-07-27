import { auth } from "@/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data)
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 400 });

    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter?.position ? lastChapter.position + 1 : 0;

    await prisma.chapter.create({
      data: {
        courseId: params.courseId,
        position: newPosition,
        ...data,
      },
    });

    const path = req.nextUrl.searchParams.get("path");
    if (path) {
      // revalidatePath(path, "layout");
      return NextResponse.json({ status: "success" }, { status: 200 });
    }

      return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
