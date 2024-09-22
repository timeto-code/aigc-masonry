"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Favorites = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        sessionStorage.clear();
        router.push("/favorites");
      }}
      className={`${pathname === "/favorites" ? "text-red-500 hover:text-red-500" : ""}`}
    >
      <Heart size={20} />
    </Button>
  );
};

export default Favorites;
