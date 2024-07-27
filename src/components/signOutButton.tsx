"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Logout() {
  return (
    <div className=" cursor-pointer" onClick={() => signOut()}>
      Sign Out
    </div>
  );
}
