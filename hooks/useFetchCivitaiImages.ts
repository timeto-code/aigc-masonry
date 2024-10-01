import { isNextjsDevFirstLoad } from "@/lib/utils";
import { useEffect, useState } from "react";
import useCheckPageRefresh from "./useCheckPageRefresh";
import { useStore } from "@/store/useStore";
import useScrollEvent from "./useScrollEvent";
import { NSFW, PERIOD, SORT, useFilterStore } from "@/store/useFilterStore";
import { clearCivitaiHistory, createCivitaiHistory, getCivitaiHistory } from "@/actions/civitai";
import { CivitaiImage } from "@/types/prisma";
import useClearHistory from "./useClearHistory";
import useGetFavoriteImages from "./useGetFavoriteImages";

const fetchImage = async (nextPageUrl: string | null, nsfw: NSFW, sort: SORT, period: PERIOD) => {
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

  const firstPageUrl = `https://civitai.com/api/v1/images?${query}`;

  const url = nextPageUrl ?? firstPageUrl;

  return await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).then((res) => res.json());
};

const useFetchCivitaiImages = (divRef: React.RefObject<HTMLDivElement>, setImages: React.Dispatch<React.SetStateAction<CivitaiImage[] | null>>) => {
  // const { isRefresh } = useCheckPageRefresh();
  const { isFetching, setIsFetching } = useStore((state) => ({
    isFetching: state.isFetching,
    setIsFetching: state.setIsFetching,
  }));
  const { debounce, restoreScrollPosition, resetScrollPosition } = useScrollEvent(divRef);
  const { clearhistory, checkFilterChanged } = useClearHistory();
  const { refreshFavoriteImageIds } = useGetFavoriteImages();

  const { nsfw, period, sort } = useFilterStore((state) => {
    return {
      sort: state.sort,
      period: state.period,
      nsfw: state.nsfw,
    };
  });

  const fetchCivitaiImages = async () => {
    if (useStore.getState().isFetching) return;
    setIsFetching(true);

    // 首次加载时清空历史搜索记录
    if (!sessionStorage.getItem("init")) {
      sessionStorage.setItem("init", "true");
      await clearCivitaiHistory();
    }

    const nsfw = (sessionStorage.getItem("nsfw") as NSFW) ?? useFilterStore.getState().nsfw;
    const sort = (sessionStorage.getItem("sort") as SORT) ?? useFilterStore.getState().sort;
    const period = (sessionStorage.getItem("period") as PERIOD) ?? useFilterStore.getState().period;
    let nextPageUrl = sessionStorage.getItem("nextPage");

    // 检查条件是否发生变化
    if (checkFilterChanged()) {
      // 清空历史记录
      clearhistory();
      // 重置滚动位置
      resetScrollPosition();
      // 同步收藏信息
      refreshFavoriteImageIds(Date.now());
      // 重置图片列表
      setImages(null);
      // 重置 next page url
      nextPageUrl = null;
    }

    console.log("nextPageUrl", nextPageUrl);

    // 正常发送首页或下一页 API 请求
    if (!false) {
      const fetchImageResponse = await fetchImage(nextPageUrl, nsfw, sort, period);

      if (fetchImageResponse.code === 1 && fetchImageResponse.data) {
        // 保存下一页 URL
        sessionStorage.setItem("nextPage", fetchImageResponse.data.metadata.nextPage);
        // 创建本地历史记录
        const createImageResponse = await createCivitaiHistory(fetchImageResponse.data.items);

        if (createImageResponse.code === 1 && createImageResponse.data) {
          setImages((prev) => {
            return [...(prev ?? []), ...(createImageResponse.data ? createImageResponse.data : [])];
          });
        } else {
          // 创建本地历史记录失败
        }
      } else {
        // 请求 Civitai api 失败
      }
    }
    // 页面刷新时不发送 API 请求，直接读取本地历史记录
    else if (false) {
      const getImagesResponse = await getCivitaiHistory(nsfw);
      if (getImagesResponse.code === 1 && getImagesResponse.data) {
        setImages(null);
        setImages(getImagesResponse.data);
      } else {
        // 自动重试 3 次，每次间隔 1 秒，如果仍然失败，则提示用户
      }
      // 恢复刷新前的滚动位置
      restoreScrollPosition();
    }

    setIsFetching(false);
  };

  useEffect(() => {
    // 屏蔽 nextjs 开发环境下的首次加载
    if (isNextjsDevFirstLoad()) return;

    fetchCivitaiImages();
  }, [debounce, nsfw, period, sort]);

  return { isFetching };
};

export default useFetchCivitaiImages;
