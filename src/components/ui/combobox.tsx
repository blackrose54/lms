"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommandList } from "cmdk"
import { ScrollArea } from "./scroll-area"


export function Combobox({data,value,setValue}:{data:{title:string,id:string}[],setValue:Function,value:{title:string,id:string}}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.id
            ? data.find((framework) => framework.title === value.title)?.title
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No Category found.</CommandEmpty>
          <CommandGroup>
             <ScrollArea className=" h-48"> 
            <CommandList>
            {data.map((category) => (
              <CommandItem
                key={category.title}
                value={category.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value.id ? "" : category)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.title === category.title ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.title}
              </CommandItem>
            ))}
            </CommandList>
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
