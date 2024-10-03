"use client";

import useFetchFavoriteImages from "@/hooks/useFetchFavoriteImages";
import useGetFavoriteImages from "@/hooks/useGetFavoriteImages";
import { FavoriteImage } from "@/types/prisma";
import React, { useRef } from "react";
import Loading from "../Loading";
import NoMore from "../NoMore";
import CardMasonry from "./CardMasonry";

const FavoritesMasonry = () => {
  const [images, setImages] = React.useState<FavoriteImage[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { favoriteImageIds } = useGetFavoriteImages();
  const { isFetching } = useFetchFavoriteImages({ scrollContainerRef, setImages });

  if (!isFetching && images.length === 0) {
    return (
      <div className="h-full flex justify-center items-center" ref={scrollContainerRef}>
        <p className="text-lg text-gray-500">无收藏记录</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-4" ref={scrollContainerRef}>
      <CardMasonry images={images} favoriteIds={favoriteImageIds} />
      <NoMore />
      {isFetching && (
        <div className={`flex justify-center items-center mt-4 ${!images.length ? "h-full" : "h-28"}`}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default FavoritesMasonry;
