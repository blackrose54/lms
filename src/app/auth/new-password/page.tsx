"use client";

import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { PasswordReset, passwordReset } from "@/lib/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { FC, ReactElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";


const Page = (): ReactElement => {

  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordReset>({
    resolver: zodResolver(passwordReset),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<PasswordReset> = async (data) => {
    const email = params.get("email");
    if (!email)
      return toast({
        title: "Error",
        description: "Email not found",
        variant: "destructive",
      });

    const { status, data: error } = await resetPassword({
      email,
      newPassword: data.confirmPassword,
    });
    if (status === "error") {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Password reset successfully",
        className: " bg-primary text-primary-foreground",
      });
      router.push("/auth/sign-in");
    }
  };

  return (
    <main className=" h-screen flex items-center justify-center">
      <Card className=" min-w-[20rem]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className=" space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className=" space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                {...register("newPassword")}
                id="password"
              />
              {errors.newPassword && (
                <p className=" text-xs text-red-500">
                  {errors.newPassword?.message}
                </p>
              )}
            </div>
            <div className=" space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                type="password"
                id="confirm"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className=" text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button disabled={isSubmitting}>Reset</Button>
          </form>
        </CardContent>
        <CardFooter className=" flex flex-col items-center shadow-lg justify-center">
          <div className=" w-fit group transition duration-300">
            <Link href={"/auth/sign-in"}>Back to login</Link>
            <p className=" h-[2px] bg-ring group-hover:max-w-full transition-all duration-500 max-w-0"></p>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Page;
