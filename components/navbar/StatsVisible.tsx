"use client";

import { useStore } from "@/store/useStore";
import { Zap, ZapOff } from "lucide-react";
import { Button } from "../ui/button";

const StatsVisible = () => {
  const statsVisible = useStore((state) => state.statsVisible);

  return (
    <Button variant="ghost" size="icon" onClick={() => useStore.getState().setVisible(!statsVisible)}>
      {statsVisible ? <Zap size={20} /> : <ZapOff size={20} />}
    </Button>
  );
};

export default StatsVisible;
