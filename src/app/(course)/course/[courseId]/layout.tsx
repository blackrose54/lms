import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "../_components/CourseSidebar";
import CourseNavbar from "../_components/CourseNavbar";

interface LayoutCourseComponent {
  children: React.ReactNode;
  params: { courseId: string };
}
async function LayoutCourse({
  children,
  params: { courseId },
}: LayoutCourseComponent) {
  const session = await auth();

  if (!session?.user) return <p>Not auth</p>

  const course = await prisma.course.findUnique({
    where: {
      userId: session.user.id,
      id: courseId,
    },
    include: {
    
      Chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
            position:'asc'
        },
      },
    },
  });

  if (!course) return <p>Not auth</p>;

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id!,
        courseId: courseId,
      },
    },
  });

  

  return (
      <main className=" h-screen w-screen flex overflow-x-hidden">
        <div className="hidden md:block fixed left-0 border-2 border-border h-full w-[20rem]">
          <CourseSidebar
            chapters={course.Chapters}
            coursetitle={course.title}
            purchase={purchase}
          />
        </div>
        <div className=" md:ml-[20rem] w-full">
          <CourseNavbar chapters={course.Chapters} purchase={purchase} coursetitle={course.title} />
          <div className="h-full">{children}</div>
        </div>
      </main>
  );
}

export default LayoutCourse;
