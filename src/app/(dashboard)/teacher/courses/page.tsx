import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { FC, ReactElement } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await auth();

  if(!session?.user) return <p>Not authenticated</p> 

  const data = await prisma.course.findMany({
    where:{
      userId:session.user.id
    }
  });
  return (
    <section>
      <div className=" p-4">
       
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
};

export default page;
