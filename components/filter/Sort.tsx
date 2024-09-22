"use client";

import { SORT, useFilterStore } from "@/store/useFilterStore";
import { ArrowDownWideNarrow } from "lucide-react";
import OptionButton from "./OptionButton";

const Sort = () => {
  const handleClick = (value: SORT) => {
    useFilterStore.getState().setSort(value);
    sessionStorage.setItem("sort", value);
  };

  return (
    <div className="flex items-center space-x-2">
      <ArrowDownWideNarrow size={20} />
      <OptionButton option={SORT.MostReactions} onClick={() => handleClick(SORT.MostReactions)} />
      <OptionButton option={SORT.MostComments} onClick={() => handleClick(SORT.MostComments)} />
      <OptionButton option={SORT.Newest} onClick={() => handleClick(SORT.Newest)} />
    </div>
  );
};

export default Sort;
