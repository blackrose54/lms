import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node"

const {video} = new Mux({
  tokenId:process.env.MUX_ACCESS_TOKEN,
  tokenSecret:process.env.MUX_SECRET_KEY,
})
export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    if (!data)
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );

    const owner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: session.user.id,
      },
    });
    if (!owner)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.chapter.update({
      where: {
        courseId: params.courseId,
        id: params.chapterId,
      },
      data: {
        ...data,
      },
    });

    if(typeof data === 'object' && 'videoUrl' in data){
      const v = await prisma.mux.findFirst({
        where:{
          chapterId:params.chapterId
        },
        
      })

      if(v){
        await video.assets.delete(v.assedId);
        await prisma.mux.delete({
          where:{
            id:v.id
          }
        })
      }
      const assest = await video.assets.create({
        input:data.videoUrl,        
        test:false,
        playback_policy:["public"]
      })

     await prisma.mux.create({
        data:{
          chapterId:params.chapterId,
          assedId:assest.id,
          playbackId:assest.playback_ids?.[0].id, 
        }
      })

      
    }

    return NextResponse.json({ message: "Chapter Updated" },{ status: 200});
  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Something went Wrong" },
      { status: 400 }
    );
  }
}
