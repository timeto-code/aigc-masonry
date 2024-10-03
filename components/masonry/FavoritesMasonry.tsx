"use client";

import useFavoriteImages from "@/hooks/useFetchFavoriteImages";
import { FavoriteImage } from "@/types/prisma";
import React, { useRef } from "react";
import Loading from "../Loading";
import CardMasonry from "./CardMasonry";

const FavoritesMasonry = () => {
  const [images, setImages] = React.useState<FavoriteImage[] | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isFetching, isEmpty, favoriteImageIds } = useFavoriteImages({ scrollContainerRef, setImages });

  if (isEmpty) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">No images found</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-4" ref={scrollContainerRef}>
      <CardMasonry images={images} favoriteIds={favoriteImageIds} />
      {isFetching && (
        <div className={`flex justify-center items-center mt-4 ${!images ? "h-full" : "h-28"}`}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default FavoritesMasonry;
