import { ModeToggle } from "@/components/themebutton";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({children}:{children:ReactNode}){
    return(
        <main>
            <nav className=" flex gap-x-4 items-center py-2 px-8">
                <Link href={'/'}><h1>V0</h1></Link>
                <ModeToggle />
            </nav>
           {children} 
        </main>
    )
}