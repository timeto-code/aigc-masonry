"use client";

import { NSFW, useFilterStore } from "@/store/useFilterStore";
import { ScanEye } from "lucide-react";
import OptionButton from "./OptionButton";
import { usePathname } from "next/navigation";

const Nsfw = () => {
  const nsfw = useFilterStore((state) => state.nsfw);
  const pathName = usePathname();

  const handleClick = (value: NSFW) => {
    useFilterStore.getState().setNsfw(value);
    sessionStorage.setItem("nsfw", value);
  };

  return (
    <div className="flex  items-center space-x-2">
      <ScanEye size={20} />
      <button className={`btn-filter ${nsfw === "false" ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.None)}>
        None
      </button>
      <OptionButton option={NSFW.Soft} onClick={() => handleClick(NSFW.Soft)} />
      <OptionButton option={NSFW.Mature} onClick={() => handleClick(NSFW.Mature)} />
      <OptionButton option={NSFW.X} onClick={() => handleClick(NSFW.X)} />
      <button className={`btn-filter ${nsfw === "true" ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.Only)}>
        Only
      </button>

      {pathName === "/favorites" && (
        <button className={`btn-filter ${nsfw === NSFW.All ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.All)}>
          All
        </button>
      )}
    </div>
  );
};

export default Nsfw;
