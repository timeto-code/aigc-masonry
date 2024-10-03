"use client";

import { NSFW, useFilterStore } from "@/store/useFilterStore";
import { ScanEye } from "lucide-react";
import OptionButton from "./OptionButton";
import { usePathname } from "next/navigation";

const Nsfw = () => {
  const nsfw = useFilterStore((state) => state.nsfw);
  const favorNsfw = useFilterStore((state) => state.favorNsfw);
  const pathName = usePathname();

  const handleClick = (value: NSFW) => {
    if (pathName === "/civitai") {
      useFilterStore.getState().setNsfw(value);
      return sessionStorage.setItem("nsfw", value);
    }
    if (pathName === "/favorites") {
      useFilterStore.getState().setFavorNsfw(value);
      return sessionStorage.setItem("favorNsfw", value);
    }
  };

  return (
    <div className="flex  items-center space-x-2">
      <ScanEye size={20} />

      {pathName === "/civitai" ? (
        <button className={`btn-filter ${nsfw === "false" ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.None)}>
          None
        </button>
      ) : (
        <button className={`btn-filter ${favorNsfw === "false" ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.None)}>
          None
        </button>
      )}

      <OptionButton option={NSFW.Soft} onClick={() => handleClick(NSFW.Soft)} />
      <OptionButton option={NSFW.Mature} onClick={() => handleClick(NSFW.Mature)} />
      <OptionButton option={NSFW.X} onClick={() => handleClick(NSFW.X)} />

      {pathName === "/civitai" ? (
        <button className={`btn-filter ${nsfw === "true" ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.Only)}>
          Only
        </button>
      ) : (
        <button className={`btn-filter ${favorNsfw === "true" ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.Only)}>
          Only
        </button>
      )}

      {pathName === "/favorites" && (
        <button className={`btn-filter ${favorNsfw === NSFW.All ? "btn-filter-active" : ""}`} onClick={() => handleClick(NSFW.All)}>
          All
        </button>
      )}
    </div>
  );
};

export default Nsfw;
