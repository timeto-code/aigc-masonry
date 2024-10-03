"use client";

import { PERIOD, useFilterStore } from "@/store/useFilterStore";
import { CalendarRange } from "lucide-react";
import OptionButton from "./OptionButton";

const Period = () => {
  const handleClick = (value: PERIOD) => {
    useFilterStore.getState().setPeriod(value);
    sessionStorage.setItem("period", value);
  };

  return (
    <div className="flex items-center space-x-2">
      <CalendarRange size={20} />
      <OptionButton option={PERIOD.AllTime} onClick={() => handleClick(PERIOD.AllTime)} />
      <OptionButton option={PERIOD.Year} onClick={() => handleClick(PERIOD.Year)} />
      <OptionButton option={PERIOD.Month} onClick={() => handleClick(PERIOD.Month)} />
      <OptionButton option={PERIOD.Week} onClick={() => handleClick(PERIOD.Week)} />
      <OptionButton option={PERIOD.Day} onClick={() => handleClick(PERIOD.Day)} />
    </div>
  );
};

export default Period;
