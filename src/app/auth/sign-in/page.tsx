"use client";

import Link from "next/link";

import { login, oauth } from "@/actions/auth";
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
import { UserLogin, userlogin } from "@/lib/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { generateTwoFactorToken } from "@/lib/twoFactor";
import { sendTwoFactorTokenEmail } from "@/lib/mail";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    reset,
  } = useForm<UserLogin>({
    resolver: zodResolver(userlogin),
  });

  const params = useSearchParams();
  const error = params.get("error");

  const [showtwofactor, setshowtwofactor] = useState<boolean>(false);
  const [urlerror, seturlerror] = useState<string>(
    error == "OAuthAccountNotLinked"
      ? "This account is already linked to another provider"
      : ""
  );

  const onSubmit: SubmitHandler<UserLogin> = async (data, e) => {
    seturlerror("");
    const istrue = (
      e?.nativeEvent as SubmitEvent
    ).submitter?.innerText.includes("Google");
    if (istrue) {
      clearErrors();
      await oauth("google");
    } else {
      const res = await login(data);

      if (typeof res === "string") {
        if (res.includes("2FA")) {
          if (res.includes("NoToken") || res.includes("Missing OTP")) {
            const twoFactortoken = await generateTwoFactorToken(data.email);
            await sendTwoFactorTokenEmail(data.email, twoFactortoken.token);
            setshowtwofactor(true);
          } else {
            toast({
              title: "Error",
              description: res.split("2FA:")[1],
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Error",
            description: res,
            variant: "destructive",
          });
        }
      }
    }
  };

  const onError: SubmitErrorHandler<UserLogin> = async (data, e) => {
    seturlerror("");
    const istrue = (
      e?.nativeEvent as SubmitEvent
    ).submitter?.innerText.includes("Google");
    if (istrue) {
      clearErrors();
      await oauth("google");
    }
  };
  return (
    <form
      className=" h-screen flex justif-center items-center"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <Card className="mx-auto max-w-sm min-w-[20rem]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              {!showtwofactor ? "Enter your email below to login to your account":"A 6 digit OTP has been sent to your email address"}
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {!showtwofactor ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    {...register("email")}
                    placeholder="m@example.com"
                  />
                  {errors.email && (
                    <p className=" text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/reset"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                  />
                  {errors.password && (
                    <p className=" text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className=" space-y-2">
                <Input
                  {...register("code")}
                  type="text"
                  placeholder="Enter your 6 digit OTP"
                />{" "}
                {errors.code && (
                  <p className=" text-xs text-red-500">{errors.code.message}</p>
                )}
              </div>
            )}
            {urlerror && (
              <div className=" p-2 bg-red-500/20 rounded-md px-4 font-bold text-red-500">
                {urlerror}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {showtwofactor ? "Confrim" : "Login"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
