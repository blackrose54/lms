"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, ReactElement, useEffect, useState } from "react";

interface categoryFormProps {
  id: string;
  category?: { title: string; id: number };
  data: { title: string; id: number }[];
}

const CategoryForm: FC<categoryFormProps> = ({
  id,
  category,
  data,
}): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [value, setValue] = useState<(typeof data)[0]>({
    title: "",
    id: -1,
  });
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [errors, seterrors] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    if (value.id != -1) {
      seterrors("");
    }
  }, [value]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     if (value.id == -1) {
      return seterrors("Required");
    }
    try {
      setSubmitting(true)
      const res = await fetch(`/api/course/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId: value.id }),
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
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
   
  };
  return (
    <form
      className=" bg-secondary p-4 rounded-lg space-y-4"
      onSubmit={onSubmit}
    >
      <div className=" gap-y-2  flex flex-wrap items-center justify-between">
        <Label htmlFor="category" className="font-bold">
          Course category
        </Label>
        <div className="cursor-pointer select-none">
          {isEditing ? (
            <p
              onClick={() => {
                setEditing(false);
                seterrors("");
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
        {isEditing && (
          <div className="basis-full flex gap-x-2 items-center justify-between">
            <Combobox data={data.map((item)=>(
              {
                title: item.title,
                id: String(item.id),
              }
            ))} value={{title:value.title,id:String(value.id)}} setValue={setValue} />
            <Button disabled={isSubmitting}>Save</Button>
          </div>
        )}

        {errors && <p className=" text-red-500 text-xs basis-full">{errors}</p>}
      </div>
      {!isEditing && (
        <p className=" text-muted-foreground">
          {category?.title ?? "Please select a category"}
        </p>
      )}
    </form>
  );
};

export default CategoryForm;
