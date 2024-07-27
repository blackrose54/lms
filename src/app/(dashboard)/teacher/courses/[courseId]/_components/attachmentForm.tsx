"use client";

import { toast } from "@/components/ui/use-toast";
import { Attachments, Course } from "@prisma/client";
import { CirclePlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import UButton from "./UploadButton";

interface attachmentFormProps {
  attachments: Course & { attachments: Attachments[] };
  id: string;
}

const AttachmentForm: FC<attachmentFormProps> = ({
  attachments,
  id,
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isDeleting, setisDeleting] = useState<string>("");
  const router = useRouter();

  const onUploadComplete = async (
    data: ClientUploadedFileData<void | { url: string; name?: string }>[]
  ) => {
    if (data[0].serverData) {
      const res = await fetch(`/api/course/${id}/attachments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data[0].serverData.url,
          name: data[0].serverData.name,
        }),
      });

      if (res.ok) {
        toast({
          title: "File Uploaded",
          description: "Your file has been uploaded successfully",
          variant: "success",
        });
        setEditing(false);
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

  const onDelete = async (attachemntId: string,attachmenturl:string) => {
    try {
      setisDeleting(attachemntId);
      const res = await fetch(`/api/course/${id}/attachments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: attachemntId,
        }),
      });      

      if (res.ok) {
        toast({
          title: "Attachment Deleted",
          variant: "success",
          duration: 3000,
        });
        router.refresh();
      } else {
        const { error } = await res.json();
        toast({
          title: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setisDeleting("");
    }
  };

  return (
    <div className=" bg-secondary p-4 rounded-lg space-y-4">
      <div className=" gap-y-2  flex flex-wrap items-center justify-between space-y-4">
        <p className=" font-bold">Course Attachments</p>
        <div
          className=" flex items-center gap-x-2 cursor-pointer"
          onClick={() => setEditing((value) => !value)}
        >
          {!isEditing ? <CirclePlus size={17} /> : null}
          <p>{!isEditing ? "Add Attachment" : "Cancel"}</p>
        </div>
        {isEditing ? (
          <div className=" basis-full">
            <UButton
              endpoint="courseAttachment"
              onUploadComplete={onUploadComplete}
            />
          </div>
        ) : null}
        <div className=" basis-full text-muted-foreground space-y-2 cursor-pointer ">
          {attachments.attachments.length === 0 ? (
            "No attachments"
          ) : (
            <>
              {attachments.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className=" bg-primary/20 p-2 flex items-center justify-between rounded-md"
                >
                  <p
                    onClick={() => {
                      window.open(attachment.url);
                    }}
                    className=" grow"
                  >
                    {attachment.name}
                  </p>
                  <button
                    className="p-1  rounded-full hover:border-2 border-spacing-2 border-border"
                    onClick={() => {
                      onDelete(attachment.id,attachment.url);
                    }}
                  >
                    {isDeleting == attachment.id ? (
                      <Loader2 className=" animate-spin h-3 w-3" />
                    ) : (
                      <X className=" h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentForm;
