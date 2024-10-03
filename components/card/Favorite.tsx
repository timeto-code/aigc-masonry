import { favoriteImage } from "@/actions/favorite";
import { useStore } from "@/store/useStore";
import { CivitaiImage, FavoriteImage } from "@/types/prisma";
import { useState } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { DOWNLOAD_STATUS, downloadImage } from "./Download";

interface Props {
  img: CivitaiImage | FavoriteImage;
  favoriteIds: string[];
  setProgress: (progress: number) => void;
  setStatus: (status: DOWNLOAD_STATUS) => void;
}

const Favorite = ({ img, favoriteIds, setProgress, setStatus }: Props) => {
  const isFavImg = favoriteIds.includes(img.civitaiId.toString());
  const [isFavorite, setIsFavorite] = useState(isFavImg);

  const { onlyFavoriteVisible, favoriteVisible } = useStore((state) => {
    return {
      onlyFavoriteVisible: state.onlyFavoriteVisible,
      favoriteVisible: state.favoriteVisible,
    };
  });

  const handleFavorite = async () => {
    const favoriteImageResult = await favoriteImage(img.civitaiId, !isFavorite);
    if (favoriteImageResult.code === 1) {
      setIsFavorite((prev) => !prev);

      if (!isFavorite) {
        await downloadImage(img.url, setProgress, setStatus);
      }
    } else {
      // 其他逻辑
    }
  };

  return (
    <div className={`${favoriteVisible ? "" : `${onlyFavoriteVisible ? "" : "opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible"}`}`}>
      <button className={`absolute right-0 top-0 p-3 rounded-full z-10 hover:text-red-600 ${isFavorite ? `text-red-600` : `text-white/70`}`} onClick={handleFavorite}>
        {isFavorite ? <IoMdHeart size={18} /> : <IoMdHeartEmpty size={18} />}
      </button>
    </div>
  );
};

export default Favorite;
