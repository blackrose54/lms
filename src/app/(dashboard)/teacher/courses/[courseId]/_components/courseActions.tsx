"use client";

import ConfrimDialog from "@/components/modals/confirm";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface actiontypes {
  courseId: string;
  isPub: boolean;
  isCompleted: boolean;
}
export default function CourseActions({
  courseId,
   isCompleted,
   isPub
}: actiontypes) {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [published,setPublished] = useState<boolean>(isPub);
  const pathname = usePathname()

  const router = useRouter();
  const onConfrim = async () => {
    try {
      setSubmitting(true);
      const res = await fetch(`/api/course/${courseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
        router.push(`/teacher/courses`);
      } else {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onPublish = async () => {

    try {
      const p = published;
      setSubmitting(true);
      const res = await fetch(
        `/api/course/${courseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: !p,
          }),
        }
      );

      if (res.ok) {
        toast({
          title: `${!published ? "Course Published":"Course Unpublished"}`,
          variant: "success",
        });
        setPublished(val=>!val)

      } else {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  };
  return (
    <div className=" flex items-center gap-x-4">
      <Button variant={"outline"} onClick={()=>onPublish()} disabled={isSubmitting || !isCompleted}>
        {published ? "Unpublish":"Publish"}
      </Button>
      <ConfrimDialog onConfirm={onConfrim}>
        <Button size={"icon"} variant={"destructive"} disabled={isSubmitting}>
          <Trash />
        </Button>
      </ConfrimDialog>
    </div>
  );
}
