"use client";
import { getUserProgress } from "@/actions/getProgress";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Chapter, Purchase } from "@prisma/client";
import { CirclePlayIcon, Lock, PlayIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SidebarProps {
  chapters: Chapter[];
  coursetitle: string;
  purchase: Purchase | null;
}
export default function CourseSidebar({
  chapters,
  coursetitle,
  purchase,
}: SidebarProps) {
  const [progress, setprogress] = useState(0);
  const { chapterId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();


  useEffect(()=>{
    if (!session?.user) return ;
  
    if (purchase) {
      getUserProgress(session?.user.id!, chapters[0].courseId).then(
        (progress) => {
          if (progress) setprogress(progress.progressPercentage);
        }
      );
    }
  
  },[chapters, purchase, router, session?.user])

  return (
    <div className="h-full">
      <div className="  border-b-2 border-border">
        <h1 className=" text-3xl font-bold capitalize p-5 text-center">
          {coursetitle}
        </h1>
        {purchase && (
          <div className=" p-6 space-y-2 ">
            <Progress value={progress} />
            <p className=" text-primary font-semibold text-lg">
              {progress}% Complete
            </p>
          </div>
        )}
      </div>

      <div className=" ">
        {chapters.map((chapter) => {
          return (
            <div
              key={chapter.id}
              className={cn(
                " px-6 transition-all py-4 hover:bg-secondary cursor-pointer flex items-center gap-x-4",
                {
                  "border-r-4 border-primary bg-secondary":
                    chapterId && chapter.id === chapterId,
                }
              )}
              onClick={() =>
                router.push(`/course/${chapter.courseId}/chapter/${chapter.id}`)
              }
            >
              {purchase || chapter.isFree ? (
                <CirclePlayIcon
                  className={cn({
                    "text-muted-foreground":
                      !chapterId || chapter.id !== chapterId,
                  })}
                />
              ) : (
                <Lock className="text-muted-foreground" />
              )}
              <p
                className={cn(" text-2xl capitalize", {
                  "text-muted-foreground": !purchase || !chapter.isFree,
                })}
              >
                {chapter.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
