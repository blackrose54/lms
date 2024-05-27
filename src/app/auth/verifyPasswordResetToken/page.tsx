"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "@/components/ui/use-toast";
import { verifyPasswordResetToken } from "@/lib/mail";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, ReactElement, useEffect, useState } from "react";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  const params = useSearchParams();
  const router = useRouter();
  const [spin,setspin] = useState<boolean>(true);
  useEffect(() => {
    
    try {
      const token = params.get("token");

      if (token) {
        const parsedData = JSON.parse(atob(token));
        if (!parsedData.email || !parsedData.token) {
          toast({
            title: "Error",
            description: "Invalid token",
            variant: "destructive",
          });
          setspin(false);
        } else {
          const { email, token } = parsedData;
          verifyPasswordResetToken({ email, token })            
            .then((res) => {
                console.log(res)
              if (res) {
                router.push(`/auth/new-password?email=${email}`);
                toast({
                    title:"Redirecting ...",
                })
              }
               else{ 
                console.log('hi')
                toast({
                  title: "Error",
                  description: "Invalid token",
                  variant: "destructive",
                });
                setspin(false);
               }

            })
            .catch(() => {
              toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
              });
            }).finally(()=>setspin(false));
        }
      }
    } catch (error) {
        console.log('try')
      toast({
        title: "Error",
        description: "Invalid token",
        variant: "destructive",
      });
      setspin(false);
    }

    
  }, [params, router]);
  return (
    <main className=" h-screen flex items-center justify-center ">
      <Card>
        <CardHeader>
          <CardTitle>Verifying Your Request</CardTitle>
        </CardHeader>
        <CardContent className=" flex justify-center" >
          {spin && <Loader2 className={`${spin?"animate-spin":""}`} size={50} />}
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
