import { auth } from "@/auth";
import prisma from "@/lib/db";
import { newCourse } from "@/lib/schema";
import { utapi } from "@/lib/server";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (course.image && data.image) {
      await utapi.deleteFiles(course.image.replace("https://utfs.io/f/", ""));
    }

    await prisma.course.update({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
      data: {
        ...data,
      },
    });

    return new NextResponse("Success");
  } catch (error) {
    console.log(error);

    if (error instanceof PrismaClientValidationError)
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ status: "Unauthorized" }, { status: 401 });

    await prisma.course.delete({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });

    return new NextResponse("Success");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
