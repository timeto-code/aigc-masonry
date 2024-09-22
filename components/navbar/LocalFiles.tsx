"use client";

import { HardDrive } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const LocalFiles = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        sessionStorage.clear();
        router.push("/local");
      }}
      className={`${pathname === "/local" ? "text-sky-500 hover:text-sky-500" : ""}`}
    >
      <HardDrive size={20} />
    </Button>
  );
};

export default LocalFiles;
