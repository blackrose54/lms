'use client'

import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from 'query-string';
import { useEffect, useState } from "react";

function SearchBar() {
    const [value,setvalue] = useState<string>("")
    const debounceValue = useDebounce(value)

    const serachParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const currentCategoryId = serachParams.get('categoryId')

    useEffect(()=>{
        const url = qs.stringifyUrl({
            url:pathname,
            query:{
                categoryId:currentCategoryId,
                title:debounceValue
            }
        },{skipEmptyString:true,skipNull:true})

        router.replace(url)
    },[currentCategoryId, debounceValue, pathname, router])
  return (
    <div
      className=" border-2 focus-within:ring-2 focus-within:ring-primary border-border w-full px-2 rounded-lg flex gap-x-2 items-center"
    >
      <Search className=" text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e)=>setvalue(e.target.value)}
        className=" p-2 w-full  focus-visible:outline-none text-ellipsis"
        placeholder="Search for a Course"
      />
    </div>
  );
}

export default SearchBar;
