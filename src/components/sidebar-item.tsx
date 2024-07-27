"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import React, { FC, ReactElement, useEffect, useState } from "react";

const SideBarItem = ({
  title,
  Icon,
  href,
}: {
  title: string;
  Icon: LucideIcon;
  href: string;
}): ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  const [isActive, setisActive] = useState<boolean>(false);
  useEffect(() => {
    if (pathname.includes(href)) setisActive(true);
    else setisActive(false);
  }, [href, pathname]);
  return (
    <main>
      <div
        key={title}
        className={`flex items-center p-4 ${
            isActive
            ? "bg-primary/10 border-r-4 border-primary text-lg text-primary"
            : null
        } font-semibold hover:bg-primary/5 justify-left cursor-pointer transition-all space-x-2`}
        onClick={() => router.push(href)}
      >
        <div>
          <Icon />
        </div>
        <button>{title}</button>
      </div>
    </main>
  );
};

export default SideBarItem;
