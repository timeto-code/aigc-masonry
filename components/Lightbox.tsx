"use client";

import { useStore } from "@/store/useStore";
import { X } from "lucide-react";
import { useState } from "react";

const Lightbox = () => {
  const [isImage, setIsImage] = useState(true); // 默认假设是图片
  const { lightboxImage, lightboxVisible } = useStore((state) => {
    return {
      lightboxVisible: state.lightboxVisible,
      lightboxImage: state.lightboxImage,
    };
  });

  const handleError = () => {
    setIsImage(false); // 如果图片加载失败，切换为视频
  };

  if (!lightboxVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-20 p-2">
      <button
        className="absolute top-3 right-3 cursor-pointer z-30 rounded-full hover:bg-slate-500/50 p-1 text-white/80"
        onClick={() => {
          useStore.getState().setLightboxVisible(false);
          setIsImage(true);
        }}
      >
        <X size={24} />
      </button>
      <div className="relative w-full h-full flex items-center justify-center">
        {isImage && <img src={lightboxImage!.url} className="object-contain max-h-full" alt="" onError={handleError} />} {!isImage && <video src={lightboxImage!.url} className="object-contain max-h-full" controls autoPlay muted loop playsInline onError={handleError} />}
      </div>
    </div>
  );
};

export default Lightbox;
