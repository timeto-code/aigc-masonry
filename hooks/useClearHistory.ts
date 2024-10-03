import { clearCivitaiHistory } from "@/actions/civitai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const useClearHistory = () => {
  const Pathname = usePathname();

  const clearhistory = async () => {
    await clearCivitaiHistory();
  };

  useEffect(() => {
    // 当组件挂载时，获取上一次保存的路径
    const historyPathname = sessionStorage.getItem("historyPathname");

    // 如果路径历史路径不是 /civitai，但是当前路径是 /civitai，表示是从其他页面跳转过来的
    if (historyPathname !== "/civitai" && Pathname === "/civitai") {
      clearhistory();
    }

    // 保存当前路径
    return () => {
      sessionStorage.setItem("historyPathname", Pathname);
    };
  }, []);

  return { clearhistory };
};

export default useClearHistory;
