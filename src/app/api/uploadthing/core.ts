import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id)
    throw new UploadThingError("Unauthorized");

  return { id: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete((res) => {
      return { url: res.file.url };
    }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => await handleAuth())
    .onUploadComplete((data) => {
      return {url:data.file.url,name:data.file.name}
    }),

  chapterVideo: f({
    video: {
      maxFileCount: 1,
      maxFileSize: "512GB",
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete((data) => {
      return {url:data.file.url}
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
