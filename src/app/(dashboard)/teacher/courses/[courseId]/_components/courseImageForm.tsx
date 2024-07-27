"use client";

import { FC, ReactElement, useState } from "react";
import UButton from "./UploadButton";
import { CirclePlus, ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { ClientUploadedFileData } from "uploadthing/types";
import { useRouter } from "next/navigation";

interface imageFormProps {
  imageUrl?: string;
  id: string;
}

const CourseImageForm: FC<imageFormProps> = ({
  imageUrl,
  id,
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();

  const onUploadComplete = async (
    data: ClientUploadedFileData<void | { url: string }>[]
  ) => {
    if (data[0].serverData) {
      const res = await fetch(`/api/course/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: data[0].serverData.url}),
      });

      if (res.ok) {
        toast({
          title: "File Uploaded",
          description: "Your file has been uploaded successfully",
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
        <p className=" font-bold">Course Image</p>
        <div
          className=" flex items-center gap-x-2 cursor-pointer"
          onClick={() => setEditing((value) => !value)}
        >
          {!isEditing ? (
            !imageUrl ? (
              <CirclePlus size={17} />
            ) : (
              <Pencil size={17} />
            )
          ) : null}
          <p>{!isEditing ? (!imageUrl ? "Add Image" : "Edit") : "Cancel"}</p>
        </div>
        {isEditing ? (
          <div className=" basis-full">
            <UButton
              endpoint="courseImage"
              onUploadComplete={onUploadComplete}
            />
          </div>
        ) : imageUrl ? (
          <div className=" basis-full relative aspect-video mt-2">
            <Image src={imageUrl} alt="image" fill className=" object-cover rounded-md" />
          </div>
        ) : (
          <div className=" h-60 w-60 brightness-75 flex items-center justify-center border-2 border-dotted rounded-md  basis-full">
            <ImageIcon className=" m-auto text-muted-foreground h-auto w-16" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseImageForm;
