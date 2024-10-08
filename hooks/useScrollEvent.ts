import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

const useScrollEvent = (scrollContainerRef: React.RefObject<HTMLDivElement>) => {
  const [debounce, setDebounce] = useState(0); // 简单防抖机制
  const [currentPosition, setCurrentPosition] = useState(0); // 用于恢复滚动位置按钮

  // 保存滚动条位置
  const saveScrollPosition = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      sessionStorage.setItem("scrollPosition", scrollContainer.scrollTop.toString());
      setCurrentPosition(scrollContainer.scrollTop);
    }
  };

  // 重置滚动位置至顶部
  const resetScrollPosition = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  };

  // 恢复滚动位置
  const restoreScrollPosition = (scrollPosition: string) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && scrollPosition) {
      scrollContainer.scrollTo(0, parseInt(scrollPosition, 10));
    }
  };

  // 处理滚动事件
  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollPosition = scrollContainer.scrollTop; // 滚动器位置
    const containerHeight = scrollContainer.clientHeight; // 容器窗口高度
    const fullHeight = scrollContainer.scrollHeight; // 容器内容总高度
    const distanceFromBottom = fullHeight - (scrollPosition + containerHeight); // 距离底部的距离

    // 根据滚动位置比例来判断是否触发逻辑
    const percentageFromBottom = (distanceFromBottom / fullHeight) * 100;

    // 当距离底部小于 20% 时触发逻辑
    if (percentageFromBottom <= 20) {
      setDebounce(Math.floor(Date.now() / 1000));
    }

    // 检查是否到达底部，用于显示 NoMore 组件
    useStore.setState({ isScrollBottom: percentageFromBottom.toFixed() === "0" });

    // 这里时防止意外刷新页面情况
    saveScrollPosition();
  };

  useEffect(() => {
    // 页面卸载或刷新时，存储滚动位置
    window.addEventListener("beforeunload", saveScrollPosition);

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("beforeunload", saveScrollPosition);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return { debounce, currentPosition, restoreScrollPosition, resetScrollPosition };
};

export default useScrollEvent;
