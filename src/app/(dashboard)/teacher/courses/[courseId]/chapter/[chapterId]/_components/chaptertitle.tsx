"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface titleFormProps {
  title: string;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

type formschema = z.infer<typeof formSchema>;

const ChapterTitleForm: FC<titleFormProps> = ({ title, chapterId,courseId }): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<formschema>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<formschema> = async (data) => {
    console.log(data);
    const res = await fetch(`/api/course/${courseId}/chapters/${chapterId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data.title }),
    });
    

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
  };
  return (
    <form
      className=" bg-secondary p-4 rounded-lg space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className=" gap-y-2  flex flex-wrap items-center justify-between">
        <Label htmlFor="title" className="font-bold">
          Chapter Title
        </Label>
        <div className="cursor-pointer select-none">
          {isEditing ? (
            <p
              onClick={() => {
                clearErrors();
                setEditing(false);
              }}
              className=""
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
        {isEditing && (
          <div className="basis-full flex gap-x-2 items-center">
            <Input id="title" defaultValue={title} {...register("title")} />
            <Button disabled={isSubmitting}>Save</Button>
          </div>
        )}
        {errors.title && (
          <p className=" text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>
      {!isEditing && <p className=" text-muted-foreground">{title}</p>}
    </form>
  );
};

export default ChapterTitleForm;
