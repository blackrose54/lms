"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { resendConfirmationEmail, verifyToken } from "@/lib/mail";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Verify() {
  const params = useSearchParams();
  const [resend, setresend] = useState<boolean>(false);
  const [email, setemail] = useState<string>("");
  const [submit, setsubmit] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      try {
        const parsedData = JSON.parse(atob(token));
        if (!parsedData.email || !parsedData.token) {
          toast({
            title: "Error",
            description: "Invalid token",
            variant: "destructive",
          });
        } else {
          const { email, token } = parsedData;
          verifyToken({ email, token })
            .then((res) => {
              if (res) {
                toast({
                  title: "Success",
                  description: "Your account has been verified",
                  className: " bg-primary text-primary-foreground",
                });
                router.push("/auth/sign-in");
                return
              } 
            })
            .catch(() =>{
              toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
              })}
            );
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid token",
          variant: "destructive",
        });
      }
    }
  }, []);

  return (
    <main className=" flex items-center justify-center h-screen">
      <Card className=" min-w-72">
        <CardHeader>
          <CardTitle className=" text-center ">Confirm Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className=" text-muted-foreground">
            Click on the link sent to your email to activate your account
          </p>
          <Button
            variant={"link"}
            className=" p-0"
            onClick={() => setresend(true)}
          >
            Resend Verification Token
          </Button>
          {resend && (
            <form
              className=" flex gap-x-2"
              onSubmit={async (e) => {
                e.preventDefault();
                setsubmit(true);

                const res = await resendConfirmationEmail(email);
                if (res) {
                  toast({
                    title: "Success",
                    description: "Verification email sent",
                    className: " bg-primary text-primary-foreground",
                  });
                } else {
                  toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive",
                  });
                  setsubmit(false);
                }
                setTimeout(() => {
                  setsubmit(false);
                }, 120 * 1000);
              }}
            >
              <Input
                disabled={submit}
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <Button disabled={submit}>Resend</Button>
            </form>
          )}
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
}
