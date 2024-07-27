'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { newCourse } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, ReactElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface pageProps {}

const NewCourse: FC<pageProps> = ({}): ReactElement => {
 
  const {
    register,
    handleSubmit,
    formState:{errors,isSubmitting}

  } = useForm<newCourse>({
    resolver:zodResolver(newCourse)
  }
  )
   
  const router = useRouter();
  const onSubmit:SubmitHandler<newCourse> = async (data)=>{
    const res = await fetch('/api/course',{
      method:'POST',
      body:JSON.stringify(data),
      headers:{
        'Content-Type':'application/json'
      }
    })
    
    if(res.ok){
      const {id} = await res.json();
       router.push(`/teacher/courses/${id}`);
    }else{
      const {error} = await res.json();
      toast({
        title:error,
        variant:'destructive'
      })
    }
  }

  return (
    <div className="h-fit md:w-[50%] max-md:mx-6 my-[15%] md:mx-auto border-border border-2 p-6 rounded-lg shadow-sm">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1 className=" text-2xl font-semibold">Name Your Course</h1>
          <p className=" text-muted-foreground">
            What would you like to name this course? You can change it later
          </p>
        </div>
        <div className=" space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            type="text"
            placeholder='e.g. "Advanced Web Development"'
            {...register('title')}

          />
          {errors.title && <p className=" text-red-500 text-xs">{errors.title.message}</p>}
          <p className=" text-muted-foreground">
            What will you teach in this course
          </p>
        </div>
        <div className=" flex items-center gap-x-4">
          <Button variant={"secondary"} disabled={isSubmitting} type="reset" onClick={()=>router.back()}>Cancel</Button>
          <Button disabled={isSubmitting} type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
};

export default NewCourse;
