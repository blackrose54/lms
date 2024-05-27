"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { sendPasswordResetMail } from "@/lib/mail";
import Link from "next/link";
import React, { FC, ReactElement, useState, useTransition } from "react";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const [email, setemail] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, seterror] = useState<string>("");
  return (
    <main className=" h-screen flex items-center justify-center">
      <Card>
        <CardHeader className=" text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Forgot your Password ?</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className=" flex gap-x-2"
            action={async () => {
              if (!email) seterror("Please enter an email address");
              startTransition(async () => {
                if (email) seterror("");
                const res = await sendPasswordResetMail(email);
                console.log(res);
                if (res)
                  toast({
                    title: "Success",
                    description: "Password reset email sent",
                    className: " bg-primary text-primary-foreground",
                  });
                else
                  toast({
                    title: "Error",
                    description: "User not found",
                    variant: "destructive",
                  });
              });
            }}
          >
            <Input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Button disabled={isPending}>Reset</Button>
          </form>
          <p className=" text-red-500 text-xs">{error}</p>
        </CardContent>
        <CardFooter>
          <p>
            Already have an Account?{" "}
            <Link
              href={"/auth/sign-in"}
              className=" underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Page;
