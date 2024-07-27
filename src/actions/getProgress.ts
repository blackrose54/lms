"use server";

import prisma from "@/lib/db";

export async function getUserProgress(userId: string, courseId: string) {

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: userId,
    },
    include: {
      Chapters: true,
    },
  });

  if (!course) return null;

  const noOfChapters = course.Chapters.reduce((acc, curr) => {
    if (curr.isPublished) acc++;
    return acc;
  }, 0);

  let noOfChaptersCompleted = 0;

  course.Chapters.forEach(async (curr) => {
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: curr.id,
        },
      },
    });

    if (progress?.isCompleted) noOfChaptersCompleted++;
  }, 0);

  const progressPercentage = noOfChaptersCompleted / noOfChapters * 100

  return {progressPercentage,noOfChapters};
}
