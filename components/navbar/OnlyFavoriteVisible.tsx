"use client";

import { useStore } from "@/store/useStore";
import { Star, StarOff } from "lucide-react";
import { Button } from "../ui/button";

const OnlyFavoriteVisible = () => {
  const onlyFavoriteVisible = useStore((state) => state.onlyFavoriteVisible);

  return (
    <Button variant="ghost" size="icon" onClick={() => useStore.getState().setOnlyFavoriteVisible(!onlyFavoriteVisible)}>
      {onlyFavoriteVisible ? <Star size={18} /> : <StarOff size={18} />}
    </Button>
  );
};

export default OnlyFavoriteVisible;
