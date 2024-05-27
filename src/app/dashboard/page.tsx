'use client'
// import { auth } from "@/auth";
import Logout from "@/components/signOutButton";
import { useSession } from "next-auth/react";

export default function Dashboard(){
    const {data:session,status} = useSession();
    console.log(session,status)
    // const session =await auth()

    return (
        <body className=" h-screen">
            dashboard
            {JSON.stringify(session)}
            <Logout />
        </body>
    )
}