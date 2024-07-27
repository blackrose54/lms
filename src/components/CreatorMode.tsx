"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { FC, ReactElement } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface CreatorModeProps {}

const CreatorMode: FC<CreatorModeProps> = ({}): ReactElement => {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith("/teacher");
  const router = useRouter();
  return (
    <div className=" text-sm">
      <Button
        variant={isTeacher ? "outline" : "default"}
        onClick={() => {
          if (isTeacher) {
            router.push("/dashboard");
          } else {
            router.push("/teacher/courses");
          }
        }}
        className=" space-x-2 "
      >
        {isTeacher ? <LogOut size={20} /> : null}
       <p> {!isTeacher ? "Teacher Mode" : "Exit"}</p>
      </Button>
    </div>
  );
};

export default CreatorMode;
