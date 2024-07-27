import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/lib/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url, name } = await req.json();

    if (!url || !name)
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });

    if (!courseOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.attachments.create({
      data: {
        courseId: params.courseId,
        url,
        name,
      },
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });

    const file = await prisma.attachments.delete({
      where: {
        id,
        courseId: params.courseId,
      },
    });

    await utapi.deleteFiles(file.url.replace('https://utfs.io/f/',''));
   

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
