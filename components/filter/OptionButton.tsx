import { useFilterStore } from "@/store/useFilterStore";
import React from "react";

interface Props {
  option: string;
  onClick: () => void;
}

const OptionButton = ({ option, onClick }: Props) => {
  const { sort, period, nsfw } = useFilterStore((state) => {
    return {
      sort: state.sort,
      period: state.period,
      nsfw: state.nsfw,
    };
  });
  return (
    <button className={`btn-filter ${sort === option || period === option || nsfw === option ? "btn-filter-active" : ""}`} onClick={onClick}>
      {option}
    </button>
  );
};

export default OptionButton;
