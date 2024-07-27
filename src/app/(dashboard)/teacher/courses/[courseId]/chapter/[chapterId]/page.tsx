import { auth } from "@/auth";
import prisma from "@/lib/db";
import { ArrowLeft, EyeIcon, LayoutDashboard, VideoIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";
import ChapterAccessForm from "./_components/chapterAccess";
import ChapterActions from "./_components/chapterAction";
import ChapterDescriptionForm from "./_components/chapterDescription";
import ChapterVideoForm from "./_components/chapterVideo";
import ChapterTitleForm from "./_components/chaptertitle";
import PublishBanner from "../../../../../../../components/publishBanner";

export const dynamic = 'force-dynamic'

interface pageProps {
  params: { chapterId: string; courseId: string };
}

const page: FC<pageProps> = async ({ params: { chapterId, courseId } }) => {
  const session = await auth();

  if (!session?.user) return <p>Not auth</p>;

  const chapterDetails = await prisma.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapterDetails) return notFound();

  const requiredFields = [
    chapterDetails.videoUrl,
    chapterDetails.name,
    chapterDetails.description,
  ];

  const completedField = requiredFields.reduce((acc, field) => {
    if (field != null) acc++;
    return acc;
  }, 0);

  return (
    <section className=" h-full w-full relative ">
      {!chapterDetails.isPublished && (
        <PublishBanner text="This Chpater is unpublished and will not be added to the course" />
      )}
      <div className=" p-4 space-y-4">
        <div className="flex items-center gap-x-2">
          <Link href={`/teacher/courses/${courseId}`}>
            <ArrowLeft className=" h-6" />
          </Link>
          <h1 className=" text-lg">Back to course setup</h1>
        </div>
        <div className=" md:flex items-center justify-between space-y-4 w-full">
          <div className="space-y-4">
            <h1 className=" text-4xl font-bold">Chapter Creation</h1>
            <p className=" text-muted-foreground">
              Complete all fields {`${completedField}/${requiredFields.length}`}
            </p>
          </div>
          <ChapterActions
            courseId={courseId}
            chapterId={chapterId}
            isPub={chapterDetails.isPublished}
            isCompleted={completedField === requiredFields.length}
          />
        </div>

        <div className=" grid md:grid-cols-2 md:gap-8 gap-4">
          <div className="space-y-4">
            <div className=" flex items-center gap-x-2 mb-4">
              <div className="  bg-primary/10 p-2 rounded-full">
                <LayoutDashboard className=" text-primary" />
              </div>
              <h1 className=" text-2xl font-semibold">
                Customize your Chapter
              </h1>
            </div>
            <ChapterTitleForm
              chapterId={chapterId}
              courseId={courseId}
              title={chapterDetails.name}
            />
            <ChapterDescriptionForm
              description={chapterDetails.description ?? ""}
              courseId={courseId}
              chapterId={chapterId}
            />
            <div className=" flex items-center gap-x-2 mb-4">
              <div className="  bg-primary/10 p-2 rounded-full">
                <EyeIcon className=" text-primary" />
              </div>
              <h1 className=" text-2xl font-semibold">Access Settings</h1>
            </div>

            <ChapterAccessForm
              courseId={courseId}
              chapterId={chapterId}
              isFree={chapterDetails.isFree}
            />
          </div>
          <div className=" space-y-4">
            <div className=" flex items-center gap-x-2 mb-4">
              <div className="  bg-primary/10 p-2 rounded-full">
                <VideoIcon className=" text-primary" />
              </div>
              <h1 className=" text-2xl font-semibold">Add a Video </h1>
            </div>
            <ChapterVideoForm
              playbackId={chapterDetails.muxData?.playbackId ?? ""}
              chapterId={chapterId}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
