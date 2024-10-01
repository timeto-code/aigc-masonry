import { clearCivitaiHistory, createCivitaiHistory, getCivitaiHistory } from "@/actions/civitai";
import { isNextjsDevFirstLoad } from "@/lib/utils";
import { NSFW, PERIOD, SORT, useFilterStore } from "@/store/useFilterStore";
import { useStore } from "@/store/useStore";
import { CivitaiImage } from "@/types/prisma";
import { useEffect } from "react";
import useClearHistory from "./useClearHistory";
import useGetFavoriteImages from "./useGetFavoriteImages";
import useScrollEvent from "./useScrollEvent";

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
  const { isFetching, setIsFetching } = useStore((state) => ({
    isFetching: state.isFetching,
    setIsFetching: state.setIsFetching,
  }));
  const { debounce, restoreScrollPosition, resetScrollPosition } = useScrollEvent(divRef);
  const { clearhistory } = useClearHistory();
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

    // 条件变化时重置 URL
    const isFilterChanged = useFilterStore.getState().isChanged;
    if (isFilterChanged) {
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
      // 重置条件变化状态
      useFilterStore.getState().setChanged(false);
    }

    /**
     * 设置 isRefresh 判断是否为刷新动作
     *
     * 如果不是条件更新触发的请求，那么判断 debounce 值。
     * 如果时正常的滚动触发的请求，那么 debounce 不可能为 0，为 0 则表示组件新渲染的，这时需要判断 sessionStorage 的 debounce 值。
     * 首次渲染时 storage 是没有 debounce 属性的，从而分辨是首次渲染还是刷新后重新渲染的。
     */
    let isRefresh = false;
    if (!isFilterChanged && debounce === 0 && sessionStorage.getItem("debounce")) {
      isRefresh = true;
    }
    sessionStorage.setItem("debounce", debounce.toString());

    // 正常发送首页或下一页 API 请求
    if (!isRefresh) {
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
    else if (isRefresh) {
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
