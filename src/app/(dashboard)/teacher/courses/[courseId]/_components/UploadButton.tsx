"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "@/components/ui/use-toast";
import { FC, ReactElement } from "react";
import { UploadDropzone } from "./uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

interface UploadButtonProps {
  endpoint: keyof OurFileRouter;
  onUploadComplete:(res:any)=>any;
}

const UButton: FC<UploadButtonProps> = ({ endpoint,onUploadComplete }): ReactElement => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(data)=>{
        onUploadComplete(data)
      }}
      onUploadError={(error: Error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "Something went wrong!",
          variant: "destructive",
        });
      }}
    />
  );
};

export default UButton;
