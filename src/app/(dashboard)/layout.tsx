import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen flex ">
      <div className="h-full fixed  left-0 overflow-y-auto w-[20rem] max-md:hidden border-r-2 border-border ">
        <Sidebar />
      </div>

      <div className="h-full w-full md:ml-[20rem]  ">
        <Navbar />
        <div className=" max-w-full overflow-x-hidden  ">

        {children}
        </div>
      </div>
    </main>
  );
}
