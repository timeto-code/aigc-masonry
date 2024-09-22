import { getAllFavorites } from "@/actions/favorite";
import { useEffect, useState } from "react";

const useGetFavoriteImages = () => {
  const [refreshToken, refreshFavoriteImageIds] = useState<number>(0);
  const [favoriteImageIds, setFavoriteImageIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const imgs = await getAllFavorites();
      if (imgs.code === 1 && imgs.data) {
        setFavoriteImageIds(imgs.data.map((img) => img.civitaiId.toString()));
      } else {
        // 其他逻辑
      }
    };

    fetchData();
  }, [refreshToken]);

  return { favoriteImageIds, refreshFavoriteImageIds };
};

export default useGetFavoriteImages;
