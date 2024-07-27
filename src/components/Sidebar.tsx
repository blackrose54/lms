"use client";

import React, { FC, ReactElement, useMemo } from "react";
import Logo from "./Logo";
import { BarChart, Compass, List, PanelsTopLeft } from "lucide-react";
import SideBarItem from "./sidebar-item";
import { useParams, usePathname } from "next/navigation";
import { getChapters } from "@/actions/getChapters";

interface SidebarProps {}

const sideBarData = [
  {
    title: "Dashboard",
    Icon: PanelsTopLeft,
    href: "/dashboard",
  },
  {
    title: "Browse",
    Icon: Compass,
    href: "/browse",
  },
];

const sideBarTeacher = [
  {
    title: "Courses",
    Icon: List,
    href: "/teacher/courses",
  },
  {
    title: "Analytics",
    Icon: BarChart,
    href: "/teacher/analytics",
  },
];

const Sidebar: FC<SidebarProps> = ({}): ReactElement => {
  const pathname = usePathname();
  return (
    <main className="space-y-6 flex flex-col">
      <div className=" m-4">
        <Logo />
      </div>
      <div>
        {pathname.startsWith("/teacher")
          ? sideBarTeacher.map(({ title, Icon, href }) => (
              <SideBarItem title={title} Icon={Icon} href={href} key={href} />
            ))
          : sideBarData.map(({ title, Icon, href }) => (
              <SideBarItem title={title} Icon={Icon} href={href} key={href} />
            ))}
      </div>
    </main>
  );
};

export default Sidebar;
