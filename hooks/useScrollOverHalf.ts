import { useEffect, useState } from "react";

export default function useScrollOverHalf() {
  const [isScrolledOverHalf, setIsScrolledOverHalf] = useState(false);

  useEffect(() => {
    // 确保在浏览器环境中运行，避免 SSR 错误
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // 判断是否滚动过一半
      if (scrollPosition + windowHeight >= fullHeight / 2) {
        setIsScrolledOverHalf(true);
      } else {
        setIsScrolledOverHalf(false);
      }
    };

    // 绑定滚动事件
    window.addEventListener("scroll", handleScroll);

    // 清除事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // 空依赖数组，确保只在组件挂载和卸载时运行

  return isScrolledOverHalf;
}
