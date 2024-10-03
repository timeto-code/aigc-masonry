import useScrollEvent from "@/hooks/useScrollEvent";
import { useStore } from "@/store/useStore";
import { CircleFadingArrowUp } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const RestoreScrollButton = ({ scrollContainerRef }: Props) => {
  const showRestoreScrollButton = useStore((state) => state.showRestoreScrollButton);
  const { currentPosition, restoreScrollPosition } = useScrollEvent(scrollContainerRef);
  const historyRef = useRef<string>("0");

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      historyRef.current = scrollPosition;
    }
  }, []);

  useEffect(() => {
    const history = historyRef.current;
    console.log(`history`, history);

    if (!currentPosition || !history) return;

    if (currentPosition > parseInt(history, 10)) {
      useStore.getState().setShowRestoreScrollButton(false);
    }
  }, [currentPosition]);

  if (!showRestoreScrollButton) return null;

  return (
    <div className="fixed top-2 right-4 z-10 flex flex-col space-y-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-black/50 dark:text-white/50 "
        onClick={() => {
          // 恢复刷新前的滚动位置
          restoreScrollPosition(historyRef.current);
          // 隐藏恢复滚动按钮
          useStore.getState().setShowRestoreScrollButton(false);
          // 清除滚动位置历史记录
          sessionStorage.removeItem("positionHistory");
        }}
      >
        <CircleFadingArrowUp className="rotate-180" size={20} />
      </Button>
    </div>
  );
};

export default RestoreScrollButton;
