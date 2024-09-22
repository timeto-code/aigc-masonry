"use client";

import { getFavoritesByFilter } from "@/actions/favorite";
import useGetFavoriteImages from "@/hooks/useGetFavoriteImages";
import useScrollEvent from "@/hooks/useScrollEvent";
import { useFilterStore } from "@/store/useFilterStore";
import { useStore } from "@/store/useStore";
import { FavoriteImage } from "@/types/prisma";
import React, { useCallback, useEffect, useRef } from "react";
import Loading from "../Loading";
import CardMasonry from "./CardMasonry";

const FavoritesMasonry = () => {
  const [images, setImages] = React.useState<FavoriteImage[] | null>(null);
  const [noMore, setNoMore] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const { isFetching, setIsFetching } = useStore((state) => ({
    isFetching: state.isFetching,
    setIsFetching: state.setIsFetching,
  }));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { favoriteImages, favoriteImageIds } = useGetFavoriteImages();
  const { debounce, restoreScrollPosition, resetScrollPosition } = useScrollEvent(scrollContainerRef);
  const nsfw = useFilterStore((state) => state.nsfw);

  // 获取下一页的图片
  const fetchNextPage = useCallback(async () => {
    if (isFetching) return;

    // 屏蔽 nextjs 开发环境下的首次加载
    if (process.env.NEXT_PUBLIC_ENV === "development" && !sessionStorage.getItem("env")) {
      return sessionStorage.setItem("env", "dev");
    }

    /**
     * @todo 防止刷新页面时重复请求
     *
     * sessionStorage.getItem("debounce")：
     * - 如果是首次加载时，肯定不存在 debounce 属性，那么执行搜索逻辑
     *
     * debounce === 0：
     * - 如果存在 debounce 属性表示非首次加载，同时 debounce 为 0 表示组件重新渲染，可能时刷新或者其他情况，这种情况不是由滚动触发的，所以不执行搜索逻辑
     */
    if (sessionStorage.getItem("debounce") && debounce === 0) {
      const favoriteNsfw = sessionStorage.getItem("favorite-nsfw")!;
      if (favoriteNsfw === nsfw) {
        const favoriteIndex = sessionStorage.getItem("favorite-index")!;
        const getFavoritesResult = await getFavoritesByFilter(Number(favoriteIndex), nsfw);
        if (getFavoritesResult.code === 1 && getFavoritesResult.data) {
          setImages(null);
          setImages(getFavoritesResult.data);
        } else {
          // 其他逻辑
        }

        restoreScrollPosition();
        return;
      }
    }
    // 每次请求时都保存触发的时间戳，只有首次加载时值为 0，其他情况都是当前时间戳
    sessionStorage.setItem("debounce", debounce.toString());

    if (isFetching) return;
    setIsFetching(true);

    let index = 0;
    if (images && images.length > 0) {
      index = images[images.length - 1].index;
    }

    // 检查搜索条件是否发生变化
    let isFilterChanged = false;
    const favoriteNsfw = sessionStorage.getItem("favorite-nsfw")!;
    if (favoriteNsfw !== nsfw) {
      index = 0;
      setIsEmpty(false);
      setNoMore(false);
      setImages(null);
      isFilterChanged = true;
      resetScrollPosition();
    }

    const getFavoritesResult = await getFavoritesByFilter(index, nsfw);
    if (getFavoritesResult.code === 1 && getFavoritesResult.data) {
      if (getFavoritesResult.data.length === 0) {
        if (images && images.length > 0) {
          setNoMore(true);
        }
        if (isFilterChanged) {
          setIsEmpty(true);
        }
        setIsFetching(false);
        return;
      }

      // 分页信息
      sessionStorage.setItem("favorite-index", getFavoritesResult.data.slice(-1)[0]!.index.toString()!);
      sessionStorage.setItem("favorite-nsfw", nsfw);
      // 图片信息
      setImages((prev) => {
        if (prev) {
          return [...prev, ...getFavoritesResult.data!];
        } else {
          return [...getFavoritesResult.data!];
        }
      });
    } else {
      // 其他逻辑
    }

    setIsFetching(false);
  }, [debounce, images, isFetching, setIsFetching, nsfw, resetScrollPosition, restoreScrollPosition]);

  // 简易防抖机制，1s 内只发送一次请求
  useEffect(() => {
    fetchNextPage();
  }, [debounce, nsfw]);

  if (isEmpty) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">No images found</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden pb-4" ref={scrollContainerRef}>
      <CardMasonry images={images} favoriteIds={favoriteImageIds} />
      {isFetching && (
        <div className={`flex justify-center items-center mt-4 ${!images ? "h-full" : "h-28"}`}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default FavoritesMasonry;
