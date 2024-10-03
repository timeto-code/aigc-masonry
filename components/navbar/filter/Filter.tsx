"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../../ui/button";
import Nsfw from "./Nsfw";
import Period from "./Period";
import Sort from "./Sort";

const Filter = () => {
  const pathName = usePathname();

  if (pathName === "/local") {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <SlidersHorizontal size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="ml-2 p-4 space-y-5" side="top">
        {pathName === "/civitai" && (
          <>
            <Period />
            <Sort />
          </>
        )}
        <Nsfw />
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
