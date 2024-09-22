"use client";

import { CivitaiImage, FavoriteImage } from "@/types/prisma";
import Masonry from "react-masonry-css";
import "../../styles/masonry.css";
import MemoizedCivitaiCard from "../card/CivitaiCard";
import { useEffect, useState } from "react";

const breakpointColumnsObj: Record<number | "default", number> = {
  default: 7,
  688: 1,
  1024: 2,
  1360: 3,
  1696: 4,
  2032: 5,
  2368: 6,
  2704: 7,
  3040: 8,
  3376: 9,
};

interface Props {
  images: (CivitaiImage | FavoriteImage)[] | null;
  favoriteIds: string[];
}

const CardMasonry = ({ images, favoriteIds }: Props) => {
  const [columns, setColumns] = useState<Record<number | "default", number>>(breakpointColumnsObj);

  useEffect(() => {
    // 检查 images 数量，如果数量小于当前宽度的列数，列数设置为 images 数量
    const updateColumns = () => {
      // 获取当前窗口宽度
      const windowWidth = window.innerWidth;

      // 根据窗口宽度找到最适合的列数
      let matchedColumns = breakpointColumnsObj.default;
      for (const breakpoint in breakpointColumnsObj) {
        if (windowWidth <= Number(breakpoint)) {
          matchedColumns = breakpointColumnsObj[breakpoint as keyof typeof breakpointColumnsObj];
          break;
        }
      }

      // 如果图片数量小于列数，则列数设置为图片数量
      if (images && images.length < matchedColumns) {
        setColumns({ default: images.length });
      } else {
        setColumns({ ...breakpointColumnsObj });
      }
    };

    // 初始化调用
    updateColumns();

    // 监听窗口大小变化
    window.addEventListener("resize", updateColumns);

    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, [images]);

  return (
    <div className="masonryContainer">
      <Masonry breakpointCols={columns} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        {images?.map((img, index) => (
          <div key={index}>
            <MemoizedCivitaiCard img={img} favoriteIds={favoriteIds} />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default CardMasonry;
