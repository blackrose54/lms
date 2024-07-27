"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@prisma/client";
import { FC, ReactElement } from "react";
import CategoryItem from "./category-item";

interface categoriesProps {
  categories: Category[];
}

const Categories: FC<categoriesProps> = ({ categories }): ReactElement => {
  
  return (
    <ScrollArea className="md:w-[calc(100vw-22.5rem)] rounded-md border-border border ">
      <div className="flex  space-x-4 overflow-hidden flex-nowrap whitespace-nowrap p-4 ">
        {categories.map((category) => {
          return (
           <CategoryItem category={category} key={category.id}/>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Categories;
