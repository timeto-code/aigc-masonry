"use client";

import { clearCivitaiHistory, createCivitaiHistory, getCivitaiHistory } from "@/actions/civitai";
import useGetFavoriteImages from "@/hooks/useGetFavoriteImages";
import useScrollEvent from "@/hooks/useScrollEvent";
import { NSFW, useFilterStore } from "@/store/useFilterStore";
import { useStore } from "@/store/useStore";
import { CivitaiImage } from "@/types/prisma";
import React, { useCallback, useEffect, useRef } from "react";
import Loading from "../Loading";
import CardMasonry from "./CardMasonry";

const CivitaiMasonry = () => {
  const [images, setImages] = React.useState<CivitaiImage[] | null>(null);
  const { isFetching, setIsFetching } = useStore((state) => ({
    isFetching: state.isFetching,
    setIsFetching: state.setIsFetching,
  }));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { favoriteImages, favoriteImageIds } = useGetFavoriteImages();
  const { debounce, restoreScrollPosition, resetScrollPosition } = useScrollEvent(scrollContainerRef);
  const { nsfw, period, sort } = useFilterStore((state) => {
    return {
      sort: state.sort,
      period: state.period,
      nsfw: state.nsfw,
    };
  });

  // 获取下一页的图片
  const fetchNextPage = useCallback(async () => {
    if (isFetching) return;

    // 屏蔽 nextjs 开发环境下的首次加载
    if (process.env.NEXT_PUBLIC_ENV === "development" && !sessionStorage.getItem("env")) {
      return sessionStorage.setItem("env", "dev");
    }

    // 首次加载时清空历史搜索记录
    if (!sessionStorage.getItem("init")) {
      sessionStorage.setItem("init", "true");
      await clearCivitaiHistory();
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
    if (sessionStorage.getItem("debounce") && debounce === 0 && sessionStorage.getItem("prevPage")) {
      const nextPageUrl2 = sessionStorage.getItem("nextPage")!;
      const params2 = new URL(nextPageUrl2).searchParams;
      const paramsObj2 = Object.fromEntries(params2.entries());
      if (paramsObj2.nsfw === nsfw && paramsObj2.sort === sort && paramsObj2.period === period) {
        const getImagesResponse = await getCivitaiHistory();
        if (getImagesResponse.code === 1 && getImagesResponse.data) {
          setImages(null);
          setImages(getImagesResponse.data);
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

    let nextPageUrl = "https://civitai.com/api/v1/images";
    if (images && images.length > 0) {
      nextPageUrl = sessionStorage.getItem("nextPage")!;
    } else {
      const params = {
        limit: "30",
        nsfw,
        sort,
        period,
        page: "1",
      };
      const query = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof typeof params])}`)
        .join("&");

      nextPageUrl = `${nextPageUrl}?${query}`;
    }

    // 检查搜索条件是否发生变化
    const params = new URL(nextPageUrl).searchParams;
    const paramsObj = Object.fromEntries(params.entries());
    if (paramsObj.nsfw !== nsfw || paramsObj.sort !== sort || paramsObj.period !== period) {
      const params = {
        limit: "30",
        nsfw: nsfw === NSFW.None ? "false" : nsfw === NSFW.Only ? "true" : nsfw,
        sort,
        period,
        page: "1",
      };
      const query = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof typeof params])}`)
        .join("&");

      nextPageUrl = `https://civitai.com/api/v1/images?${query}`;

      await clearCivitaiHistory();
      resetScrollPosition();
      setImages(null);
    }

    const fetchImageResponse = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextPageUrl }),
    }).then((res) => res.json());

    if (fetchImageResponse.code === 1 && fetchImageResponse.data) {
      // 分页信息
      sessionStorage.setItem("nextPage", fetchImageResponse.data.metadata.nextPage);

      // 图片信息
      const createImageResponse = await createCivitaiHistory(fetchImageResponse.data.items);
      if (createImageResponse.code === 1 && createImageResponse.data) {
        setImages((prev) => {
          if (prev) {
            return [...prev, ...(createImageResponse.data ? createImageResponse.data : [])];
          } else {
            return createImageResponse.data;
          }
        });
      } else {
        // 其他逻辑
      }
    } else {
      // 其他逻辑
    }

    setIsFetching(false);
  }, [debounce, isFetching, setIsFetching, nsfw, period, resetScrollPosition, restoreScrollPosition, sort, images]);

  // 简易防抖机制，1s 内只发送一次请求
  useEffect(() => {
    fetchNextPage();
  }, [debounce, nsfw, period, sort]);

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

export default CivitaiMasonry;
