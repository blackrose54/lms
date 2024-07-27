import prisma from "@/lib/db";
import { File, LayoutDashboard, ListChecks } from "lucide-react";
import AttachmentForm from "./_components/attachmentForm";
import CategoryForm from "./_components/categoryForm";
import ChapterForm from "./_components/chapterForm";
import CourseImageForm from "./_components/courseImageForm";
import DescriptionForm from "./_components/descriptionForm";
import PriceForm from "./_components/priceForm";
import TitleForm from "./_components/titleForm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import PublishBanner from "@/components/publishBanner";
import CourseActions from "./_components/courseActions";

export const dynamic = 'force-dynamic'

const Page = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  const session = await auth();

  if (!session?.user) return <p>Not auth</p>;

  const courseDetails = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: session.user.id,
    },
    include: {
      category: true,
      attachments: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const categories = await prisma.category.findMany();
  

  if (!courseDetails) return <p>Course not found</p>;

  const requiredFields = [
    courseDetails.categoryId,
    courseDetails.title,
    courseDetails.description,
    courseDetails.image,
    courseDetails.price,
    courseDetails.Chapters.some((ch) => ch.isPublished),
  ];

  const completedFields = requiredFields.reduce((acc: number, field) => {
    if (!!field) acc++;
    return acc;
  }, 0);

  return (
    <main className=" w-full h-full relative ">
      {!courseDetails.isPublished && (
        <PublishBanner text="This Course is unpublished. It will not be visible to students" />
      )}
      <div className=" p-4 space-y-4">
        <div className=" md:flex space-y-4 items-center justify-between">
          <div className=" space-y-4">
            <h1 className=" text-4xl font-bold">Course Setup</h1>
            <p className=" text-muted-foreground">
              Complete all fields{" "}
              {`${completedFields}/${requiredFields.length}`}
            </p>
          </div>
          <CourseActions
            courseId={courseDetails.id}
            isCompleted={completedFields === requiredFields.length}
            isPub={courseDetails.isPublished}
          />
        </div>

        <div className=" grid md:grid-cols-2 md:gap-8 gap-4">
          <div className=" space-y-4">
            <div className=" flex items-center gap-x-2 mb-4">
              <div className="  bg-primary/10 p-2 rounded-full">
                <LayoutDashboard className=" text-primary" />
              </div>
              <h1 className=" text-2xl font-semibold">Customize your Course</h1>
            </div>
            <div className="space-y-4">
              <TitleForm title={courseDetails.title} id={courseId} />
              <DescriptionForm
                description={courseDetails?.description ?? ""}
                id={courseId}
              />
              <CourseImageForm
                imageUrl={courseDetails.image ?? ""}
                id={courseId}
              />
              <CategoryForm
                id={courseId}
                category={courseDetails.category??{title:"",id:-1} }
                data={categories}
              />
              <PriceForm price={courseDetails.price ?? 0} id={courseId} />
            </div>
          </div>
          <div className=" space-y-4">
            <div className=" flex items-center gap-x-2 mb-4">
              <div className="  bg-primary/10 p-2 rounded-full">
                <ListChecks className=" text-primary" />
              </div>
              <h1 className=" text-2xl font-semibold">Course Chapters</h1>
            </div>
            <div className="space-y-4">
              <ChapterForm id={courseId} chapter={courseDetails.Chapters} />
            </div>

            <div className=" flex items-center gap-x-2 mb-4">
              <div className=" bg-primary/10 p-2 rounded-full">
                <File className=" text-primary" />
              </div>
              <h1 className=" text-2xl font-semibold">
                Resource & Attachments
              </h1>
            </div>
            <AttachmentForm attachments={courseDetails} id={courseId} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
