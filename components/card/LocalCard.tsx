import { ExifTags } from "@/lib/api";
import { generateCardPlaceholder } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  img: ExifTags;
}

const LocalCard = ({ img }: Props) => {
  const { placeholderHeight, color1, color2 } = generateCardPlaceholder(img.width!, img.height!);
  const [isImage, setIsImage] = useState(true); // 默认假设是图片

  // 当图片加载失败时触发
  const handleError = () => {
    setIsImage(false); // 如果图片加载失败，切换为视频
  };

  return (
    <div className="rounded-md overflow-hidden relative group">
      {img.type === "video" ? (
        <video
          src={img.url}
          style={{
            width: "320px",
            // height: `${placeholderHeight}px`,
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
      ) : (
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
      )}
    </div>
  );
};

const MemoizedLocalCard = React.memo(LocalCard);

export default MemoizedLocalCard;
