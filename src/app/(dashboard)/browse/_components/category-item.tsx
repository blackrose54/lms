'use client'

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import qs from 'query-string'
import { useDebounce } from "@/hooks/useDebounce";

interface props {
  category: Category;
}
function CategoryItem({ category }: props) {
    const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname()

  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');

  const isSelected = Number(currentCategoryId) === category.id

  const onClick = () => {
    const url = qs.stringifyUrl({
        url:pathname,
        query:{
            categoryId: isSelected ? null:category.id,
            title: currentTitle
        }
    },{skipNull:true,skipEmptyString:true})
    router.replace(url);
  };
  return (
    <div onClick={onClick} key={category.id} className={cn("cursor-pointer hover:bg-secondary border-2 border-border rounded-md px-4 py-1 flex items-center gap-x-2",isSelected ? "bg-secondary border-ring/50":null)}>
      <span
        className=" h-8 w-8"
        dangerouslySetInnerHTML={{ __html: category.svg }}
      />
      <p>{category.title}</p>
    </div>
  );
}

export default CategoryItem;
