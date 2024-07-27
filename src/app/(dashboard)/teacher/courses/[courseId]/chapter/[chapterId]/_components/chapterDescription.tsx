"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Editor from "./editor";
import PreviewEditor from "./previewEditor";

interface titleFormProps {
  description?: string;
  chapterId: string;
  courseId: string;
}

const ChapterDescriptionForm: FC<titleFormProps> = ({
  description,
  chapterId,
  courseId,
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const [value, setvalue] = useState<string>(description ?? "");
  const [errors, seterrors] = useState<string>("");
  const [isSubmitting, setsubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      setsubmitting(true);
      if (value.length == 0) return seterrors("Required");
      seterrors("");

      const res = await fetch(
        `/api/course/${courseId}/chapters/${chapterId}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: value }),
        }
      );

      if (!res.ok) {
        const { error } = await res.json();
        toast({
          title: error,
          variant: "destructive",
        });
      } else {
        setEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setsubmitting(false);
    }
  };

  const onChange = (value: string) => {
    setvalue(value);
  };
  return (
    <section className=" bg-secondary p-4 rounded-lg space-y-4">
      <div className=" gap-y-2  flex flex-wrap items-center justify-between">
        <Label htmlFor="title" className="font-bold">
          Chapter Description
        </Label>
        <div className="cursor-pointer select-none">
          {isEditing ? (
            <p
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </p>
          ) : (
            <div
              className=" flex items-center gap-x-2"
              onClick={() => setEditing(true)}
            >
              <Pencil size={15} />
              <p className=" ">Edit</p>
            </div>
          )}
        </div>
        {isEditing ? (
          <>
            <Editor
              onChange={onChange}
              value={value}
              className="  basis-full"
            />
            <Button disabled={isSubmitting} onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <PreviewEditor className=" basis-full" value={value} />
        )}
        {errors && <p className=" text-red-500 text-xs">{errors}</p>}
      </div>
    </section>
  );
};

export default ChapterDescriptionForm;
