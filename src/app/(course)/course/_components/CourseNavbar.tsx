
import { Chapter, Purchase } from "@prisma/client";
import { FC, ReactElement } from "react";
import CreatorMode from "../../../../components/CreatorMode";
import Logo from "../../../../components/Logo";
import { ModeToggle } from "../../../../components/themebutton";
import UserAvatar from "../../../../components/userAvatar";
import MobileCourseSidebar from "./MobileCourseSidebar";


interface NavbarProps {
  chapters: Chapter[];
  coursetitle: string;
  purchase: Purchase | null;
}

const CourseNavbar: FC<NavbarProps> = ({chapters,coursetitle,purchase}): ReactElement => {
  return (
    <nav
      className="w-full flex items-center gap-x-4 p-4 border-b-2 border-border sticky z-50 bg-background 
     top-0 h-20 "
    >
      <div className=" flex  space-x-4 items-center md:hidden p-2">
        <MobileCourseSidebar chapters={chapters} coursetitle={coursetitle} purchase={purchase} />
        <Logo size={30} />
      </div>
      

      <div className="ml-auto flex items-center ">
        <CreatorMode />
        <ModeToggle />
        <UserAvatar />
      </div>
    </nav>
  );
};

export default CourseNavbar;
