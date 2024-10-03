"use client";

import { getLocalImages } from "@/actions/local";
import useScrollEvent from "@/hooks/useScrollEvent";
import { ExifTags } from "@/lib/api";
import { useStore } from "@/store/useStore";
import React, { useEffect, useRef } from "react";
import "../../styles/masonry.css";
import Loading from "../Loading";
import NoMore from "../NoMore";
import MuiMasonryLocal from "./MuiMasonryLocal";

const LocalMasonry = () => {
  const [images, setImages] = React.useState<ExifTags[] | null>(null);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useScrollEvent(scrollContainerRef);
  const isScrollBottom = useStore((state) => state.isScrollBottom);

  useEffect(() => {
    const fetchImages = async () => {
      setIsFetching(true);
      const localImages = await getLocalImages();
      if (localImages.code === 1 && localImages.data) {
        if (localImages.data.length === 0) {
          setIsEmpty(true);
        } else {
          setImages(localImages.data);
        }
      } else {
        // 其他逻辑
      }
      setIsFetching(false);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    useStore.setState({ noMore: isScrollBottom });
  }, [isScrollBottom]);

  if (isEmpty) {
    return (
      <div className="flex justify-center items-center h-full" ref={scrollContainerRef}>
        <p className="text-lg text-gray-500">无本地资源</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-4" ref={scrollContainerRef}>
      <MuiMasonryLocal images={images!} />
      <NoMore />
      {isFetching && (
        <div className={`flex justify-center items-center mt-4 ${!images ? "h-full" : "h-28"}`}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default LocalMasonry;
