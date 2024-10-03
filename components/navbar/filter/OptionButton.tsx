import { useFilterStore } from "@/store/useFilterStore";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  option: string;
  onClick: () => void;
}

const OptionButton = ({ option, onClick }: Props) => {
  const pathName = usePathname();

  const { sort, period, nsfw, favorNsfw } = useFilterStore((state) => {
    return {
      sort: state.sort,
      period: state.period,
      nsfw: state.nsfw,
      favorNsfw: state.favorNsfw,
    };
  });
  return (
    <>
      {pathName === "/civitai" ? (
        <button className={`btn-filter ${sort === option || period === option || nsfw === option ? "btn-filter-active" : ""}`} onClick={onClick}>
          {option}
        </button>
      ) : (
        <button className={`btn-filter ${sort === option || period === option || favorNsfw === option ? "btn-filter-active" : ""}`} onClick={onClick}>
          {option}
        </button>
      )}
    </>
  );
};

export default OptionButton;
