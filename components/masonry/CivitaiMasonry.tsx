"use client";

import useFetchCivitaiImages from "@/hooks/useFetchCivitaiImages";
import useGetFavoriteImages from "@/hooks/useGetFavoriteImages";
import { CivitaiImage } from "@/types/prisma";
import React, { useRef } from "react";
import Loading from "../Loading";
import RestoreScrollButton from "../RestoreScrollButton";
import CardMasonry from "./CardMasonry";

const CivitaiMasonry = () => {
  const [images, setImages] = React.useState<CivitaiImage[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { favoriteImageIds } = useGetFavoriteImages();
  const { isFetching } = useFetchCivitaiImages({ scrollContainerRef, setImages });

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-4" ref={scrollContainerRef}>
      <CardMasonry images={images} favoriteIds={favoriteImageIds} />
      <RestoreScrollButton scrollContainerRef={scrollContainerRef} />
      {isFetching && (
        <div className={`flex justify-center items-center mt-4 ${images.length === 0 ? "h-full" : "h-28"}`}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CivitaiMasonry;
