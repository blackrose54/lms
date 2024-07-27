"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, SquareArrowOutDownRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface titleFormProps {
  isFree: boolean;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});
type formschema = z.infer<typeof formSchema>;

const ChapterAccessForm: FC<titleFormProps> = ({
  isFree,
  chapterId,
  courseId,
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);

  const form = useForm<formschema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree,
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<formschema> = async (data) => {
    console.log(data);
    const res = await fetch(
      `/api/course/${courseId}/chapters/${chapterId}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFree: data.isFree }),
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
  };
  return (
    <Form {...form}>
      <form
        className=" bg-secondary p-4 rounded-lg space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className=" gap-y-2  flex flex-wrap items-center justify-between">
          <Label htmlFor="title" className="font-bold">
            Chapter Access
          </Label>
          <div className="cursor-pointer select-none">
            {isEditing ? (
              <p
                onClick={() => {
                  form.clearErrors();
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
            <div className="basis-full gap-x-2 items-center space-y-4">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this chapter free for preview</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                className="basis-full"
                disabled={form.formState.isSubmitting}
              >
                Save
              </Button>
            </div>
          )}
          {form.formState.errors.isFree && (
            <p className=" text-red-500 text-xs">
              {form.formState.errors.isFree.message}
            </p>
          )}
        </div>
        {!isEditing && (
          <p className=" text-muted-foreground">
            {isFree ? "This Chapter is Free for preview" : "This Chapter is not Free"}
          </p>
        )}
      </form>
    </Form>
  );
};

export default ChapterAccessForm;
