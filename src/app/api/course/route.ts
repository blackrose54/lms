import { auth } from "@/auth";
import prisma from "@/lib/db";
import { newCourse } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const parsed = newCourse.safeParse(data);

    console.log(parsed.error);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });

    const { title } = parsed.data;

    const course = await prisma.course.create({
      data: {
        title,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ id: course.id });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

