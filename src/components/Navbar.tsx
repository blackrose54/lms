"use client";

import { FC, ReactElement } from "react";
import CreatorMode from "./CreatorMode";
import Logo from "./Logo";
import MobileSidebar from "./MobileSidebar";
import { ModeToggle } from "./themebutton";
import UserAvatar from "./userAvatar";
import SearchBar from "./searchbar";
import { usePathname } from "next/navigation";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}): ReactElement => {
  const pathname = usePathname();
  const isBrowse = pathname.startsWith("/browse");
  return (
    <nav
      className="w-full flex items-center gap-x-4 p-4 border-b-2 border-border sticky z-50 bg-background 
     top-0 h-20 "
    >
      <div className=" flex  space-x-4 items-center md:hidden p-2">
        <MobileSidebar />
        <Logo size={30} />
      </div>
      {isBrowse && (
        <div className=" max-md:hidden w-full">
          <SearchBar />
        </div>
      )}

      <div className="ml-auto flex items-center ">
        <CreatorMode />
        <ModeToggle />
        <UserAvatar />
      </div>
    </nav>
  );
};

export default Navbar;
