import { getFavoritesByFilter } from "@/actions/favorite";
import { isNextjsDevFirstLoad } from "@/lib/utils";
import { NSFW, useFilterStore } from "@/store/useFilterStore";
import { useStore } from "@/store/useStore";
import { FavoriteImage } from "@/types/prisma";
import React, { useEffect } from "react";
import useGetFavoriteImages from "./useGetFavoriteImages";
import useScrollEvent from "./useScrollEvent";

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  setImages: React.Dispatch<React.SetStateAction<FavoriteImage[] | null>>;
}

const useFavoriteImages = ({ scrollContainerRef, setImages }: Props) => {
  const { isFetching, setIsFetching } = useStore((state) => ({
    isFetching: state.isFetching,
    setIsFetching: state.setIsFetching,
  }));
  const { debounce, resetScrollPosition } = useScrollEvent(scrollContainerRef);
  const nsfw = useFilterStore((state) => state.nsfw);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [nomore, setNomore] = React.useState(false);
  const { favoriteImageIds, refreshFavoriteImageIds } = useGetFavoriteImages();

  const fetchFavoriteImages = async () => {
    if (useStore.getState().isFetching) return;
    setIsFetching(true);

    const filterNsfw = (sessionStorage.getItem("nsfw") as NSFW) ?? nsfw;

    // 每次获取的数量
    let take = 20;
    // 初始化分页索引
    let index = 0;
    const sessionIndex = sessionStorage.getItem("favorite-index");
    if (!sessionIndex) {
      sessionStorage.setItem("favorite-index", "0");
    } else {
      index = Number(sessionIndex);
    }

    // 条件变化时重置 URL
    const isFilterChanged = useFilterStore.getState().isChanged;
    if (isFilterChanged) {
      // 重置索引
      index = 0;
      // 重置空提醒
      setIsEmpty(false);
      // 重置图片列表
      setImages(null);
      // 重置滚动位置
      resetScrollPosition();
      // 同步收藏信息
      refreshFavoriteImageIds(Date.now());
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
    if (!isFilterChanged && debounce === 0 && sessionStorage.getItem("debounce")) {
      index = 0;
      sessionStorage.removeItem("favorite-index");
      sessionStorage.removeItem("favorite-array-size");
      take = sessionStorage.getItem("favorite-array-size") ? Number(sessionStorage.getItem("favorite-array-size")) : take;
      // 恢复条件值
      useFilterStore.getState().restoreFilter();
      // 显示恢复刷新前的滚动位置按钮
      // useStore.getState().setShowRestoreScrollButton(true);
    }
    sessionStorage.setItem("debounce", debounce.toString());

    // 读取本地收藏信息
    const getFavoritesResult = await getFavoritesByFilter(index, filterNsfw, take);
    if (getFavoritesResult.code === 1 && getFavoritesResult.data) {
      if (getFavoritesResult.data.length) {
        // 更新索引
        sessionStorage.setItem("favorite-index", getFavoritesResult.data.slice(-1)[0]!.index.toString()!);
        sessionStorage.setItem("favorite-array-size", sessionStorage.getItem("favorite-array-size") ? (Number(sessionStorage.getItem("favorite-array-size")) + getFavoritesResult.data.length).toString() : take.toString());

        // 图片信息
        setImages((prev) => {
          if (prev) {
            return [...prev, ...getFavoritesResult.data!];
          } else {
            return [...getFavoritesResult.data!];
          }
        });
      } else {
        // 查询结果为空，并且时滚动触发的，那么显示没有更多
        setNomore(true);

        // 查询结果为空，并且时条件变更后的，那么显示空提醒
        if (isFilterChanged) {
          setIsEmpty(true);
          setNomore(false);
        }
      }
    } else {
      // 其他逻辑
    }

    setIsFetching(false);
  };

  useEffect(() => {
    // 屏蔽 nextjs 开发环境下的首次加载
    if (isNextjsDevFirstLoad()) return;

    fetchFavoriteImages();
  }, [debounce, nsfw]);

  return { isFetching, isEmpty, nomore, favoriteImageIds };
};

export default useFavoriteImages;
