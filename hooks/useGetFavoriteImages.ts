import { getAllFavorites } from "@/actions/favorite";
import { FavoriteImage } from "@/types/prisma";
import { useEffect, useState } from "react";

const useGetFavoriteImages = () => {
  const [favoriteImages, setFavoriteImages] = useState<FavoriteImage[] | null>(null);
  const [favoriteImageIds, setFavoriteImageIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const imgs = await getAllFavorites();
      if (imgs.code === 1 && imgs.data) {
        setFavoriteImages(imgs.data);
        setFavoriteImageIds(imgs.data.map((img) => img.civitaiId.toString()));
      } else {
        // 其他逻辑
      }
    };

    fetchData();
  }, []);

  return { favoriteImages, favoriteImageIds };
};

export default useGetFavoriteImages;
