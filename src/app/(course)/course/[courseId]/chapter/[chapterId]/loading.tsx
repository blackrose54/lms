import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className=" h-full w-full items-center justify-center flex">
        <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}
