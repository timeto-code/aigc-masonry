"use client";

import logo from "@/public/CivitaiLogoColor.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Civitai = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      className={`flex justify-center py-2`}
      onClick={() => {
        sessionStorage.clear();
        router.push("/civitai");
      }}
    >
      <Image src={logo} alt="Civitai" width={20} height={20} className={`filter  transition-all duration-300 ${pathname === "/civitai" ? "grayscale-[50%]" : "grayscale hover:grayscale-[50%]"}`} />
    </button>
  );
};

export default Civitai;
