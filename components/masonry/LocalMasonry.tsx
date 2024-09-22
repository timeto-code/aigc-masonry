"use client";

import { getLocalImages } from "@/actions/local";
import { ExifTags } from "@/lib/api";
import React, { useEffect } from "react";
import "../../styles/masonry.css";
import Loading from "../Loading";
import MuiMasonryLocal from "./MuiMasonryLocal";

const LocalMasonry = () => {
  const [images, setImages] = React.useState<ExifTags[] | null>(null);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);

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

  if (isEmpty) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">No images found</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-4">
      <MuiMasonryLocal images={images!} />
      {isFetching && (
        <div className={`flex justify-center items-center mt-4 ${!images ? "h-full" : "h-28"}`}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default LocalMasonry;
