"use client";

import { useStore } from "@/store/useStore";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

/**
 * NoMore component
 *
 * 当滚动到底部时显示，表示没有更多内容了
 */
const NoMore = () => {
  const { noMore, isScorllBottom } = useStore((state) => ({
    noMore: state.noMore,
    isScorllBottom: state.isScrollBottom,
  }));
  const [isVisible, setIsVisible] = useState(noMore);

  useEffect(() => {
    if (noMore && isScorllBottom) {
      setIsVisible(true); // 设置为可见
      const timer = setTimeout(() => {
        useStore.setState({ noMore: false });
      }, 7000);
      return () => {
        clearTimeout(timer);
      };
    } else {
      // 设置定时器让渐变动画在隐藏前有时间完成
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // 500ms 的渐变时间
      return () => clearTimeout(fadeOutTimer);
    }
  }, [noMore, isScorllBottom]);

  // 通过 isVisible 控制是否显示该元素
  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-2 right-4 z-10 transition-opacity duration-500 ${noMore ? "opacity-100" : "opacity-0"}`} title="无更多内容">
      <Button variant="ghost" size="icon" disabled>
        <Ban size={20} className="text-black dark:text-white animate-no-more" />
      </Button>
    </div>
  );
};

export default NoMore;
