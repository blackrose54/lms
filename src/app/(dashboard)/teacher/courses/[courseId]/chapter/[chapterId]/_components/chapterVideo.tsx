"use client";

import { FC, ReactElement, useState } from "react";
import { CirclePlus, ImageIcon, Pencil, VideoIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { ClientUploadedFileData } from "uploadthing/types";
import { useRouter } from "next/navigation";
import UButton from "../../../_components/UploadButton";
import MuxPlayer from '@mux/mux-player-react'


interface imageFormProps {
  playbackId?: string;
  courseId: string;
  chapterId:string;
}

const ChapterVideoForm: FC<imageFormProps> = ({
  playbackId,
  chapterId,
  courseId
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();

  const onUploadComplete = async (
    data: ClientUploadedFileData<void | { url: string }>[]
  ) => {
    if (data[0].serverData) {
      const res = await fetch(`/api/course/${courseId}/chapters/${chapterId}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: data[0].serverData.url }),
      });

      if (res.ok) {
        toast({
          title: "Video Uploaded",
          description: "Your video is being processed",
          variant: "success",
        });
        setEditing(false)
        router.refresh();
      } else {
        const { error } = await res.json();
        toast({
          title: error,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className=" bg-secondary p-4 rounded-lg space-y-4">
      <div className=" gap-y-2  flex flex-wrap items-center justify-between">
        <p className=" font-bold">Chapter Video</p>
        <div
          className=" flex items-center gap-x-2 cursor-pointer"
          onClick={() => setEditing((value) => !value)}
        >
          {!isEditing ? (
            !playbackId ? (
              <CirclePlus size={17} />
            ) : (
              <Pencil size={17} />
            )
          ) : null}
          <p>{!isEditing ? (!playbackId ? "Add Video" : "Edit") : "Cancel"}</p>
        </div>
        {isEditing ? (
          <div className=" basis-full">
            <UButton
              endpoint="chapterVideo"
              onUploadComplete={onUploadComplete}
            />
          </div>
        ) : playbackId ? (
          <div className=" basis-full relative aspect-video mt-2">
           <MuxPlayer playbackId={playbackId} />
          </div>
        ) : (
          <div className=" h-60 w-60 brightness-75 flex items-center justify-center border-2 border-dotted rounded-md  basis-full">
            <VideoIcon className=" m-auto text-muted-foreground h-auto w-16" />

          </div>
        )}
      <p className=" text-muted-foreground">Do not go back until upload is complete</p>
      </div>
    </div>
  );
};

export default ChapterVideoForm;
