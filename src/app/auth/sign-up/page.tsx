"use client";

import Link from "next/link";

import { oauth, signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { sendConformationMail } from "@/lib/mail";
import { UserSignUp, userSignUp } from "@/lib/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<UserSignUp>({
    resolver: zodResolver(userSignUp),
  });

  const onSubmit: SubmitHandler<UserSignUp> = async (data, e) => {
    const istrue = (
      e?.nativeEvent as SubmitEvent
    ).submitter?.innerText.includes("Google");
    if (istrue) {
      await oauth("google")
      clearErrors();
    } else {
      const res = await signUp(data);
      if (res.status === "success") {
        await sendConformationMail(data.email);

        toast({
          title: "Confrim your email",
          description: res.data,
          className: "bg-primary text-primary-foreground",
        });
      } else {
        toast({
          title: "Error",
          description: res.data,
          variant: "destructive",
        });
      }
    }
  };

  const onError: SubmitErrorHandler<UserSignUp> = (data, e) => {
    const istrue = (
      e?.nativeEvent as SubmitEvent
    ).submitter?.innerText.includes("Google");
    if (istrue) {
      console.log("hi");
      clearErrors();
    }
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm ">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div className="grid gap-4">
              <Label htmlFor="first-name">Name</Label>
              <Input id="first-name" placeholder="Max" {...register("name")} />

              {errors.name && (
                <p className=" text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className=" text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />

              {errors.password && (
                <p className=" text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Create an account
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Sign up with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
