import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import MuxPlayer from "@mux/mux-player-react";
import { CheckCircle, LockIcon } from "lucide-react";

export default async function Chapter({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  
  const session = await auth();

  if (!session) return;

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
  });

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  const muxData = await prisma.mux.findUnique({
    where: {
      chapterId: params.chapterId,
    },
  });

  const isPurchased = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: session.user!.id!,
        courseId: params.courseId,
      },
    },
  });

  if (
    !chapter ||
    !chapter.isPublished ||
    !course ||
    !course.isPublished ||
    !muxData
  )
    return <p>Chapter not found</p>;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(course.price!);


  return (
      <div className=" h-full w-[90%] flex flex-col items-center p-8 gap-y-4">
        {isPurchased ? (
          <MuxPlayer playbackId={muxData.playbackId!} />
        ) : (
          <div className=" h-[60%] w-full bg-slate-800 flex items-center justify-center">
            <div className=" space-y-4 text-slate-200">
              <LockIcon className=" mx-auto" />
              <p>This Chapter is Locked</p>
            </div>
          </div>
        )}
        <div className=" flex items-center w-full justify-between">
          <p className=" text-4xl font-bold">{chapter.name}</p>
          {isPurchased ? (
            <Button className=" bg-green-600 space-x-2">
              <p>Mark as Complete</p>
              <CheckCircle size={20} />
            </Button>
          ) : (
            <Button>Enroll for {formattedPrice}</Button>
          )}
        </div>

        <p className=" text-lg font-semibold w-full">{course.description}</p>
      </div>
  );
}

