"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FC } from "react";
import Logout from "./signOutButton";
import { useSession } from "next-auth/react";

interface userAvatarProps {}

const UserAvatar: FC<userAvatarProps> = ({}) => {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" focus-visible:outline-0">
        <Avatar>
          <AvatarImage
            src={
              session?.user?.image
                ? session.user.image
                : "https://github.com/shadcn.png"
            }
          />
          <AvatarFallback>cn</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" border-border">
        <DropdownMenuLabel>my account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=" cursor-pointer">profile</DropdownMenuItem>
        <DropdownMenuItem>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
