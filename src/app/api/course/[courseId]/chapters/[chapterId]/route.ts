import { auth } from "@/auth";
import prisma from "@/lib/db";
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_ACCESS_TOKEN,
  tokenSecret: process.env.MUX_SECRET_KEY,
});
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const owner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });

    if (!owner)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const v = await prisma.mux.findFirst({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (v) {
      await video.assets.delete(v.assedId);
    }

    await prisma.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    if(owner.isPublished) {
        const chapters = await prisma.chapter.findFirst({
            where:{
                isPublished:true
            }
        })

        if(!chapters){
            await prisma.course.update({
                where:{
                    id:params.courseId
                },
                data:{
                    isPublished:false
                }
            })
        }
    }

    return NextResponse.json({ message: "Chapter Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
