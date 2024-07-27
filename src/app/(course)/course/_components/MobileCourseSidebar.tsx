import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import CourseSidebar from '@/app/(course)/course/_components/CourseSidebar';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { Chapter, Purchase } from '@prisma/client';

interface SidebarProps {
  chapters: Chapter[];
  coursetitle: string;
  purchase: Purchase | null;
}

export default async function MobileCourseSidebar({chapters,coursetitle,purchase}:SidebarProps) {
 
  return (
    <Sheet>
    <SheetTrigger>
      <Menu />
    </SheetTrigger>
    <SheetContent side={"left"} className=" border-border p-0">
      <CourseSidebar chapters={chapters} coursetitle={coursetitle} purchase={purchase} />
    </SheetContent>
  </Sheet>
  )
}
