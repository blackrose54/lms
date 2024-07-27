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

interface titleFormProps {
  description?: string;
  id: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

type formSchema = z.infer<typeof formSchema>;

const DescriptionForm: FC<titleFormProps> = ({
  description,
  id,
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<formSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<formSchema> = async (data) => {
    const res = await fetch(`/api/course/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: data.description }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast({
        title: error,
        variant: "destructive",
      });
    } else {
      setEditing(false);
      router.refresh()
    }
  };
  return (
    <form
      className=" bg-secondary p-4 rounded-lg space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className=" gap-y-2  flex flex-wrap items-center justify-between">
        <Label htmlFor="title" className="font-bold">Course Description</Label>
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
          <>
            <Textarea
              defaultValue={description}
              className="basis-full resize-none"
              id="title"
              {...register("description")}
            />
            <Button disabled={isSubmitting}>Save</Button>
          </>
        )}
        {errors.description && (
          <p className=" text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>
      {!isEditing && <p className=" text-muted-foreground">{description}</p>}
    </form>
  );
};

export default DescriptionForm;
