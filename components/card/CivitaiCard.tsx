import { generateCardPlaceholder } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { CivitaiImage, FavoriteImage } from "@/types/prisma";
import Image from "next/image";
import React, { useState } from "react";
import Download, { DOWNLOAD_STATUS } from "./Download";
import Favorite from "./Favorite";
import Stats from "./Stats";

interface Props {
  img: CivitaiImage | FavoriteImage;
  favoriteIds: string[];
}

const CivitaiCard = ({ img, favoriteIds }: Props) => {
  const { placeholderHeight, color1, color2 } = generateCardPlaceholder(img.width!, img.height!);
  const [isImage, setIsImage] = useState(true); // 默认假设是图片

  // 下载状态
  const [progress, setProgress] = useState(0); // 用于存储下载进度
  const [status, setStatus] = useState<DOWNLOAD_STATUS>("None");

  // 当图片加载失败时触发
  const handleError = () => {
    setIsImage(false); // 如果图片加载失败，切换为视频
  };

  return (
    <div className="rounded-md overflow-hidden relative group">
      <Favorite img={img} favoriteIds={favoriteIds} setProgress={setProgress} setStatus={setStatus} />
      {isImage ? (
        <Image
          src={img.url}
          alt="img"
          width={320}
          height={placeholderHeight}
          priority
          quality={100}
          style={{
            background: `linear-gradient(135deg, ${color1}, ${color2})`,
          }}
          onError={handleError}
          onClick={() => {
            useStore.getState().setLightboxImage(img);
          }}
        />
      ) : (
        <video
          src={img.url}
          style={{
            width: "320px",
            height: `${placeholderHeight}px`,
            background: `linear-gradient(135deg, ${color1}, ${color2})`,
          }}
          autoPlay
          loop
          muted
          playsInline
          onClick={() => {
            useStore.getState().setLightboxImage(img);
          }}
        />
      )}

      <Stats img={img} />
      <Download url={img.url} progress={progress} setProgress={setProgress} status={status} setStatus={setStatus} />
    </div>
  );
};

const MemoizedCivitaiCard = React.memo(CivitaiCard);

export default MemoizedCivitaiCard;
