import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Component() {
  return (
    <main className=" p-8 flex justify-evenly items-center">
      <Link href={'/auth/sign-in'}><Button>Sign In</Button></Link>
      <Link href={'/auth/sign-up'}><Button>Sign Up</Button></Link>
      
      <Link href={'/dashboard'}><Button>Dashboard</Button></Link>
      
    </main>
  )
}