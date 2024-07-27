"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import { Grip, Loader2, Pencil, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface chapterFormProps {
  chapter: Chapter[];
  id: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Title is required" }),
});

type formschema = z.infer<typeof formSchema>;

const ChapterForm: FC<chapterFormProps> = ({ chapter, id }): ReactElement => {
  console.log({chapter})
  const [isEditing, setEditing] = useState<boolean>(false);
  const [Chapter, setChapter] = useState<Chapter[]>(chapter);
  const [isUpdating, setUpdating] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    reset
  } = useForm<formschema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<formschema> = async (data) => {
    try {
      const res = await fetch(`/api/course/${id}/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast({
          title: error,
          variant: "destructive",
        });
      } else {
        setEditing(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      router.refresh();
      reset()
    }
  };

  const onReOrder = async (
    updatedChapters: { id: string; position: number }[]
  ) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/course/${id}/chapters/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedChapters),
      });

      if (res.ok) {
        toast({
          title: "Chapter Reordered",
          variant: "success",
          duration: 2000,
        });
      } else {
        const { error } = await res.json();
        toast({
          title: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Reordering Chapter Failed",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setUpdating(false);
      router.refresh();
    }
  };

  const onDragEnd = (res: DropResult) => {
    console.log(res);
    if (res.destination?.index == null) {
      return;
    }
    if (res.source.index == res.destination.index) {
      return;
    }

    const newChapter = Chapter;

    const [tmp] = newChapter.splice(res.source.index, 1);
    newChapter.splice(res.destination.index, 0, tmp);

    const startIndex = Math.min(res.source.index, res.destination.index);
    const endIndex = Math.max(res.source.index, res.destination.index);

    const updatedChapters = newChapter.slice(startIndex, endIndex + 1);

    const bulkUpdate = updatedChapters.map((chapter) => {
      return {
        id: chapter.id,
        position: newChapter.findIndex(
          (nchapter) => chapter.id === nchapter.id
        ),
      };
    });

    setChapter(newChapter);
    onReOrder(bulkUpdate);
  };

  useEffect(()=>{
    setChapter(chapter)
  },[chapter])

  return (
    <form
      className=" bg-secondary p-4 rounded-lg space-y-4 pb-16 relative"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isUpdating && (
        <div className=" absolute bg-slate-500/30 h-full w-full top-0 right-0 rounded-lg flex items-center justify-center">
          <Loader2 className=" animate-spin text-primary h-16 w-16" />
        </div>
      )}

      <div className=" gap-y-2  flex flex-wrap items-center justify-between">
        <Label htmlFor="title" className="font-bold">
          Chapter Name
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
              <PlusCircle size={15} />
              <p className=" ">Add</p>
            </div>
          )}
        </div>
        {isEditing && (
          <div className="basis-full flex gap-x-2 items-center">
            <Input id="title" {...register("name")} />
            <Button disabled={isSubmitting}>Add</Button>
          </div>
        )}
        {errors.name && (
          <p className=" text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>
      <ScrollArea className=" h-96">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="chapters" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <div className=" space-y-2">
                  {Chapter.length == 0 ? (
                    <p className=" text-muted-foreground">No Chapters</p>
                  ) : (
                    chapter.map((chap, index) => {
                      // console.log(chap)
                      return (
                        <Draggable
                          draggableId={chap.id}
                          index={index}
                          key={chap.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className=" flex items-center justify-between pr-2 bg-primary/10 rounded-md gap-x-4 mr-4"
                            >
                              <div className=" flex items-center gap-x-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="hover:bg-primary/30 text-muted-foreground hover:text-muted rounded-l-md  p-2 flex items-center gap-x-2"
                                >
                                  <Grip size={20} className=" " />
                                </div>
                                <p>{chap.name}</p>
                              </div>
                              <div className=" flex items-center gap-x-2  ">
                                {chap.isFree && (
                                  <Badge variant={"outline"}>Free</Badge>
                                )}
                                {chap.isPublished ? (
                                  <Badge>Published</Badge>
                                ) : (
                                  <Badge variant={"secondary"} className="">
                                    Draft
                                  </Badge>
                                )}
                                <Link
                                  href={`/teacher/courses/${id}/chapter/${chap.id}`}
                                >
                                  <Pencil
                                    size={20}
                                    className=" text-muted-foreground"
                                  />
                                </Link>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollArea>
    </form>
  );
};

export default ChapterForm;
