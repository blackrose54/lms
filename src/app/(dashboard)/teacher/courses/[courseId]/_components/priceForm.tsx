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
  price?: number;
  id: string;
}

const formSchema = z.object({
  price: z.coerce.number().min(1),
});

type formschema = z.infer<typeof formSchema>;

const PriceForm: FC<titleFormProps> = ({ price, id }): ReactElement => {
  const [isEditing, setEditing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<formschema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<formschema> = async (data) => {
    console.log(data);
    const res = await fetch(`/api/course/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: data.price  }),
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
          Course Price
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
            <Input
              id="title"
              {...register("price")}
              type="number"
              step={0.01}
            />
            <Button disabled={isSubmitting}>Save</Button>
          </div>
        )}
        {errors.price && (
          <p className=" text-red-500 text-xs">{errors.price.message}</p>
        )}
      </div>
      {!isEditing && (
        <p className=" text-muted-foreground">
          {" "}
          &#8377;
          {" "}
          {price}
        </p>
      )}
    </form>
  );
};

export default PriceForm;
